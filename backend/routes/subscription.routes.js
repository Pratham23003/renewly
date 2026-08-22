import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js"
import { createSubscription, getSubscriptionById, editSubscriptionById, cancelSubscriptionById, getAllSubscriptions, getUpcomingRenewals, deleteSubscriptionById } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

subscriptionRouter.get('/:id', authorize, getSubscriptionById);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.patch('/:id/cancel', authorize, cancelSubscriptionById);

subscriptionRouter.patch('/:id', authorize, editSubscriptionById);

subscriptionRouter.delete('/:id', authorize, deleteSubscriptionById);

export default subscriptionRouter;
