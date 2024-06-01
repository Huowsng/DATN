import os
from typing import List

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from predictor import predictor
from PIL import Image
import numpy as np
import cv2 as cv2
import io
import rarfile
from dotenv import load_dotenv
import requests

load_dotenv()  # Load environment variables from .env file

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hi, thanks used me for your DATN ^_^"}

@app.post("/image-search")
async def image_search(image: UploadFile = File(...)):
    print("hehehheheheh")
    image_data = await image.read()
    image_pil = Image.open(io.BytesIO(image_data))
    img = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    
    store_path = "image"
    if not os.path.exists(store_path):
        os.makedirs(store_path)
        
    file_name = image.filename
    dst_path = os.path.join(store_path, file_name)
        
    if img is not None and img.size != 0:
        cv2.imwrite(dst_path, img)
        print("Hình ảnh đã được lưu tại:", dst_path)
    else:
        print("Mảng hình ảnh trống hoặc không hợp lệ.")

    base_path = os.getenv('BASE_PATH')
    rar_file_name = os.getenv('RAR_FILE_NAME')
    csv_file_name = os.getenv('CSV_FILE_NAME')
    
    if not base_path or not rar_file_name or not csv_file_name:
        raise HTTPException(status_code=500, detail="Missing environment variable configurations")

    csv_path = Path(base_path) / csv_file_name
    rar_path = Path(base_path) / rar_file_name
 
    # Extract h5.rar to get Search.h5
    if not rar_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {rar_path}")
    
    try:
        with rarfile.RarFile(rar_path) as rf:
            rf.extract('Search.h5', base_path)
    except rarfile.RarCannotExec as e:
        raise HTTPException(status_code=500, detail=f"Error extracting RAR file: {e}")

    model_path = Path(base_path) / 'Search.h5'
    if not model_path.exists():
        raise HTTPException(status_code=404, detail=f"Extracted file not found: {model_path}")

    klass, prob, img, df = predictor(store_path, csv_path, model_path, averaged=True, verbose=False)
    print(klass)
    print(f'{prob * 100: 6.2f}')
    
    if store_path is not None:
        for filename in os.listdir(store_path):
            file_path = os.path.join(store_path, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Không thể xóa tệp {file_path}: {e}")
    return klass

@app.post("/product-analysis")
async def product_analysis(images: List[str]):
    print("hahahahhaha")
    analyzed_results = []
    for image_url in images:
        # Download the image
        response = requests.get(image_url)
        image_data = response.content
        image_pil = Image.open(io.BytesIO(image_data))
        img = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
        
        # Save image locally
        store_path = "product_images"
        if not os.path.exists(store_path):
            os.makedirs(store_path)
        file_name = os.path.basename(image_url)
        dst_path = os.path.join(store_path, file_name)
        cv2.imwrite(dst_path, img)
        
        # Predict using the model
        base_path = os.getenv('BASE_PATH')
        csv_path = Path(base_path) / os.getenv('CSV_FILE_NAME')
        model_path = Path(base_path) / 'Search.h5'
        klass, prob, img, _ = predictor(store_path, csv_path, model_path, averaged=True, verbose=False)
        
        analyzed_results.append({
            "image": image_url,
            "category": klass,
            "probability": prob
        })
        
        # Clean up
        os.unlink(dst_path)
    
    # Sort analyzed_results based on probability in descending order
    analyzed_results.sort(key=lambda x: x["probability"], reverse=True)
    return analyzed_results

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
