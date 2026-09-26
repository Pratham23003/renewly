import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js"
import { createSubscription, getSubscriptionById, editSubscriptionById, cancelSubscriptionById, getAllSubscriptions, getUpcomingRenewals, deleteSubscriptionById, createUsageCharge, getSpendAnalytics } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

subscriptionRouter.get('/:id', authorize, getSubscriptionById);

subscriptionRouter.get('/:id/spending', authorize, getSpendAnalytics);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.post('/:id/usage', authorize, createUsageCharge);

subscriptionRouter.patch('/:id/cancel', authorize, cancelSubscriptionById);

subscriptionRouter.patch('/:id', authorize, editSubscriptionById);

subscriptionRouter.delete('/:id', authorize, deleteSubscriptionById);

export default subscriptionRouter;
