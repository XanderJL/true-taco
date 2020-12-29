const stripe = require("stripe")(process.env.GATSBY_STRIPE_API_SECRET)
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

exports.handler = async ({ body, headers }) => {
  console.log("env:::   ", process.env)
  console.log("body:::    " + body)
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (stripeEvent.type === "checkout.session.completed") {
      console.log(body)
      // 1. Take session data and plant them in email template
      // 2. Send email "chit" to jo@truetacolondon.com
      // 3. Subtract line items from inventory of products in Sanity
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.log(`Stripe webhook failed with ${error}`)

    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    }
  }
}
