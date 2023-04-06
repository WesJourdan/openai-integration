/**
 * This global set of hooks contains most of the logic that is shared across each resource service.
 * It's designed to be called by each separate resource service with args specific to that resource.
 */


import { useEffect, useState } from 'react';
import { useIsFocused } from '../../global/utils/customHooks';
import _ from 'lodash';

import apiUtils from '../../global/utils/api';

import {
  selectListItems
  , selectSingleById
  , selectSingleByQueryKey
  , selectQuery
} from '../../global/utils/storeUtils';

/**
 * This hook will perform the provided fetch action and return the fetch status and resource from the store.
 * 
 * @param {string} id - the id of the resource to be fetched
 * @param {object} fromStore - the resource specific store that we're getting the resource from (e.g. store.products, store.users, etc)
 * @param {function} sendFetchById - the dispatched action to fetch the resource (e.g. (id) => dispatch(fetchProductById(id)))
 * @param {function} sendInvalidateSingle - the dispatched action to invalidate the resource (e.g. (id) => dispatch(invalidateQuery(id)))
 * @returns an object containing fetch info and eventually the resource as `data` (see ServiceHookResponse)
 * @returns an invalidate and refetch function for convenience
 */
export const useGetResourceById = ({
  id
  , fromStore
  , sendFetchById
  , sendInvalidateSingle
}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if(id && isFocused) sendFetchById(id);
    // this is the dependency array. useEffect will run anytime one of these changes
  }, [id, sendFetchById, isFocused]);

  const invalidate = () => {
    sendInvalidateSingle(id);
  }

  const refetch = () => {
    sendInvalidateSingle(id);
    sendFetchById(id);
  }

  // get the query status from the store
  const { status, error } = selectQuery(fromStore, id);
  // get current resource from the store (if it exists)
  const resource = selectSingleById(fromStore, id);

  const isFetching = status === 'pending' || status === undefined;
  const isLoading = isFetching && !resource;
  const isError = status === 'rejected';
  const isSuccess = status === 'fulfilled';
  const isEmpty = isSuccess && !resource;

  // return the info for the caller of the hook to use
  return {
    data: resource
    , error
    , isFetching
    , isLoading
    , isError
    , isSuccess
    , isEmpty
    , invalidate
    , refetch
  }
}
/**
 * This hook will perform the provided fetch action and return the fetch status and resource from the store.
 * It's designed to return a single resource from the list endpoints using a query.
 * 
 * @param {object} listArgs - an object containing the query args to be used for the fetch (e.g. { _user: userId, featured: true })
 * @param {object} fromStore - the resource specific store that we're getting the resource from (e.g. store.products, store.users, etc)
 * @param {function} sendFetchBySingle - the dispatched action to fetch the resource (e.g. (id) => dispatch(fetchSingleWithPermission(queryString)))
 * @param {function} sendInvalidateSingle - the dispatched action to invalidate the resource (e.g. (id) => dispatch(invalidateQuery(queryString)))
 * @param {string?} endpoint - the endpoint to be used for the query (e.g. `logged-in`)
 * @returns an object containing fetch info and eventually the resource as `data` (see ServiceHookResponse)
 * @returns an invalidate and refetch function for convenience
 */
export const useGetResource = ({
  listArgs
  , fromStore
  , sendFetchSingle
  , sendInvalidateSingle
  , endpoint
}) => {
  if(!listArgs) throw new Error('useGetResource requires listArgs');
  const readyToFetch = apiUtils.checkListArgsReady(listArgs);
  const isFocused = useIsFocused();

  // convert the query object to a query string for the new server api
  // also makes it easy to track the lists in the reducer by query string
  let queryString = apiUtils.queryStringFromObject(listArgs);

  // add the endpoint to the front of the query string if it exists ex: `logged-in?isActive=true`, otherwise just `?isActive=true`
  queryString = endpoint ? `/${endpoint}?${queryString || ''}` : `?${queryString || ''}`;

  useEffect(() => {
    if(readyToFetch && isFocused) {
      sendFetchSingle(queryString);
    } else {
      // listArgs aren't ready yet, don't attempt fetch
      // console.log("still waiting for listArgs");
    }
  }, [readyToFetch, sendFetchSingle, queryString, isFocused]);

  // get the query info from the store
  const { status, error, otherData } = selectQuery(fromStore, queryString);

  // get current resource from the store (if it exists)
  const resource = selectSingleByQueryKey(fromStore, queryString);

  const isFetching = status === 'pending' || status === undefined;
  const isLoading = isFetching && !resource;
  const isError = status === 'rejected';
  const isSuccess = status === 'fulfilled';
  const isEmpty = isSuccess && !resource;

  const invalidate = () => {
    sendInvalidateSingle(queryString);
  }

  const refetch = () => {
    sendInvalidateSingle(queryString);
    sendFetchSingle(queryString);
  }

  // return the info for the caller of the hook to use
  return {
    data: resource
    , otherData
    , error
    , isFetching
    , isLoading
    , isError
    , isSuccess
    , isEmpty
    , invalidate
    , refetch
  }
}

