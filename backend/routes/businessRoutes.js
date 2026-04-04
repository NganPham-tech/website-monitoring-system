const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Group APIs liên quan đến User Business (Search, Manage status, Impersonate)
router.get('/users', businessController.getUsers);
router.post('/users/:id/status', businessController.toggleUserStatus);
router.post('/users/:id/impersonate', businessController.impersonateUser);

// Group APIs liên quan đến Transactions (Stripe, Invoice)
router.get('/transactions', businessController.getTransactions);
router.post('/transactions/:id/refund', businessController.refundTransaction);
router.get('/transactions/:id/invoice', businessController.downloadInvoice);

// Group APIs liên quan đến Plans (SaaS limits, pricing)
router.get('/plans', businessController.getPlans);
router.put('/plans/:id', businessController.updatePlan);

module.exports = router;
