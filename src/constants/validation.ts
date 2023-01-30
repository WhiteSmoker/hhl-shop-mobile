export const REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const REG_EMAIL = /^[\w.]{1,}@[a-z0-9]{1,}(\.[a-z0-9]{1,}){1,10}$/gm;
export const VALIDATION_INPUT = {
  NAME: {
    regex: /^[A-Za-z0-9_]+$/,
    message: `Should only contain letters, numbers and '_'`,
  },
  FIRST_NAME: {
    regex: /^[A-Za-z ]+$/,
    message: 'Should only contain letters (a-z A-Z) and space.',
  },
};
