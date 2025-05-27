import { configureStore } from "@reduxjs/toolkit";
import goods from '../components/pages/commonComponents/Goods/goodsSlice';
import filters from '../components/filter/filterSlice';
import bestGoods from '../components/pages/MainPage/bestGoodsSlice';


const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
};

const store = configureStore({
    reducer: {goods, filters, bestGoods},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;