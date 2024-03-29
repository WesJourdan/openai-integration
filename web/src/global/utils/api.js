/**
 * This is a utility to handle default API requests with the Yote server
 */

import _ from 'lodash'
// TODO: break this into separate exports so we aren't forced to import the entire set to use one method.

const apiUtils = {
  async callAPI(route, method = 'GET', body, headers = {
    'Accept': 'application/json', 'Content-Type': 'application/json',
  }) {
    const response = await fetch(route, {
      headers,
      method,
      credentials: 'same-origin',
      body: JSON.stringify(body)
    });
    // response.ok info: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    if(response.ok) {
      return response.json();
    } else {
      const error = await response.json().catch(unhandledError => {
        // catch unhandled server errors
        console.error('Unhandled Error Thrown by Server. Not cool.', unhandledError)
        throw 'Something went wrong';
      });
      throw error;
    }
  }

  // DEPRECATED: As of v3.0 this is no longer supported by our api. Remove before release.
  // ported from yote actions. Used in productService to build endpoints for different types of list fetches.
  // , buildEndpointFromListArgs(baseUrl, listArgs = ['all']) {
  //   let endpoint = baseUrl;
  //   if(listArgs.length === 1 && listArgs[0] !== "all") {
  //     endpoint += `by-${listArgs[0]}`;
  //   } else if(listArgs.length === 2 && Array.isArray(listArgs[1])) {
  //     // length == 2 has it's own check, specifically if the second param is an array
  //     // if so, then we need to call the "listByValues" api method instead of the regular "listByRef" call
  //     // this can be used for querying for a list of products given an array of product id's, among other things
  //     endpoint += `by-${listArgs[0]}-list?`;
  //     // build query string
  //     for(let i = 0; i < listArgs[1].length; i++) {
  //       endpoint += `${listArgs[0]}=${listArgs[1][i]}&`
  //     }
  //   } else if(listArgs.length === 2) {
  //     // ex: ("author","12345")
  //     endpoint += `by-${listArgs[0]}/${listArgs[1]}`;
  //   } else if(listArgs.length > 2) {
  //     endpoint += `by-${listArgs[0]}/${listArgs[1]}`;
  //     for(let i = 2; i < listArgs.length; i++) {
  //       endpoint += `${listArgs[i]}`;
  //     }
  //   }
  //   return endpoint
  // }

  , queryStringFromObject(queryObject) {
    // console.log("QUERY STRING FROM OBJECT")
    // ex: { page: '1', per: '20' } to ?page=1&per=20
    return Object.entries(queryObject)
      // remove empties
      .filter(entry => entry[1] && entry[1].toString().length > 0)
      // .filter(entry => entry[1] && entry[1].toString().length > 0)
      .map(item => {
        // debugging
        // console.log(item);
        return item;
      })
      // if value is array, convert to string, otherwise just add the string
      .map(entry => Array.isArray(entry[1]) ? [entry[0], entry[1].join(",")] : entry)
      // map to string
      .map(entry => entry.join("="))
      .join("&")
  }
  , objectFromQueryString(queryString) {
    // convert search string into object notation
    // ex: ?page=1&per=20 to { page: '1', per: '20' }
    // first grab just the query string meaning everything after the "?"
    queryString = queryString?.split("?")[1];
    if(!queryString) return {};
    return queryString.replace("?", "").split("&")
      .map(item => item.split("="))
      .map(item => [_.camelCase(item[0]), item[1]]) // convert kebab case to camel case, ie. "end-date" => "endDate"
      // .map(item => {
      //   // debugging
      //   console.log(item);
      //   return item;
      // })
      // if "" dont add it, otherwise add key:value to return object
      .reduce((returnObj, item) => { return item[0].length > 0 ? { ...returnObj, [item[0]]: item[1] } : returnObj }, {})
  }
  /**
   * Checks if listArgs are ready to be fetched
   * returns false if 1. listArgs is falsy, or 2. listArgs is an object with any undefined or empty array values
   * returns true if listArgs is an object with no undefined or empty array values (this includes an empty object which is valid listArgs)
   * @param {object} listArgs - an object containing the listArgs to be checked
   */
  , checkListArgsReady(listArgs) {
    // can't fetch if no list args are provided
    if(!listArgs) return false;
    if(typeof listArgs !== "object") return false; 
    let listArgsReady = true;
    // if ANY list args are undefined or an array with 0 length, flip the boolean false
    Object.keys(listArgs).forEach(key => {
      if((listArgs[key] === undefined) || (Array.isArray(listArgs[key]) && listArgs[key].length === 0)) {
        listArgsReady = false;
      }
    });
    return listArgsReady;
  }
}

export default apiUtils;


