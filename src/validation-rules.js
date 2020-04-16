import validator from 'validator';

export default {
  type: {
    email: ({ value }) => validator.isEmail(value)
  }
};
