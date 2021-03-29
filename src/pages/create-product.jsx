import React from 'react';
import { notification } from 'antd';

import { ProductForm } from '../components/product-form';

import firebase from '../firebase';

import { createProductValidationSchema } from '../validation';

export const CreateProduct = () => {
  const onSubmit = async (data, image) => {
    try {
      await firebase.createDocument('products', {
        ...data,
        discountEndTime: data.discountEndTime?.unix?.() ?? '',
        image,
      });
      notification.open({
        message: 'Success',
        description: 'Product successfully created!',
        duration: 3,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProductForm
      formTitle="Create new product"
      submitBtnTitle="Create"
      onSubmit={onSubmit}
      validationSchema={createProductValidationSchema}
    />
  );
};
