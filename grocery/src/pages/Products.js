import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { fetchAllItems } from '../slices/itemsSlice';
import { selectAll } from '../slices/itemsSlice'; 
import store from '../store/index';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import NotFoundItems from "./NotFoundItems";
  
export default function Products() {

    const itemsLoadingStatus = useSelector(
        (state) => state.items.itemsLoadingStatus
    );

    const items = selectAll(store.getState());

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllItems());
        // eslint-disable-next-line
    }, []);

    if (itemsLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (itemsLoadingStatus === 'error' || items.length === 0) {
        return  <NotFoundItems/>
    }

    const renderItems = (arr) => {
        return arr.map(({item_category, item_name, item_src, item_price, id}) => {
            return (
                <Link to={`/products/${item_category}/${item_name}`} key={id} className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img 
                        src={item_src}
                        alt={item_name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">{item_name}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">${item_price} per pound</p>
                </Link>
            )
        })
    }

    const render = renderItems(items);

    return (
        <>
            <Header/>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>
            
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {render}
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
  }
  