const product = require('./productController')

const { requireLogin, requireAccountAccess } = require('../../global/handlers/authHandler')

module.exports = (router) => {

  router.get('/api/products/default', product.getDefault)
  router.get('/api/products/logged-in', product.getLoggedInList)
  router.get('/api/products/:id', product.getSingleById)


  router.get('/api/products', product.getListWithArgs)

  // // same but with api level restrictions
  // router.get('/api/products', 
  //   requireLogin, 
  //   requireAccountAccess, 
  //   product.getListWithArgs
  // )

  // router.post('/api/products', product.createSingle)
  router.post('/api/products', requireLogin, product.createSingle);

  router.put('/api/products/:id', product.updateSingleById);
  router.post('/api/products/special/:someSpecialParam/:id', product.testNewUpdateEndpoint);

  router.delete('/api/products/:id', requireLogin, product.deleteSingle);

}