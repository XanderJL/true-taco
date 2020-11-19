import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import BlockContent from "@sanity/block-content-to-react"
import { Box, Grid, Heading, Text, Flex, Select } from "@chakra-ui/react"
import { Container } from "../Layout"
import MenuItem from "./MenuItem"
import OrderButton from "./OrderButton"
import FrillsTop from "../../images/frills/top.svg"
import FrillsBottom from "../../images/frills/bottom.svg"

const Menu = props => {
  const data = useStaticQuery(graphql`
    {
      sanityMenu {
        isOpen
        heading
        _rawBody
      }
      # Previous query
      # allStripePrice(filter: { active: { eq: true } }) {
      #   edges {
      #     node {
      #       product {
      #         id
      #         images
      #         name
      #         type
      #         active
      #         description
      #         metadata {
      #           menu
      #           options
      #         }
      #       }
      #       unit_amount
      #       id
      #       currency
      #     }
      #   }
      # }
      allStripePrice(filter: { active: { eq: true } }) {
        group(field: product___id) {
          edges {
            node {
              product {
                id
                images
                name
                type
                active
                description
                metadata {
                  menu
                  options
                }
              }
              unit_amount
              id
              currency
            }
          }
        }
      }
    }
  `)

  const products = data.allStripePrice.group
  const { isOpen, heading, _rawBody } = data.sanityMenu

  const lunchMenu = products.filter(product =>
    product.edges.every(({ node }) => node.product.metadata.menu === "lunch")
  )

  const breakfastMenu = products.filter(product =>
    product.edges.every(
      ({ node }) => node.product.metadata.menu === "breakfast"
    )
  )

  const toGoMenu = products.filter(product =>
    product.edges.every(({ node }) => node.product.metadata.menu === "to-go")
  )

  const extrasMenu = products.filter(product =>
    product.edges.every(({ node }) => node.product.metadata.menu === "extras")
  )

  const SubMenu = menu => {
    return (
      <Grid
        mb="6rem"
        rowGap={{ base: "3rem", md: "5rem" }}
        columnGap={{ base: "3rem", md: "5rem" }}
        gridTemplateRows="auto"
        gridTemplateColumns={["minmax(0, 1fr)", "repeat(2, 1fr)"]}
      >
        {menu.data.map(({ edges }) => {
          if (edges.length > 1) {
            return edges.map(({ node }) => {
              const { name, description, images, metadata } = node.product

              return (
                <MenuItem
                  key={node.id}
                  heading={name}
                  price={node.unit_amount / 100}
                  product={{
                    name,
                    sku: node.id,
                    price: node.unit_amount,
                    image: images[0],
                    currency: node.currency,
                    description,
                  }}
                >
                  <Text maxW="75%" fontSize="lg" color="white">
                    {description}
                  </Text>
                  {metadata?.options && (
                    <Select
                      size="sm"
                      variant="filled"
                      maxW="max-content"
                      mt="1rem"
                      color="black"
                    >
                      {metadata?.options.split(", ").map((item, i) => (
                        <option key={i} value={`Option ${i}`}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  )}
                </MenuItem>
              )
            })
          }

          return edges.map(({ node }) => {
            const { name, description, images, metadata } = node.product

            return (
              <MenuItem
                key={node.id}
                heading={name}
                price={node.unit_amount / 100}
                product={{
                  name,
                  sku: node.id,
                  price: node.unit_amount,
                  image: images[0],
                  currency: node.currency,
                  description,
                }}
              >
                <Text maxW="75%" fontSize="lg" color="white">
                  {description}
                </Text>
                {metadata?.options && (
                  <Select
                    size="sm"
                    variant="filled"
                    maxW="max-content"
                    mt="1rem"
                    color="black"
                  >
                    {metadata?.options.split(", ").map((item, i) => (
                      <option key={i} value={`Option ${i}`}>
                        {item}
                      </option>
                    ))}
                  </Select>
                )}
              </MenuItem>
            )
          })
        })}
      </Grid>
    )
  }

  return (
    <Box
      position="relative"
      bg="black"
      _before={{
        overflowX: "hidden",
        position: "absolute",
        top: "-22px",
        width: "100%",
        height: "25px",
        content: `""`,
        backgroundRepeat: "repeat",
        background: `url(${FrillsTop})`,
      }}
      _after={{
        overflowX: "hidden",
        position: "absolute",
        bottom: "-22px",
        width: "100%",
        height: "22px",
        content: `""`,
        background: `url(${FrillsBottom})`,
      }}
    >
      <Container maxW="5xl" m="0 auto" {...props}>
        <Heading
          as="h1"
          size="4xl"
          mb="5rem"
          color="white"
          fontWeight="400"
          textAlign="center"
          textDecor="underline"
        >
          {heading}
        </Heading>
        {isOpen ? (
          <Box>
            <Heading
              as="h2"
              size="3xl"
              mb="3rem"
              color="white"
              fontWeight="400"
              textDecor="underline"
            >
              Breakfast
            </Heading>
            <SubMenu data={breakfastMenu} />
            <Heading
              as="h2"
              size="3xl"
              mb="3rem"
              color="white"
              fontWeight="400"
              textDecor="underline"
            >
              Lunch
            </Heading>
            <SubMenu data={lunchMenu} />
            <Heading
              as="h2"
              size="3xl"
              mb="3rem"
              color="white"
              fontWeight="400"
              textDecor="underline"
            >
              To Go
            </Heading>
            <SubMenu data={toGoMenu} />
            <Heading
              as="h2"
              size="3xl"
              mb="3rem"
              color="white"
              fontWeight="400"
              textDecor="underline"
            >
              Extras
            </Heading>
            <SubMenu data={extrasMenu} />
            <OrderButton w="6rem" h="auto" />
          </Box>
        ) : (
          <Flex
            dir="column"
            maxW="70ch"
            m="0 auto"
            align="center"
            justify="center"
            color="white"
            fontSize={["xl", "2xl"]}
          >
            <BlockContent blocks={_rawBody} />
          </Flex>
        )}
      </Container>
    </Box>
  )
}

export default Menu
