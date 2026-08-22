import { createRequire } from 'module';
import Subscription from '../models/subscription.model.js';
import dayjs from "dayjs";
const require = createRequire(import.meta.url);          //this allows us to use es modules 
const { serve } = require('@upstash/workflow/express');
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];                         // reminder constants for 1,2,5,7 day

export const sendReminders = serve( async(context) => {
    const { subscriptionId } = context.requestPayload;
    let subscription = await fetchSubscription(context, subscriptionId); 

    if(!subscription || subscription.status !== 'active'){
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);
    
    if(renewalDate.isBefore(dayjs())){
        return;
    }  

    for(const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        subscription = await fetchSubscription(context, subscriptionId);
        if(!subscription || subscription.status !== 'active'){
            return;
        }

        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `Reminder ${daysBefore} days before`, subscription);    
        }
    }
});

const sleepUntilReminder = async (context, label, date) => {
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {

        await sendReminderEmail({
            to: subscription.User.email,
            type: label,
            subscription,
        })
    }); 
}

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('User', 'name email').lean();
    })
}
