/* eslint-disable max-len */
export const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const ZERO_HEX_REGEX = /^0x0*$/;
export const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/;
export const INPUT_REGEX = /^\d*(?:\\[.])?\d*$/;
export const ACCOUNT_REGEX = /^(0[xX])?[a-fA-F0-9]{1,64}$/;
export const HEX_REGEX = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
export const NUMBER_AMOUNT_INPUT_REGEX = /^\d*(?:\\[.])?\d*$/; // match escaped "." characters via in a non-capturing group
