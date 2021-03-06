/** @jsx jsx */
import React from "react"
import PropTypes from "prop-types"
import {
  theme,
  Box,
  Grid,
  Input,
  Text,
  Textarea,
  Button,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react"
import { css, jsx } from "@emotion/core"
import { useForm } from "react-hook-form"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const ContactForm = ({ color, inputColor, buttonColor }) => {
  const { register, handleSubmit, errors, reset } = useForm()
  const toast = useToast()

  const onSubmit = data => {
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encode({ "form-name": "contact", ...data }),
    })
      .then(() => {
        toast({
          title: "Your message has been sent.",
          description: "We'll get back to you as soon as we can.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        reset()
      })
      .catch(err =>
        toast({
          title: "Uh oh.",
          description: `Something went wrong. ${err}`,
          duration: 9000,
          isClosable: true,
        })
      )
  }

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const inputStyles = css`
    &::placeholder {
      color: ${theme.colors.orange[600]};
    }
  `

  const CustomError = ({ children }) => <CustomError>{children}</CustomError>

  return (
    <form name="contact" data-netlify="true" onSubmit={handleSubmit(onSubmit)}>
      <Grid
        gridTemplateColumns={["minmax(0, 1fr)", "repeat(2, 1fr)"]}
        gap="16px"
      >
        <FormControl isRequired>
          <FormLabel color={color} htmlFor="firstName">
            First Name
          </FormLabel>
          <Input
            css={inputStyles}
            name="firstName"
            type="text"
            ref={register({ required: true })}
            bg="white"
            borderColor={inputColor}
            placeholder="Jane"
          />
          {errors.firstName && (
            <Text color="red.400">
              You must enter your first name in this field.
            </Text>
          )}
        </FormControl>
        <FormControl>
          <FormLabel color={color}>Last Name</FormLabel>
          <Input
            css={inputStyles}
            name="lastName"
            type="text"
            ref={register}
            bg="white"
            borderColor={inputColor}
            placeholder="Doe"
          />
        </FormControl>
      </Grid>
      <FormControl isRequired>
        <FormLabel color={color}>Email</FormLabel>
        <Input
          css={inputStyles}
          name="email"
          type="text"
          ref={register({ required: true, pattern: re })}
          bg="white"
          borderColor={inputColor}
          placeholder="j.doe@gmail.com"
        />
        {errors.email && errors.email.type === "required" && (
          <Text color="red.400">The email field is required.</Text>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <Text color="red.400">Please submit a valid email address.</Text>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel color={color}>Message</FormLabel>
        <Textarea
          css={inputStyles}
          name="message"
          ref={register({
            required: true,
            minLength: 2,
          })}
          bg="white"
          h="auto"
          rows={8}
          borderColor={inputColor}
          placeholder="Hello"
        />
        {errors.message && errors.message.type === "required" && (
          <Text color="red.400">Your message cannot be left blank.</Text>
        )}
        {errors.message && errors.message.type === "minLength" && (
          <Text color="red.400">
            Your message must be longer than two characters.
          </Text>
        )}
      </FormControl>
      <Box pt="12px">
        <Button colorScheme={buttonColor} type="submit" borderRadius="2px">
          Submit
        </Button>
      </Box>
    </form>
  )
}

ContactForm.propTypes = {
  color: PropTypes.string,
  inputColor: PropTypes.string,
  buttonColor: PropTypes.string,
}

export default ContactForm
