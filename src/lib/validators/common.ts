export const isRequired = (value: string) => value.trim().length > 0;

export const minLength = (value: string, min: number) =>
  value.trim().length >= min;

export const isNumber = (value: string) => /^[0-9]+$/.test(value);

export const isPositive = (value: number) => value > 0;
