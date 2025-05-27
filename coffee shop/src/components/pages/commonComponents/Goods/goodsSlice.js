import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { useHttp } from '../../../../hooks/http.hook';

const goodsAdapter = createEntityAdapter();

const initialState = goodsAdapter.getInitialState({
    goodsLoadingStatus: 'idle',
    coffeeId: ''
});

export const fetchGoods = createAsyncThunk(
    'goods/fetchGoods',
    async () => {
        const {request} = useHttp();
        return await request('https://backend-url/coffee');
    }
);

const goodsSlice = createSlice({
    name: 'goods',
    initialState,
    reducers: {
        coffeeIdChanged: (state, action) => {
            state.coffeeId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoods.pending, state => {state.goodsLoadingStatus = 'loading'})
            .addCase(fetchGoods.fulfilled, (state, action) => {
                state.goodsLoadingStatus = 'idle';
                goodsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchGoods.rejected, state => {
                state.goodsLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const { actions, reducer} = goodsSlice;

export default reducer;

export const {selectAll} = goodsAdapter.getSelectors(state => state.goods);

const activeAllBtn = () => {
    document.querySelectorAll('.filter_button').forEach(btn => {
        if (btn.textContent === 'All') {
            btn.classList.add('active');
        }
    });
}

const allBtnIsNotActive = () => {
    document.querySelectorAll('.filter_button').forEach(btn => {
        if (btn.textContent === 'All') {
            btn.classList.remove('active');
        }
    });
}
export const filteredGoodsSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, goods) => {
        switch (filter) {
            case '':
                activeAllBtn();
                return goods;
            case 'All':
                return goods;
            case 'Brazil':
                allBtnIsNotActive();
                return goods.filter(item => item.country === 'Brazil');
            case 'Kenya':
                allBtnIsNotActive();
                return goods.filter(item => item.country === 'Kenya');
            case 'Columbia':
                allBtnIsNotActive();
                return goods.filter(item => item.country === 'Columbia');
            default:
                return goods.filter(item => item.name.toLowerCase().indexOf(filter) > -1);
        }
    }
);

export const {coffeeIdChanged} = actions;