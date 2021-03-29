import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

import { ProductForm } from '../components/product-form';

import firebase from '../firebase';

import { editProductValidationSchema } from '../validation';

export const EditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await firebase.fetchDocumentById('products', productId);
        setProduct(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const onSubmit = async (data, image) => {
    try {
      await firebase.updateDocumentById('products', productId, {
        ...data,
        discountEndTime: data.discountEndTime?.unix?.() ?? '',
        image,
      });
      notification.open({
        message: 'Success',
        description: 'Product successfully edited!',
        duration: 3,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    product && (
      <ProductForm
        formTitle="Edit product"
        submitBtnTitle="Edit"
        onSubmit={onSubmit}
        validationSchema={editProductValidationSchema}
        product={product}
      />
    )
  );
};
