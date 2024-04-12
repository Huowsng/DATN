import React from 'react';
import { Service } from './ourservice/Service';
import NBanner from './NBanner/NBanner';
import AdvSafety from '../Adv/AdvSafety';
import CService from '../CService/CService';
import { GlobalState } from '../../../GlobalState';
import { useContext, useState } from 'react';

export const Home = ({ hideHeaderPaths = [] }) => {
    const state = useContext(GlobalState);

    const [products, setProducts] = state.productsAPI.products;
    console.log(products);
    return (
        <>
            <div className="home-container">
                <NBanner />
                {/* <Service />
                <AdvSafety />
                <CService /> */}
            </div>
        </>
    );
};
