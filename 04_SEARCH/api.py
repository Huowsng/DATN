import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import uvicorn
import argparse
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from predictor import predictor
import requests
from PIL import Image
import numpy as np
import pandas as pd
import cv2 as cv2
import io
import rarfile

class App:
    def __init__(self) -> None:
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        @self.app.get("/")
        async def root():
            return {"message": "hello"}

        @self.app.post("/image-search")
        async def image_search(image: UploadFile = File(...)):
            print("1111111111111")
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
  
            csv_path = Path('/04_SEARCH/class_dict.csv')
     
            # Giải nén file h5.rar để lấy file search.h5
            rar_path = '/04_SEARCH/h5.rar'
            with rarfile.RarFile(rar_path) as rf:
                rf.extract('search.h5', '/04_SEARCH/')

            model_path = Path('/04_SEARCH/search.h5')

            klass, prob, img, df  = predictor(store_path, csv_path, model_path, averaged=True, verbose=False)
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

    def run(self, port: int):
        uvicorn.run(self.app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    app = App()
    app.run(port=args.port)
