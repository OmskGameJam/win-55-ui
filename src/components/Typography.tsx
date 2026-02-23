import React from "react"
import { typographyStyles, type TypographySettings } from "../helpers/typography"

interface TypographyComponentProps {
  element?: keyof HTMLElementTagNameMap
  children?: React.ReactNode
}

export function Typography(props: TypographySettings & TypographyComponentProps) {
  const { children, ...restProps } = props
  const tag = restProps.element ?? 'span'
  const styles = typographyStyles(restProps)

  if (!restProps.element) {
    styles.display = 'contents'
  }

  return React.createElement(tag, { style: styles }, children)
}