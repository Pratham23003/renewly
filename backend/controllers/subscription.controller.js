import Subscription from "../models/subscription.model.js"
import { workflowClient } from "../config/upstash.js"
import { SERVER_URL } from "../config/env.js"

export const getAllSubscriptions = async (req, res, next) => {
    try{
        const subscriptions = await Subscription.find({ User: req.user._id }).sort({ createdAt: -1 });

        if(subscriptions.length < 1){
            return res.status(200).json({ success: true, message: "No subscriptions found", data: [] });
        }
        
        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    }
    catch (err){
        next (err);
    }
}

export const createSubscription = async (req, res, next) => {
    try{
        //check if it already exists
        //a subscription 'll be counted as a existing subscription if following fields already exist in the DB by the same user.
        const existingSubscription = await Subscription.findOne({
            User: req.user._id,
            name: req.body.name,
            plan: req.body.plan,
            price: req.body.price,
            currency: req.body.currency,
            frequency: req.body.frequency,
            category: req.body.category,
            paymentMethod: req.body.paymentMethod,
            startDate: req.body.startDate,
        });

        if(existingSubscription){
            const error = new Error("Subscription already exists");
            error.statusCode = 409;
            throw error;
        }
        const {
            name,
            plan,
            price,
            currency,
            frequency,
            category,
            paymentMethod,
            startDate,
        } = req.body;

        const subscription = await Subscription.create({
            name,
            plan,
            price,
            currency,
            frequency,
            category,
            paymentMethod,
            startDate,
            User: req.user._id,
        }) 

        let workflowRunId = null;
        try {
            const result = await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription._id.toString()
                }
            });
            workflowRunId = result.workflowRunId;
        } catch (workflowErr) {
            console.warn("Workflow queue warning:", workflowErr instanceof Error ? workflowErr.message : workflowErr);
        }

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    }
    catch (err){
        next(err);
    }
}


export const getSubscriptionById = async (req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error('Subscription Not Found');
            error.statusCode = 404;
            throw error;
        }

        if(subscription.User.toString() !== req.user._id.toString()){
            const error = new Error('You are not authorized to view this subscription');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription});
    }
    catch(err){
        next(err);
    }
}

export const editSubscriptionById = async (req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);
        
        //if subscription not found -> throw error!!!
        if(!subscription){
            const error = new Error('Subscription Not Found');
            error.statusCode = 404;
            throw error;
        }
        
        //verify ownership
        if(subscription.User.toString() !== req.user._id.toString()){
            const error = new Error('You are not authorized to edit this subscription');
            error.statusCode = 403;
            throw error;
        }

        const allowedEditFields = ['name', 'plan', 'price', 'currency', 'frequency', 'category', 'paymentMethod', 'status', 'startDate'];
        const isEditAllowed = Object.keys(req.body).every((key) => allowedEditFields.includes(key));

        if(!isEditAllowed){
            const error = new Error(`Not allowed to edit subscription`);
            error.statusCode = 403;
            throw error;
        }
        else{
            Object.keys(req.body).forEach((key) => subscription[key] = req.body[key]);
            await subscription.save();                                                                       
            res.status(200).json({ status: "success", message: "Subscription Edited", data: subscription });
        }
    }
    catch (err){
        next(err);
    }
}

export const cancelSubscriptionById = async (req, res, next) => {
    try{
        //find subscription
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error(`Subscription Not Found`);
            error.statusCode = 404;
            throw error;
        }

        if(subscription.User.toString() !== req.user._id.toString()){
            const error = new Error("You are not authorized to cancel this subscription");
            error.statusCode = 403;
            throw error;
        }

        //check whether subscription is already cancelled
        if(subscription.status == "cancelled"){
            return res.status(400).json( { success: false, message: "Subscription has already been Cancelled" } );
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription
        });
    }
    catch (err){
        next(err);
    }
}

export const getUpcomingRenewals = async(req, res, next) => {
    try{
        const currentDate = new Date();
        
        //find all the subscriptions associated with the same user id whose status is active and renewal date is > currentDate
        const subscriptions = await Subscription.find({
            User: req.user._id,
            status: "active",
            renewalDate: { $gte: currentDate }
        }).sort({ renewalDate: 1 });

        if(subscriptions.length < 1){
            return res.status(200).json({ success: true, message: "No upcoming renewals found", data: [] });
        }

        res.status(200).json( {success: true, data: subscriptions} );
    }   
    catch (err){
        next(err);
    }
}

export const deleteSubscriptionById = async(req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);
        
        if(!subscription){
            const error = new Error(`Subscription Not Found`);
            error.statusCode = 404;
            throw error;
        }

        if(subscription.User.toString() !== req.user._id.toString()){
            const error = new Error("You are not authorized to delete this subscription");
            error.statusCode = 403;
            throw error;
        }

        await Subscription.deleteOne({ _id: req.params.id });
        
        res.status(200).json({ success: true, message: "Subscription deleted successfully"});

    }
    catch (err){
        next(err);
    }
}
