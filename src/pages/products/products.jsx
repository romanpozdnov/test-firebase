import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Space, List } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';

import { Product } from '../../components/product/product';

import firebase from '../../firebase';
import { removeUser } from '../../redux/slices/userSlice';
import {
  productsSelector,
  isLoadingSelector,
  getAllProducts,
  removeProduct,
} from '../../redux/slices/productsSlice';

import { ROUTES } from '../../constants';
import { STRINGS } from '../../constants/strings';

import './products.css';

const { productsPageStr } = STRINGS;

export const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(productsSelector);
  const isLoading = useSelector(isLoadingSelector);

  const handleLogout = async () => {
    await firebase.logout();
    dispatch(removeUser());
  };

  const deleteProduct = (productId, imageUrl) => {
    dispatch(removeProduct({ productId, imageUrl }));
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  return (
    <div className="products-wrapper">
      <div className="nav-bar">
        <Space size="middle">
          <Link to={ROUTES.createProduct}>
            <Space>
              <PlusOutlined />
              {productsPageStr.addNewItemBtnTitle}
            </Space>
          </Link>
          <Button
            type="primary"
            htmlType="button"
            icon={<ExportOutlined />}
            onClick={handleLogout}
          >
            {productsPageStr.LogoutBtnTitle}
          </Button>
        </Space>
      </div>
      <div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          loading={isLoading}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <Product
                productId={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                discount={product.discount}
                discountEndTime={product.discountEndTime}
                image={product.image}
                deleteProduct={deleteProduct}
                key={product.id}
              />
            </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};
