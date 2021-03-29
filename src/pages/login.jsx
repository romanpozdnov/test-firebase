import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Card, Form } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';

import firebase from '../firebase';
import { setUser } from '../redux/slices/userSlice';

import { ROUTES } from '../constants';
import { STRINGS } from '../constants/strings';

import { loginValidationSchema } from '../validation';

const { loginPageStr } = STRINGS;

export const Login = () => {
  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async ({ email, password }) => {
    const { user } = await firebase.login(email, password);
    dispatch(
      setUser({
        email: user?.email,
        id: user?.uid,
      }),
    );
    history.push(ROUTES.products);
  };

  return (
    <div className="form-wrapper ">
      <Card title={loginPageStr.fromTitle} className="auth-form" bordered>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.email ? 'error' : null}
            help={errors.email ? errors.email.message : null}
          >
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Input
                  type="text"
                  onChange={onChange}
                  value={value}
                  placeholder="Email"
                  prefix={<MailOutlined className="site-form-item-icon" />}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            validateStatus={errors.password ? 'error' : null}
            help={errors.password ? errors.password.message : null}
          >
            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Input.Password
                  type="password"
                  onChange={onChange}
                  value={value}
                  placeholder="Password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-btn">
              {loginPageStr.submitBtnTitle}
            </Button>
            {loginPageStr.or}
            <Link to={ROUTES.register}>{loginPageStr.registerLinkTitle}</Link>
          </Form.Item>
        </form>
      </Card>
    </div>
  );
};
