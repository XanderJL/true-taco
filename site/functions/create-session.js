const stripe = require("stripe")(process.env.GATSBY_STRIPE_API_SECRET)

exports.handler = async ({ body }) => {
  const { cart, metadata, subtotal } = JSON.parse(body)
  try {
    const line_items = []
    const raw_items = Object.values(cart)

    raw_items.map(item => {
      const {
        quantity,
        currency,
        price,
        name,
        description,
        price_data,
        image,
      } = item
      const new_item = {
        quantity,
        price_data: {
          currency,
          unit_amount_decimal: price,
          product_data: {
            name,
            description,
            metadata: price_data.metadata,
            images: [image],
          },
        },
      }
      line_items.push(new_item)
    })

    const gratuity = {
      price_data: {
        currency: "cad",
        product_data: {
          name: "Gratuity",
        },
        unit_amount_decimal: metadata.gratuity.endsWith("%")
          ? Math.ceil(subtotal * (parseInt(metadata.gratuity) * 0.01))
          : parseInt(metadata.gratuity) * 100,
      },
      quantity: 1,
    }

    const hst = {
      price_data: {
        currency: "cad",
        product_data: {
          name: "HST",
        },
        unit_amount_decimal: Math.ceil(subtotal * 0.13),
      },
      quantity: 1,
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      success_url: `${process.env.GATSBY_PRODUCTION_URL}/success`,
      cancel_url: process.env.GATSBY_PRODUCTION_URL,
      mode: "payment",
      line_items: [...line_items, gratuity, hst],
      metadata,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    }
  } catch (error) {
    console.error(error)
  }
}
