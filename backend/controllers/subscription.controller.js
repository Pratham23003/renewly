import Subscription from "../models/subscription.model.js"
import { workflowClient } from "../config/upstash.js"
import { SERVER_URL } from "../config/env.js"
import UsageCharge from "../models/usageCharge.model.js"

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

export const createUsageCharge = async(req, res, next) => {
    try{
        const { amount, date } = req.body;
        const user = req.user._id;
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error("Subscription doesn't exist");
            error.statusCode = 404;
            throw error;
        }

        if(amount === undefined || amount === null || !date){
            const error = new Error("Invalid Inputs.");
            error.statusCode = 400;
            throw error;
        }

        if(amount <= 0 || typeof amount !== "number"){
            const error = new Error("Invalid Amount.");
            error.statusCode = 400;
            throw error;
        }

        if(subscription.User.toString() !== user.toString()){
            const error = new Error("You are not authorized to create this usage charge");
            error.statusCode = 403;
            throw error;
        }

        if(subscription.billingType !== "payg"){
            const error = new Error("Billing type is not pay as you go");
            error.statusCode = 400;
            throw error;
        }
        
        const chargeDate = new Date(date);
        const currentDate = new Date();

        if(chargeDate > currentDate){
            const error = new Error("Date cannot be in future");
            error.statusCode = 400;
            throw error;
        }

        const usageCharge = await UsageCharge.create({
            user: user,
            subscription: subscription._id,
            amount: amount,
            date: chargeDate,
        })

        res.status(201).json({ success: true, data: usageCharge });

    }
    catch(err){
        next(err);
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
            billingType,
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
            billingType,
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

export const getSpendAnalytics = async (req, res, next) => {
    try{
       const user = req.user._id;
       const subscription = await Subscription.findById(req.params.id);

       if(!subscription){
        const error = new Error("Subscription doesn't exist");
        error.statusCode = 404;
        throw error;
       }

       if(subscription.User.toString() !== user.toString()){
        const error = new Error("You are not authorized to view this subscription");
        error.statusCode = 403;
        throw error;
       }

       const { cycle } = req.query;
    
       const getPeriodDates = (cycle) => {
        const now = new Date(); // 24SEP26 13:14 IST

        const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // 24SEP26 00:00 IST
        const currentEnd = new Date(currentStart);      // 24SEP26 00:00 IST
        const previousStart = new Date(currentStart);   // 24SEP26 00:00 IST
        const previousEnd = new Date(currentStart);     // 24SEP26 00:00 IST
        
        switch(cycle){
            case "day":
                currentEnd.setUTCDate(currentEnd.getUTCDate() + 1);         // 25SEP26 00:00 IST
                previousStart.setUTCDate(previousStart.getUTCDate() - 1);   // 23SEP26 00:00 IST
                break;
            
            case "week":
                const currentDayOfWeek = currentStart.getUTCDay(); // 4
                const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 3
                
                currentStart.setUTCDate(currentStart.getUTCDate() - daysToSubtract);      //monday (21 sept)
                currentEnd.setUTCDate(currentStart.getUTCDate() + 7);                     //monday (28 sept)
                previousStart.setUTCDate(currentStart.getUTCDate() - 7);                    //monday (14 sept)
                previousEnd.setUTCDate(currentStart.getUTCDate());                          //monday (21 sept)
                break;

            case "month":
                currentStart.setUTCDate(1);                                             //1st day of the month
                currentEnd.setUTCMonth(currentStart.getUTCMonth() + 1, 1);               //1st day of the next month  
                previousStart.setUTCMonth(currentStart.getUTCMonth() - 1, 1);           //1st day of the previous month
                previousEnd.setTime(currentStart.getTime());
                break;

            default:
                const error = new Error("Invalid cycle");
                error.statusCode = 400;
                throw error;
        }

        return { currentStart, currentEnd, previousStart, previousEnd };
       }

       const { currentStart, currentEnd, previousStart, previousEnd } = getPeriodDates(cycle || "day");

       const currentPeriodAnalytics = await UsageCharge.aggregate([
            { $match: {
                subscription: subscription._id,
                user: user,
                date: {
                    $gte: currentStart,
                    $lt: currentEnd,
                }
            }},
            { $group: {
                _id: null,
                totalSpent: { $sum: "$amount" }
            }}
       ])
       
       const previousPeriodAnayltics = await UsageCharge.aggregate([
           { $match : {
               subscription: subscription._id,
               user: user,
               date: {
                   $gte: previousStart,
                   $lt: previousEnd,
                }
            }},
            { $group: {
                _id: null,
                totalSpent: { $sum: "$amount" }
            }}
        ])
        
        const currentSpend = currentPeriodAnalytics.length > 0 ? currentPeriodAnalytics[0].totalSpent : 0;
        const previousSpend = previousPeriodAnayltics.length > 0 ? previousPeriodAnayltics[0].totalSpent : 0;

        let percentChange = 0;
        if(previousSpend !== 0){
            percentChange = ((currentSpend - previousSpend) / previousSpend) * 100;
        }
        
        const isAnomaly = percentChange > 50;
        
        res.status(200).json({
            success: true,
            data: {
                currentSpend,
                previousSpend,
                percentChange,
                anomalyDetected: isAnomaly,
                cycle: cycle || "day",
                dateRanges: {
                    currentStart,
                    currentEnd,
                    previousStart,
                    previousEnd
                }
            }
        })

    }
    catch(err){
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
