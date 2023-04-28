const express = require("express");
const route = express.Router()


const userController = require("../controllers/userController")
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddelWare');

const checkoutController = require('../controllers/checkoutControllers');

route.post("/register", userController.registerUser)
route.post("/login", userController.loginUser)
route.put("/update/:userId", userController.updateSubcription)

route.post('/subscription', subscriptionController.createSubscription);
route.get('/', authMiddleware, subscriptionController.getSubscriptions);
route.put('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);

route.post('/sessionCreate', authMiddleware, checkoutController.createCheckoutSession);
route.post('/success', checkoutController.handleCheckoutSuccess);
route.post('/cancel', checkoutController.handleCheckoutCancel);

module.exports = route