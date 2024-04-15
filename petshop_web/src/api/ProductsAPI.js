import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsAPI() {
    const [products, setProducts] = useState([]);
    const [callback, setCallback] = useState(false);
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [result, setResult] = useState(0);
    const test = 'aaaaaa';

    useEffect(() => {
        const getProducts = async () => {
            const res = await axios.get(`/api/products?limit=${page * 9}&${category}&${sort}&title[regex]=${search}`);
            // console.log('price' + JSON.stringify(res.data.products[0].types));
            // console.log(res.data.products.types.length)
            setProducts(res.data.products);
            setResult(res.data.result);
        };
        getProducts();
    }, [callback, category, sort, search, page]);

    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult],
        test,
    };
}

export default ProductsAPI;