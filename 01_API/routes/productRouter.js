const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(auth, productCtrl.createProduct)

router.route('/products/search')
    .get(productCtrl.searchProduct)


router.route('/products/:id')
    .delete(auth, authAdmin, productCtrl.deleteProduct)
    .put(auth, authAdmin, productCtrl.updateProduct)
    .get(productCtrl.getDetailProduct)

router.route('/products/role/:id')
    .put(auth, authAdmin, productCtrl.updateProductRole)
 
router.route('/product')
    .get(productCtrl.getProductsByCategory)


module.exports = router