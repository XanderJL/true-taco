import { Box } from "@chakra-ui/core"
import customTheme from "../styles/theme"

const Container = (props) => {
  return (
    <Box maxW={customTheme.maxWidth} h="100%" m="auto" {...props}>
      {props.children}
    </Box>
  )
}

export default Container
