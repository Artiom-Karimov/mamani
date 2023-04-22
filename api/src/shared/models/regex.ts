export const expressions = {
  color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;

Object.freeze(expressions);
