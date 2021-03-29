import React, { useState, useEffect } from 'react';
import { InputNumber, Input, Button, DatePicker, Upload, Card, Form } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';

import firebase from '../firebase';
import {
  getImageDimensions,
  formatterPrice,
  parsePrice,
  formatterDiscount,
  parserDiscount,
} from '../helpers';

import { STRINGS } from '../constants/strings';

const { productFormStr } = STRINGS;

export const ProductForm = ({
  formTitle,
  submitBtnTitle,
  onSubmit,
  validationSchema,
  product,
}) => {
  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitted, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isFieldVisible, setIsFieldVisible] = useState(product?.discount);
  const [imageUploadError, setImageUploadError] = useState('');

  useEffect(() => {
    setUploadedImage(product?.image);
  }, [product]);

  useEffect(() => {
    if (isSubmitted && !isSubmitSuccessful && !uploadedImage) {
      setImageUploadError('Required');
    }
  }, [isSubmitted, isSubmitSuccessful, uploadedImage]);

  const onResetForm = () => {
    if (!product?.id) {
      reset({
        title: null,
        price: null,
        discount: null,
        description: null,
        discountEndTime: null,
      });

      setUploadedImage(null);
      setImageUploadError('');
    }
  };

  const onSubmitForm = async (data) => {
    if (imageUploadError) return;
    await onSubmit(data, uploadedImage);
    onResetForm();
  };

  const setDisabledDate = (selectedDate) => {
    return selectedDate && selectedDate < moment().endOf('day');
  };

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      file.status = 'error';
      setImageUploadError('You can only upload JPG/PNG file!');
      return false;
    }

    const { width, height } = await getImageDimensions(file);
    const isValidSize = width >= 200 && width <= 4000 && height >= 200 && height <= 4000;

    if (!isValidSize) {
      file.status = 'error';
      setImageUploadError('Width and Height should be between 200 and 4000 px');
      return false;
    }
  };

  const customUpload = async ({ onError, onSuccess, file }) => {
    try {
      setImageUploadError('');
      const result = await firebase.uploadFile(file);
      onSuccess(result);
    } catch (error) {
      onError(error);
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setUploadedImage(info.file.response);
    }
  };

  const handleRemove = async () => {
    setImageUploadError('Required');
    if (uploadedImage) {
      await firebase.removeFileByUrl(uploadedImage.imageUrl);
      setUploadedImage(null);
    }
  };

  return (
    <div className="form-wrapper">
      <Card title={formTitle} className="product-form" bordered>
        <form className="ant-form-vertical" onSubmit={handleSubmit(onSubmitForm)}>
          <Form.Item
            label="Title"
            validateStatus={errors.title ? 'error' : null}
            help={errors.title ? errors.title.message : null}
          >
            <Controller
              name="title"
              control={control}
              defaultValue={product?.title || ''}
              render={({ onChange, value }) => (
                <Input type="text" onChange={onChange} value={value} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            validateStatus={errors.description ? 'error' : null}
            help={errors.description ? errors.description.message : null}
          >
            <Controller
              name="description"
              control={control}
              defaultValue={product?.description || ''}
              render={({ onChange, value }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  maxLength={200}
                  rows={4}
                  showCount
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Price"
            validateStatus={errors.price ? 'error' : null}
            help={errors.price ? errors.price.message : null}
          >
            <Controller
              name="price"
              control={control}
              defaultValue={product?.price}
              render={({ onChange, value }) => (
                <InputNumber
                  placeholder="$"
                  onChange={onChange}
                  value={value}
                  min={0}
                  formatter={formatterPrice}
                  parser={parsePrice}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Discount"
            validateStatus={errors.discount ? 'error' : null}
            help={errors.discount ? errors.discount.message : null}
          >
            <Controller
              name="discount"
              control={control}
              defaultValue={product?.discount}
              render={({ onChange, value }) => (
                <InputNumber
                  placeholder="%"
                  onChange={(value) => {
                    onChange(value);
                    setIsFieldVisible(!!value);
                  }}
                  value={value}
                  min={0}
                  formatter={formatterDiscount}
                  parser={parserDiscount}
                />
              )}
            />
          </Form.Item>
          {isFieldVisible && (
            <Form.Item
              label="Discount end"
              validateStatus={errors.discountEndTime ? 'error' : null}
              help={errors.discountEndTime ? errors.discountEndTime.message : null}
            >
              <Controller
                name="discountEndTime"
                control={control}
                defaultValue={
                  product?.discountEndTime
                    ? moment(moment.unix(product?.discountEndTime), 'YYYY-MM-DD')
                    : undefined
                }
                render={({ onChange }) => (
                  <DatePicker
                    onChange={onChange}
                    disabledDate={setDisabledDate}
                    defaultValue={
                      product?.discountEndTime
                        ? moment(moment.unix(product?.discountEndTime), 'YYYY-MM-DD')
                        : undefined
                    }
                  />
                )}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Product image"
            validateStatus={imageUploadError ? 'error' : null}
            help={imageUploadError ? imageUploadError : null}
          >
            <Upload
              name="image"
              className={imageUploadError ? 'error' : ''}
              beforeUpload={beforeUpload}
              customRequest={customUpload}
              onChange={handleChange}
              onRemove={handleRemove}
              maxCount={1}
              defaultFileList={product ? [{ name: product?.image?.fileName }] : []}
              showUploadList={isSubmitted && !uploadedImage ? false : true}
            >
              <Button icon={<UploadOutlined />}>{productFormStr.uploadBtnTitle}</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {submitBtnTitle}
            </Button>
          </Form.Item>
        </form>
      </Card>
    </div>
  );
};
