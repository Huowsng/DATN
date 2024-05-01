import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

function Filters() {
    const state = useContext(GlobalState);
    const [categories] = state.categoriesAPI.categories;

    const [category, setCategory] = state.productsAPI.category;
    const [sort, setSort] = state.productsAPI.sort;
    const [search, setSearch] = state.productsAPI.search;
    console.log(search);
    const handleCategory = (e) => {
        setCategory(e.target.value);
        setSearch('');
    };

    console.log(state.productsAPI.search, 'search');

    return (
        <div className="filter_menu">
            <div className="row">
                {/* <span>Lọc: </span> */}
                <select name="category" value={category} onChange={handleCategory}>
                    <option value="">全部カテゴリー</option>
                    {categories.map((category) => (
                        <option value={'category=' + category._id} key={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                type="text"
                value={search}
                placeholder="アイテムを検索"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />

            <div className="row sort">
                {/* <span>Xếp theo: </span> */}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">新しいSản phẩm</option>
                    <option value="sort=oldest">古いSản phẩm</option>
                    <option value="sort=-sold"> Sản phẩm</option>
<<<<<<< HEAD
                    <option value="sort=-price">Giá : cao-thấp</option>
                    <option value="sort=price">Giá: thấp-cao</option>
                    <option value="sort=createdAt">Ngày: Tăng dần</option>
                    <option value="sort=-createdAt">Ngày: Giảm dần</option>
=======
                    <option value="sort=-price">Loại: 高い-安い</option>
                    <option value="sort=price">Loại:安い-高い</option>
>>>>>>> parent of 73e918b (1/5)
                </select>
            </div>
        </div>
    );
}

export default Filters;
