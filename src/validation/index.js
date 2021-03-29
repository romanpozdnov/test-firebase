import * as yup from 'yup';

export const registerValidationSchema = yup.object().shape({
  email: yup.string().required('Required').email('Email must be valid email'),
  password: yup.string().required('Required').min(6, 'Password too short'),
  confirmPassword: yup
    .string()
    .required('Required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .min(6, 'Password too short'),
});

export const loginValidationSchema = yup.object().shape({
  email: yup.string().required('Required').email('Email must be valid email'),
  password: yup.string().required('Required').min(6),
});

export const createProductValidationSchema = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .required('Required')
    .min(20, 'Must be greater than or equal to 20 symbols')
    .max(60, 'Must be less than or equal to 60 symbols'),
  description: yup
    .string()
    .nullable()
    .max(200, 'Must be less than or equal to 200 symbols'),
  price: yup
    .number()
    .nullable()
    .required('Required')
    .typeError('Must be a number')
    .min(1, 'Must be greater than or equal to $1')
    .max(99999999.99, 'Must be less than or equal to $99999999.99'),
  discount: yup
    .number()
    .nullable()
    .default(null)
    .typeError('Must be a number')
    .min(10, 'Must be greater than or equal to 10%')
    .max(90, 'Must be less than or equal to 90%'),
  discountEndTime: yup
    .mixed()
    .nullable()
    .when('discount', {
      is: (discount) => discount >= 10 && discount <= 90,
      then: yup.mixed().required('Required'),
    }),
});

export const editProductValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Required')
    .min(20, 'Must be greater than or equal to 20 symbols')
    .max(60, 'Must be less than or equal to 60 symbols'),
  description: yup.string().max(200, 'Must be less than or equal to 200 symbols'),
  price: yup
    .number()
    .required('Required')
    .typeError('Must be a number')
    .min(1, 'Must be greater than or equal to $1')
    .max(99999999.99, 'Must be less than or equal to $99999999.99'),
  discount: yup
    .number()
    .nullable()
    .default(null)
    .typeError('Must be a number')
    .min(10, 'Must be greater than or equal to 10%')
    .max(90, 'Must be less than or equal to 90%'),
  discountEndTime: yup.mixed().when('discount', {
    is: (discount) => discount >= 10 && discount <= 90,
    then: yup.mixed().required('Required'),
  }),
});
