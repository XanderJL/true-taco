import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { PseudoBox, Text } from "@chakra-ui/core"

const NavbarItem = ({ children, href, ...props }) => {
  return (
    <Link to={href ? href : "/"}>
      <PseudoBox
        d="flex"
        alignItems="center"
        w={["100%", "max-content"]}
        h={["3.25rem", "4rem"]}
        p="0.5rem 0.75rem"
        color="white"
        _hover={{ bg: "green.400" }}
        {...props}
      >
        <Text fontSize={["lg", "xl"]}>{children}</Text>
      </PseudoBox>
    </Link>
  )
}

NavbarItem.propTypes = {
  href: PropTypes.string,
}

export default NavbarItem
