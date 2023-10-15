import { ESCAPE_REGEX, NUMBER_AMOUNT_INPUT_REGEX } from 'config/constants/regex';

export const escapeRegExp = (string: string): string => {
  return string.replace(new RegExp(ESCAPE_REGEX, 'g'), '\\$&'); // $& means the whole matched string
};

export const checkNumberInput = (string: string): boolean => {
  return new RegExp(NUMBER_AMOUNT_INPUT_REGEX).test(string);
};
