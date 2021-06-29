// import primary libraries
import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

// import the hooks generated by RTK query
import { useSingleProduct, useUpdateProduct } from '../productService';

import AsyncWrapper from '../../../global/components/helpers/AsyncWrapper';


// import resource components
import ProductLayout from '../components/ProductLayout.js.jsx'
import ProductForm from '../components/ProductForm.js.jsx';

const UpdateProduct = () => {

  const history = useHistory(); // get history object
  const { productId } = useParams(); // replaces match.params.productId

  // use the hook to fetch the single product
  const { data: product, ...productFetch } = useSingleProduct(productId);

  // access the update action by running the mutation hook created in productService
  // It returns an array where the first item is the update action and the second is an object with information about the result of the update action
  const [
    sendUpdateProduct, // this is the function that fires the POST call to api/products/:productId. Think of it as importing productActions.sendUpdateProduct
    { isLoading: isUpdating }, // This is the destructured update result. Rename isLoading to isUpdating for clarity.
  ] = useUpdateProduct();

  const handleFormSubmit = async (updatedProduct) => {
    // send the updatedProduct to the server
    const { data: product } = await sendUpdateProduct(updatedProduct); // replaces dispatch(productActions.sendUpdateProduct(updatedProduct)).then(productRes => {...})
    // back to single product view
    history.push(`/products/${product._id}`)
  }
  
  return (
    <ProductLayout title={'Update Product'}>
      <AsyncWrapper {...productFetch}>
        { !product ? <div>No product found</div>
          : // we have the product, render the form
          <ProductForm
            product={product}
            cancelLink="/products"
            disabled={productFetch.isFetching || isUpdating}
            formTitle="Update Product"
            formType="update"
            handleFormSubmit={handleFormSubmit}
          />
        }
      </AsyncWrapper>
    </ProductLayout>
  )
}

export default UpdateProduct;


