const stripe = require("stripe")(process.env.GATSBY_STRIPE_API_SECRET)
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  url: process.env.MAILGUN_URL,
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
      const session = await stripe.checkout.sessions.retrieve(
        JSON.parse(body).data.object.id,
        { expand: ["line_items.data.price.product"] }
      )
      const productName = async product => {}
      console.log(JSON.parse(body, null, 2))

      // 2. Send email "chit" to jo@truetacolondon.com
      const data = {
        from:
          "Chit Bot <postmaster@sandbox7f002a272f1e4364ad016df5c6b3e403.mailgun.org>",
        to: "alexanderjameslow@gmail.com",
        subject: `Chit for ${
          session?.shipping?.name || "dumdum who didn't supply an email >:("
        }`,
        html: `
          <html>
            <body>
              <h1>Customer: ${session?.shipping?.name}</h1>
              <ul>
                <li>City: ${session?.shipping?.address?.city}</li>
                <li>Country: ${session?.shipping?.address?.country}</li>
                <li>Line 1: ${session?.shipping?.address?.line1}</li>
                <li>Line 2: ${session?.shipping?.address?.line2}</li>
                <li>Postal Code: ${session?.shipping?.address?.postal_code}</li>
                <li>Province: ${session?.shipping?.address?.state}</li>
              </ul>
              <p>Notes: ${session?.metadata?.notes}</p>
              <table>
              <tr>
                <th>Item</th>
                <th>Variant</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Amount</th>
                <th>Amount Total</th>
              </tr>
                ${session.line_items.data.map(
                  item => `<tr>
                    <td>${item.price.product.name}<td>
                    <td>${
                      item.price.metadata.variant && item.price.metadata.variant
                    }<td>
                    <td>${item.description}<td>
                    <td>${item.quantity}<td>
                    <td>${item.price.unit_amount / 100}<td>
                    <td>${item.amount_total / 100}<td>
                  </tr>`
                )}
              </table>
              <pre>${JSON.stringify(session, null, 2)}</pre>
            </body>
          </html>
        `,
      }

      mailgun.messages().send(data, (err, body) => {
        console.log(body)
      })
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
