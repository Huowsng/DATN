import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';


import { Link } from 'react-router-dom';

function Postnews() {
    const state = useContext(GlobalState);
    const [products, setProducts] = state.productsAPI.products;
    console.log(products);
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const [callback, setCallback] = state.productsAPI.callback;
   
   
    


    return (
        <>
       
           

            
        </>
    );
}

export default Postnews;
