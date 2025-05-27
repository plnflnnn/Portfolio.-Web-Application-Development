import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: []
};

const goodsSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        itemAddToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeItem: (state, action) => {
            state.cart = state.cart.filter((item, i) => i !== action.payload);
        },
        updateQuantity: (state, action) => {
            const index = state.cart.findIndex((object, i) => {
                return i === action.payload.id;
            });
            state.cart[index].item_quantity = +action.payload.value;
        },
        clearCart: (state, action) => {
            state.cart = [];
            state.totalPrice = 0;
            localStorage.removeItem('items');
        },
        updateLocalStore: (state, action) => {
            localStorage.removeItem('items');
            localStorage.setItem('items', JSON.stringify(state.cart));
        }
    },
    extraReducers: () => {}
});

const { actions, reducer} = goodsSlice;

export default reducer;

export const {itemAddToCart, removeItem, updateQuantity, clearCart, updateLocalStore} = actions;