// filter all properies
type GetByType<T, V> = {
  [P in keyof T]: T[P] extends V ? P : never;
}[keyof T];

/**
 * Just an alias to reduce repetitive code
 */
type Values<T> = T[keyof T];

/**
 * because our second argument is stringified type name,
 * we need some sort of vice-versa mapping
 */
type LiteralToType<T> = T extends 'string' ? string : T extends 'number' ? number : T extends 'Date' ? Date : never;
type TypeToLiteral<T> = T extends string ? 'string' : T extends number ? 'number' : T extends Date ? 'Date' : never;

export const getInterfaceFieldsWithType = <
  Obj extends Record<string, unknown>,
  Type extends TypeToLiteral<Values<Obj>>, // I need a guarantee that we have at least one property with expected type
>(
  obj: Obj,
  expectedType: Type,
): GetByType<Obj, LiteralToType<Type>>[] => {
  const keys = Object.keys(obj) as Array<keyof Obj>;
  /**
   * Here, filter is a typescript guard
   * It says: if I return true, then you can sleep well, this key is what you need
   */
  return keys.filter((elem): elem is GetByType<Obj, LiteralToType<Type>> => typeof obj[elem] === expectedType);
};

export const generateConstOfInterfaceField = <
  Obj extends Record<string, unknown>,
  Type extends TypeToLiteral<Values<Obj>>, // I need a guarantee that we have at least one property with expected type
>(
  obj: Obj,
  expectedType: Type,
): { [key: string]: string } => {
  const arrayField = getInterfaceFieldsWithType(obj, expectedType);
  return arrayField.reduce((state, field) => {
    state[field.toString().toUpperCase()] = field;
    return state;
  }, {});
};
