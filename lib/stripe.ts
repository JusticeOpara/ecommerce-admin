import Stripe from "stripe"

// if(process.env.STRIPE_API_KEY == undefined){
// throw Error("STRIPE_API_KEY  is not defined")
// }
export const stripe = new Stripe(process.env.STRIPE_API_KEY!,{
    apiVersion: '2024-09-30.acacia',
    typescript: true
})