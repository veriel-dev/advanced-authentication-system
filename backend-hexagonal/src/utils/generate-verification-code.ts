/* export const generaeVerificationCode = () => randomUUID() */

export const generaeVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();
