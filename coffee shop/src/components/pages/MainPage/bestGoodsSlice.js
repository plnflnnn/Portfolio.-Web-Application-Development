import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { useHttp } from '../../../hooks/http.hook';

const bestGoodsAdapter = createEntityAdapter();

const initialState = bestGoodsAdapter.getInitialState({
    bestGoodsLoadingStatus: 'idle'
});

export const fetchBestGoods = createAsyncThunk(
    'bestGoods/fetchBestGoods',
    async () => {
        const {request} = useHttp();
        return await request('https://backend-url/best');
    }
);

const bestGoodsSlice = createSlice({
    name: 'bestGoods',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBestGoods.pending, state => {state.bestGoodsLoadingStatus = 'loading'})
            .addCase(fetchBestGoods.fulfilled, (state, action) => {
                state.bestGoodsLoadingStatus = 'idle';
                bestGoodsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchBestGoods.rejected, state => {
                state.bestGoodsLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {reducer} = bestGoodsSlice;

export default reducer;

export const {selectAll} = bestGoodsAdapter.getSelectors(state => state.bestGoods);

