import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../functions";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity, itemAddToCart, updateLocalStore } from "../slices/cartSlice";
import {loadStripe} from '@stripe/stripe-js';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Cancel from './Cancel'
import '../output.css'

const stripePublicKey = '';

export default function Cart() {
    const [totalPrice, setTotalPrice] = useState(0);

    const cartItems = useSelector(
        (state) => state.cart.cart
    )

    const dispatch = useDispatch();

    useEffect(() => {
        setTotalPrice(total);

        const items = JSON.parse(localStorage.getItem('items'));

        if (cartItems.length === 0 && items) {
            items.map((item) => dispatch(itemAddToCart(item)));
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const total = calcPrice();
        setTotalPrice(total)

        // eslint-disable-next-line
    }, [cartItems]);

    const onDelete = (name) => {
        dispatch(removeItem(name))
        dispatch(updateLocalStore())
    }

    const calcPrice = () => {
        const prices = [];
        cartItems.forEach(item => {
            prices.push(item.item_price * item.item_quantity)
        })
        const result = +prices.reduce((a, b) => a + b, 0);
        return +result.toFixed(2);
    }

    const total = calcPrice();

    let itemsList  = []

    const items = cartItems.map((obj) => {
        let price = obj.item_price * 100;
        let roundedPrice = Math.round(price)
        return (
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: obj.item_name,
                        images: [obj.item_src]
                    },
                    unit_amount: roundedPrice,
                    },
                    quantity: obj.item_quantity,
            }
        )
    })

    items.forEach((obj) => itemsList.push(obj))

    const onClick = async (e) => {
        const stripe = await loadStripe(stripePublicKey);

        const response = await fetch(`${apiUrl}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemsList: itemsList
            })
        })

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId:session.id
        })

        if (result.error) {
            console.log(result.error)
            return <Cancel/>
        }
    }

    const onChange = (e) => {
        let value = +e.target.value;
        const id = +e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
        dispatch(updateQuantity({id, value}))
        dispatch(updateLocalStore())
    }

    const renderItems = (items) => {
        if(items.length === 0) {
            return (
                <div className="h-96 text-center pt-10 mt-0 mr-auto ml-auto pb-10">
                    <h1 className="mt-10 pt-10"> Cart is empty </h1>
                </div>
            )
        } else if (items.length > 0) {
            return (
                <form 
                onSubmit={(e) => e.preventDefault()}
                    className="cart__form">
                    <section aria-labelledby="cart-heading" className="cart__heading">
                        <ul className="cart__items">
                            {items.map(({item_name, item_src, item_category, item_price, item_quantity}, i) => (
                                        <li id={i} key={i} className="cart__items_item">
                                        <div className="cart__item_img">
                                            <img src={item_src} alt={item_name}
                                            className="cart__item_img-img"/>
                                        </div>
                                        <div className="cart__items_info">
                                            <div className="cart__items_info-main">
                                            <div>
                                            <div className="cart__item_name">
                                                <h3 className="cart__item_title">
                                                    <Link to={`${apiUrl}/products/${item_category}/${item_name}`} className="cart__item_link">{item_name}</Link>
                                                </h3>
                                            </div>
                                            <p className="cart__item_price">${item_price}</p>
                                        </div>
                                        <div className="cart__item_quantity">
                                            <label htmlFor="quantity-0" className="cart__item_quantity-label">Pounds</label>
                                            <select id="quantity-0" name="quantity-0" 
                                                onChange={(e) => onChange(e)}
                                                defaultValue={item_quantity}
                                                className="cart__item_quantity-select">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                            </select>
                                            <div className="cart__item_remove">
                                                <button 
                                                    onClick={() => onDelete(i)}
                                                    type="button" 
                                                    className="btn_remove">
                                                    <span 
                                                    className="btn_remove-text">Remove</span>
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                        <p className="cart__item-availability">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="cart__item-availability-instock"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"  clipRule="evenodd"></path>
                                            </svg>
                                            <span>In stock</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
    
    
                    <section aria-labelledby="summary" className="summary">
                        <h2 id="summary-heading" className="summary-heading">Order summary</h2>
                        <div className="summary__price">
                                <h3 className="summary__price-title">Order total</h3>
                                <p className="summary__price">${totalPrice}</p>
                        </div>
    
                        <button
                        type="submit"
                        onClick={(e) => onClick(e)}
                        className="submit mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-black-600 px-8 py-3 text-base font-medium text-white hover:bg-black-700 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 bg-black" >
                        Checkout
                    </button>
                    </section>
                </form>
            )
        }
    }

    const render = renderItems(cartItems);

    return (
        <>
            <Header/>
            <main className="cart mx-auto max-w-7xl items-center p-6 lg:px-8"> 
                <h1 className="cart__title">Shopping Cart</h1>
                {render}
            </main>
            <Footer/>
        </>
    )
}