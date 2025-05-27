import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../functions';
import { useDispatch, useSelector } from 'react-redux';
import { itemNameChanged , fetchAllItems, selectAll} from '../slices/itemsSlice';
import { itemAddToCart, updateLocalStore } from '../slices/cartSlice';
import store from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import NotFoundItems from './NotFoundItems';

export default function Item() {
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    const {categoryName , itemName} = useParams();

    const capitalizedCategory = capitalizeFirstLetter(categoryName);

    const itemsLoadingStatus = useSelector(
        (state) => state.items.itemsLoadingStatus
    );

    const cart = useSelector(
        (state) => state.cart.cart
    );

    const items = selectAll(store.getState());

    const item = items.filter(item => item.item_name === itemName);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllItems());
        dispatch(itemNameChanged(itemName));
        // eslint-disable-next-line
    }, []);

    if (itemsLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (itemsLoadingStatus === 'error' || items.length === 0) {
        return <NotFoundItems></NotFoundItems>
    }

    const onChange = (e) => {
        let value = e.target.value;
        setQuantity(value);
    }

    const notification = () => {
        if(message !== '') {
            return <p className='mt-2 text-center text-sm'>{message}</p>
        }

        setTimeout(() => {
            setMessage('');
        }, 3000)
    }

    const notify = notification();

    const renderItems = (arr) => {
        return arr.map(({item_category, item_name, item_src, item_price, id}) => {

            const cartItem = {
                item_name: item_name,
                item_category: item_category,
                item_src: item_src,
                item_price: item_price,
                id: id,
                item_quantity: quantity
            }

            const onClick = (e) => {
                e.preventDefault();

                const dublicate = cart.some((item) => item.item_name === item_name);

                if (dublicate) {
                    setMessage('You already have this item in the cart');
                } else {
                    dispatch(itemAddToCart(cartItem));
                    setMessage('Item added to cart');
                    dispatch(updateLocalStore())
                }
            }

            return (
                <div key={id} className="bg-white">
                <div className="pt-6">
                    <nav aria-label="Breadcrumb">
                    <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li id={id}>
                            <div className="flex items-center">
                            <Link to={`/products`}  className="mr-2 text-sm font-medium text-gray-900">
                                Products
                            </Link>
                            <svg
                                width={16}
                                height={20}
                                viewBox="0 0 16 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="h-5 w-4 text-gray-300"
                            >
                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                            </svg>
                            </div>
                        </li>
                        <li className="text-sm">
                        <Link to={`/products/${item_category}`} aria-current="page" className="mr-2 text-sm font-medium text-gray-500">
                            {capitalizedCategory}
                        </Link>
                        </li>
                    </ol>
                    </nav>
    
                    <div className="mx-auto mt-6 max-w-2xl sm:px-6 ">
                        <div className="aspect-h-3 aspect-w-4 lg:aspect-h-3 lg:aspect-w-4 sm:overflow-hidden sm:rounded-lg">
                            <img 
                                src={item_src}
                                alt={item_name}
                            className="h-2/3 w-full object-cover object-center"
                            />
                        </div>
                    </div>
    
                    {/* Product info */}
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{item_name}</h1>
                    </div>
    
                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">${item_price} per pound</p>
    
                        <form className="mt-4">
                            <input type="number" className='item_quantity' name={item_name} min="1" max="100"
                            onChange={(e) => onChange(e)}
                            value={quantity}
                            />
    
                            <button
                                onClick={onClick}
                                type="submit"
                                className="submit mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add to bag
                            </button>
                        </form>

                        {notify}
                    </div>
    
                    {/* Description */}
                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-100 lg:pb-16 lg:pr-8 lg:pt-6">
                        <div>
                        <h3 className="sr-only">Description</h3>
    
                        <div className="space-y-6">
                            <p className="text-base text-gray-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            )
        })
    }

    const render = renderItems(item);

    return (
        <>
            <Header/>
                {render}
            <Footer/>
        </>
    )
}