/**
 * This hook will perform the provided fetch action and return the fetch status and resource list from the store.
 * 
 * @param {object} listArgs - an object containing the query args to be used for the fetch (e.g. { _user: userId, featured: true })
 * @param {object} fromStore - the resource specific store that we're getting the list from (e.g. store.products, store.users, etc)
 * @param {function} sendFetchList - the dispatched action to fetch the list (e.g. (queryString) => dispatch(fetchProductList(queryString)))
 * @param {function} sendInvalidateSingle - the dispatched action to invalidate the list (e.g. (queryString) => dispatch(invalidateQuery(queryString)))
 * @returns an object containing fetch info and eventually the resource list as `data` (see ServiceHookResponse)
 * @returns an invalidate and refetch function for convenience
 */
export const useGetResourceList = ({
  listArgs
  , fromStore
  , sendFetchList
  , sendInvalidateList
  , endpoint
}) => {
  // isFocused is used to make sure we rerender when this screen comes into focus. This way invalidated lists will be refetched without having to interact with the page.
  const isFocused = useIsFocused();
  /**
  * NOTE: tracking lists using the query string is easy because the `listArgs` passed into
  * dispatch(fetchResourceList(listArgs)) are accessed in the store by using action.meta.arg.
  * We could try setting the queryKey to something different (or nesting it) but we'd need to figure
  * out how to access that info in the store. Maybe by passing it along as a named object like:
  * 
  * dispatch(fetchResourceList({queryString: listArgs, queryKey: someParsedVersionOfListArgs}))
  * 
  */

  // first make sure all list args are present. If any are undefined we will wait to fetch.
  const readyToFetch = apiUtils.checkListArgsReady(listArgs);

  // handle pagination right here as part of the fetch so we don't have to call usePagination every time from each component
  // this also allows us to pre-fetch the next page(s)
  const { page, per } = listArgs;

  const pagination = {};
  if(page && per) {
    pagination.page = page;
    pagination.per = per;
  }

  // convert the query object to a query string for the new server api
  // also makes it easy to track the lists in the reducer by query string
  let queryString = apiUtils.queryStringFromObject(listArgs);

  // add the endpoint to the front of the query string if it exists ex: `logged-in?isActive=true`
  queryString = endpoint ? `/${endpoint}?${queryString || ''}` : `?${queryString || ''}`;

  useEffect(() => {
    if(readyToFetch && isFocused) {
      sendFetchList(queryString);
    } else {
      // listArgs aren't ready yet, don't attempt fetch
      // console.log("still waiting for listArgs");
    }
  }, [readyToFetch, sendFetchList, queryString, isFocused]);

  // get the query info from the store
  const { status, error, totalPages, totalCount, ids, otherData } = selectQuery(fromStore, queryString);

  // get current list items (if they exist)
  const resources = selectListItems(fromStore, queryString);

  const isFetching = status === 'pending' || status === undefined;
  const isLoading = isFetching && !resources;
  const isError = status === 'rejected';
  const isSuccess = status === 'fulfilled';
  const isEmpty = isSuccess && !resources.length;

  // add totalPages from the query to the pagination object
  pagination.totalPages = totalPages || 0;
  pagination.totalCount = totalCount || 0;

  // PREFETCH
  // if we are using pagination we can fetch the next page(s) now
  let nextQueryString = readyToFetch && pagination.page && pagination.page < totalPages ? apiUtils.queryStringFromObject({ ...listArgs, page: Number(pagination.page) + 1, per: pagination.per }) : null;
  // add the endpoint to the front of the query string if it exists ex: `logged-in?isActive=true`
  nextQueryString = endpoint ? `/${endpoint}?${nextQueryString || ''}` : nextQueryString ? `?${nextQueryString || ''}` : null;

  useEffect(() => {
    if(nextQueryString) {
      // fetch the next page now
      sendFetchList(nextQueryString);
    }
  }, [nextQueryString, sendFetchList]);

  // END PREFETCH

  const invalidate = () => sendInvalidateList(queryString);

  const refetch = () => {
    sendInvalidateList(queryString);
    sendFetchList(queryString);
  }

  // return the info for the caller of the hook to use
  return {
    ids
    , data: resources
    , otherData: otherData || {}
    , error
    , isFetching
    , isLoading
    , isError
    , isSuccess
    , isEmpty
    , invalidate
    , pagination
    , refetch
  }
}

