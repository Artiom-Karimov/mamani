export const expressions = {
  color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  uuid: /^[a-f,0-9,-]{36,36}$/,
  password: /^[\w\@\.\-\&\$\*\#\!\%\^\~\,]{8,20}$/i,
  isoDate:
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
} as const;

Object.freeze(expressions);
