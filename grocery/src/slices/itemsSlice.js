import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { apiUrl } from '../functions';

const itemsAdapter = createEntityAdapter();

const initialState = itemsAdapter.getInitialState({
    itemsLoadingStatus: 'idle',
    filteredItemsLoadingStatus: 'idle',
    itemLoadingStatus: 'idle',
    items: [],
    filteredItems: [],
    item: {},
    itemName: ''
});

export const fetchAllItems = createAsyncThunk(
    'items/fetchAllItems',
    async () => {
        const result = await fetch(`${apiUrl}/all`);
        const data = result.json();
        return data;
    }
);

export const fetchFilteredItems = createAsyncThunk(
    'items/fetchFilteredItems',
    async (itemsCategory) => {
        const result = await fetch(`${apiUrl}/${itemsCategory}`);
        const data = result.json();
        return data;
    }
);

const itemsSlice = createSlice({
    name: 'allItems',
    initialState,
    reducers: {
        itemNameChanged: (state, action) => {
            state.itemName = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllItems.pending, state => {state.itemsLoadingStatus = 'loading'})
            .addCase(fetchAllItems.fulfilled, (state, action) => {
                state.itemsLoadingStatus = 'idle';
                itemsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchAllItems.rejected, state => {
                state.itemsLoadingStatus = 'error';
            })
            .addCase(fetchFilteredItems.pending, state => {state.filteredItemsLoadingStatus = 'loading'})
            .addCase(fetchFilteredItems.fulfilled, (state, action) => {
                state.filteredItemsLoadingStatus = 'idle';
                state.filteredItems = action.payload;
            })
            .addCase(fetchFilteredItems.rejected, state => {
                state.filteredItemsLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const { actions, reducer} = itemsSlice;

export default reducer;

export const {selectAll} = itemsAdapter.getSelectors(state => state.items);

export const {itemNameChanged} = actions;