/**
 * Use this hook to handle the creation or update of a resource.
 * 
 * @param {{
 *  resourceQuery: ServiceHookResponse 
 * , sendMutation: function
 * , initialState?: object | undefined
 * , onResponse?: function | undefined
 * }} props - an object containing the following properties:
 * @param props.resourceQuery - the object returned from the resource query hook (e.g. resourceQuery = useGetProductById(productId)) see ServiceHookResponse
 * @param  props.sendMutation - the dispatched action to send the mutation to the server (e.g. (updatedProduct) => dispatch(sendUpdateProduct(updatedProduct)))
 * @param props.initialState - the initial state we want to apply to the resource returned from the resourceQuery
 * @param  props.onResponse - a callback function that accepts the mutated resource or error
 * @returns an object containing the resource as `data` (see ServiceHookResponse) and form handlers
 */
export const useMutateResource = ({
  resourceQuery
  , sendMutation
  , initialState = {} // optional initial state that will override the data returned from the resourceQuery
  , onResponse = () => { }
}) => {
  // STATE
  // set up a state variable to hold the resource, start with what was passed in as initialState (or an empty object)
  const [newResource, setFormState] = useState(initialState);
  // set up a state variable to hold the isWaiting flag
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    // once we have the fetched resource, set it to state
    // make sure we only do this if necessary to avoid an infinite loop
    if(resourceQuery.data && !_.isEqual({ ...resourceQuery.data, ...newResource, ...initialState }, newResource)) {
      // override the resource object with anything that was passed in as initialState
      setFormState(currentState => {
        return { ...resourceQuery.data, ...currentState, ...initialState }
      });
    }
  }, [resourceQuery.data, initialState])

  // FORM HANDLERS
  // setFormState will replace the entire resource object with the new resource object
  // set up a handleChange method to update nested state while preserving existing state(standard reducer pattern)
  const handleChange = e => {
    const { name, value } = e.target;
    // use a recursive function to set arbitrarily nested values of any depth (eg. name="key" or name="resource.key" or name="resource.nestedObject.key" etc...)
    setFormState(currentState => {
      return utilSetNestedValue(currentState, name, value);
    })
  }

  const handleSubmit = e => {
    // prevent the default form submit event if present
    e?.preventDefault && e.preventDefault();
    // set isWaiting true so the component knows we're waiting on a response
    setIsWaiting(true)
    // dispatch the create/update action
    sendMutation(newResource).then(response => {
      // set isWaiting false so the component knows we're done waiting on a response
      setIsWaiting(false)
      if(response.error) {
        // reset the form state to the original resource
        resetFormState();
        console.error("An error occured while attempting mutation: ", response.error);
      } else {
        // set the returned resource to state so any changes are reflected in the form without a refresh
        setFormState(response.payload);
      }
      // send the response to the callback function
      onResponse(response.payload, response.error?.message);
    })
  }

  // used to reset the form to the initial state
  const resetFormState = () => {
    setFormState({ ...resourceQuery.data, ...initialState });
  }

  // let the component know if there are pending changes that need to be saved/cancelled
  const isChanged = Boolean(newResource && resourceQuery.data && !_.isEqual(newResource, resourceQuery.data));

  // return everything the component needs to create/update the resource
  return {
    ...resourceQuery
    , data: newResource
    , handleChange
    , handleSubmit
    , setFormState // only used if we want to handle this in a component, will usually use handleChange
    , resetFormState // only used if we want to reset the form to the original state
    , isChanged: isChanged
    // override isFetching if we're waiting for the mutated resource to get returned from the server (for ui purposes)
    , isFetching: isWaiting || resourceQuery.isFetching
  }
}

// UTILS
// used to set arbitrarily nested values in an object, works for any depth
const utilSetNestedValue = (obj, path, value) => {
  // split the path at the first dot so parent is the first part and child is the rest
  const [parent, ...child] = path.split('.');
  if(child?.length > 0) {
    // rejoin the child parts with a dot so we can recursively call utilSetNestedValue
    const childString = child.join('.');
    // recursively call utilSetNestedValue until we get to the last child
    return {
      ...obj
      , [parent]: utilSetNestedValue(obj[parent], childString, value)
    }
  }
  // if there is no child, we're at the last level, so just set the value
  return {
    ...obj
    , [parent]: value
  }
}


 // TYPES - allows jsdoc comments to give us better intellisense
/**
 * the basic object returned from a standard service hook (e.g. StandardHookResponse = useGetProductById(productId))
 * @typedef {object} ServiceHookResponse
 * @property {object} data - the data returned from the store (an object for single fetches, an array of objects for list fetches)
 * @property {array?} ids - an array of the fetched resource ids from the `data` object (list fetches only)
 * @property {string?} error - the error message returned from the store
 * @property {boolean} isFetching - whether the service is fetching
 * @property {boolean} isError - whether the fetch returned an error
 * @property {boolean} isEmpty - whether the fetch returned no data
 * @property {boolean} isLoading - whether the fetch is loading (fetching with no current data)
 * @property {boolean} isSuccess - whether the fetch has returned successfully
 * @property {function} invalidate - a function to invalidate the resource in the store so it will refetch the next time it's accessed
 * @property {function} refetch - a function to refetch the resource from the server immediately
 * 
 */