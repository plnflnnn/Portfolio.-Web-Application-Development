import { useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../functions';

import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredItems } from '../slices/itemsSlice';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from '../components/Loading';
import NotFoundItems from './NotFoundItems';

  
export default function Category() {

    const {categoryName} = useParams();
    const capitalizedCategory = capitalizeFirstLetter(categoryName);

    const itemsLoadingStatus = useSelector(
        (state) => state.items.filteredItemsLoadingStatus
    );

    const items = useSelector(
        (state) => state.items.filteredItems
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilteredItems(categoryName));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        dispatch(fetchFilteredItems(categoryName));
        // eslint-disable-next-line
    }, [categoryName]);

    if (itemsLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (itemsLoadingStatus === 'error' || items.length === 0) {
        return <NotFoundItems></NotFoundItems>
    }

    const renderItems = (data) => {
      return (
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
              <h2 className="text-2xl font-bold text-gray-900">{capitalizedCategory}</h2>

              <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {data.map((item, i) => (
                  <div key={i} className="group relative mb-5">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <img
                      src={item.item_src}
                      alt={item.item_name}
                      className="h-full w-full object-cover object-center"
                      />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                      <Link to={`/products/${item.item_category}/${item.item_name}`}>
                      <span className="absolute inset-0" />
                      {item.item_name}
                      </Link>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">${item.item_price} per pound</p>
                  </div>
              ))}
              </div>
            </div>
          </div>
      </div>
      )
    }

    const render = renderItems(items);

    return (
        <>
            <Header/>
                {render}
            <Footer/>
        </>
    )
  }
  