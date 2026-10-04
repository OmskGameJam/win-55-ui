import type { InjectionKey } from 'vue'

export interface DropdownNode {
  containsTarget: (node: Node) => boolean
}

export interface DropdownContextApi {
  registerChild: (child: DropdownNode) => () => void
  /** Closes the previously claimed sibling submenu; returns a release function. */
  claimActive: (close: () => void) => () => void
}

export const DROPDOWN_CONTEXT_KEY: InjectionKey<DropdownContextApi> = Symbol('win55-dropdown')
