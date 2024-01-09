import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import apiUtils from '../../global/utils/api';

import {
  handleCreateFulfilled
  , handleFetchSingleIfNeeded
  , handleFetchSinglePending
  , handleFetchSingleFulfilled
  , handleFetchSingleFromListFulfilled
  , handleFetchSingleRejected
  , handleFetchListIfNeeded
  , handleFetchListPending
  , handleFetchListFulfilled
  , handleFetchListRejected
  , handleMutationPending
  , handleMutationFulfilled
  , handleMutationRejected
  , handleDeletePending
  , handleDeleteFulfilled
  , handleDeleteRejected
  , INITIAL_STATE
  , handleInvalidateQuery
  , handleInvalidateQueries
  , handleAddSingleToList
  , handleAddManyToList
  , handleRemoveManyFromList
} from '../../global/utils/storeUtils';


// First define all API calls for product
/**
 * The functions below, called thunks, allow us to perform async logic. They
 * can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
 * will call the thunk with the `dispatch` function as the first argument. Async
 * code can then be executed and other actions can be dispatched. Thunks are
 * typically used to make async requests.
 * 
 * In practice we won't dispatch these directly, they will be dispatched by productService which has a nicer api built on hooks.
 */

// CREATE
export const sendCreateProduct = createAsyncThunk(
  'product/sendCreate'
  , async ({ endpoint, method = 'POST', ...newProduct }) => {
    endpoint = endpoint ? `/api/products/${endpoint}` : `/api/products`;
    const response = await apiUtils.callAPI(endpoint, method, newProduct);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// READ
export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingle'
  , async (id) => {
    const endpoint = `/api/products/${id}`;
    const response = await apiUtils.callAPI(endpoint);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);
export const fetchProductList = createAsyncThunk(
  'product/fetchList' // this is the action name that will show up in the console logger.
  , async (listArgs) => {
    const endpoint = `/api/products${listArgs}`;
    const response = await apiUtils.callAPI(endpoint);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// for each resource we can add as many endpoints as we want in this format and we only need two actions to handle them.
export const fetchSingleProductAtEndpoint = createAsyncThunk(
  'product/fetchSingleWithFilter' // this is the action name that will show up in the console logger.
  , async (query) => {
    const endpoint = `/api/products${query}` // example: `/api/products/logged-in?${queryString}`
    const response = await apiUtils.callAPI(endpoint);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);
export const fetchProductListAtEndpoint = createAsyncThunk(
  'product/fetchListWithFilter' // this is the action name that will show up in the console logger.
  , async (query) => {
    const endpoint = `/api/products${query}`; // example: `/api/products/logged-in?${queryString}`
    const response = await apiUtils.callAPI(endpoint);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// UPDATE
/**
 * @param {object} args - the updated product object plus the optional endpoint and method
 * @param {string} args.endpoint - the endpoint to send the update to (optional)
 * @param {string} args.method - the http method to use (optional, defaults to PUT)
 */
export const sendUpdateProduct = createAsyncThunk(
  'product/sendUpdate'
  , async ({ endpoint, method = 'PUT', ...updates }) => {
    const { _id } = updates;
    endpoint = endpoint ? `/api/products/${endpoint}` : `/api/products/${_id}`;
    const response = await apiUtils.callAPI(endpoint, method, updates);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// DELETE
export const sendDeleteProduct = createAsyncThunk(
  'product/sendDelete'
  , async (id) => {
    const endpoint = `/api/products/${id}`;
    const response = await apiUtils.callAPI(endpoint, 'DELETE');
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

// next define the store's initial state, all of our store utils rely on a specific state shape, so use the constant
const initialState = { ...INITIAL_STATE };

// define the productSlice. This is a combination of actions and reducers. More info: https://redux-toolkit.js.org/api/createSlice
export const productSlice = createSlice({
  name: 'product'
  , initialState
  /**
   * The `reducers` field lets us define reducers and generate associated actions.
   * Unlike the selectors defined at the bottom of this file, reducers only have access
   * to this specific reducer and not the entire store.
   * 
   * Again, we will not dispatch these directly, they will be dispatched by productService.
   */
  , reducers: {
    invalidateQuery: handleInvalidateQuery
    , invalidateQueries: handleInvalidateQueries
    , addProductToList: handleAddSingleToList
    , addProductsToList: handleAddManyToList
    , removeProductsFromList: handleRemoveManyFromList
  }

  /**
   * The `extraReducers` field lets the slice handle actions defined elsewhere,
   * including actions generated by createAsyncThunk or in other slices.
   * We'll use them to track our server request status.
   * 
   * We'll add a case for each API call defined at the top of the file to dictate
   * what happens during each API call lifecycle.
   */
  , extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(sendCreateProduct.fulfilled, handleCreateFulfilled)

      // READ
      .addCase(fetchSingleProduct.pending, handleFetchSinglePending)
      .addCase(fetchSingleProduct.fulfilled, handleFetchSingleFulfilled)
      .addCase(fetchSingleProduct.rejected, handleFetchSingleRejected)
      .addCase(fetchProductList.pending, handleFetchListPending)
      // because lists are returned from the server named for their resource, we need to pass a `listKey` so the util can properly handle the response
      .addCase(fetchProductList.fulfilled, (state, action) => handleFetchListFulfilled(state, action, 'products'))
      .addCase(fetchProductList.rejected, handleFetchListRejected)
      // permission protected single fetches
      .addCase(fetchSingleProductAtEndpoint.pending, handleFetchSinglePending)
      // these endpoints return named lists, we need to pass a `listKey` so the util can properly handle the response
      .addCase(fetchSingleProductAtEndpoint.fulfilled, (state, action) => handleFetchSingleFromListFulfilled(state, action, 'products'))
      .addCase(fetchSingleProductAtEndpoint.rejected, handleFetchSingleRejected)
      // permission protected list fetches
      .addCase(fetchProductListAtEndpoint.pending, handleFetchListPending)
      .addCase(fetchProductListAtEndpoint.fulfilled, (state, action) => handleFetchListFulfilled(state, action, 'products'))
      .addCase(fetchProductListAtEndpoint.rejected, handleFetchListRejected)


      // UPDATE
      .addCase(sendUpdateProduct.pending, handleMutationPending)
      .addCase(sendUpdateProduct.fulfilled, handleMutationFulfilled)
      .addCase(sendUpdateProduct.rejected, handleMutationRejected)
      // .addCase(sendUpdateProduct.fulfilled, (state, action) => handleMutationFulfilled(state, action, (newState, action) => {
      //   // by passing this optional callback we now have access to the new state if we want to do something else with it, this works for all reducer handlers
      // }))

      // DELETE
      .addCase(sendDeleteProduct.pending, handleDeletePending)
      .addCase(sendDeleteProduct.fulfilled, handleDeleteFulfilled)
      .addCase(sendDeleteProduct.rejected, handleDeleteRejected)
  }
});

// export the actions for the reducers defined above
export const { invalidateQuery, invalidateQueries, addProductToList, addProductsToList, removeProductsFromList } = productSlice.actions;


// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// updated to accept a listFetch function so we can use it for other list fetches
export const fetchListIfNeeded = (queryKey, listFetch = fetchProductList) => (dispatch, getState) => {
  const productStore = getState().product;
  return handleFetchListIfNeeded(dispatch, productStore, listFetch, queryKey, 'products');
};

export const fetchSingleIfNeeded = (id, singleFetch = fetchSingleProduct) => (dispatch, getState) => {
  const productStore = getState().product;
  return handleFetchSingleIfNeeded(dispatch, productStore, singleFetch, id);
}

export default productSlice.reducer;
