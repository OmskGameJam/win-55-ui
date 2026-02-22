import React from "react"
import { typographyStyles, type TypographySettings } from "../helpers/typography"



interface TypographyComponentProps {
  element: keyof HTMLElementTagNameMap
}

export function Typography(props: TypographySettings & TypographyComponentProps) {

  const tag = props.element
  const styles = typographyStyles(props)

  return React.createElement(tag, {style: styles}) 
}