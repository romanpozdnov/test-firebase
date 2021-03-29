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

import { registerValidationSchema } from '../validation';

const { registerPageStr } = STRINGS;

export const Register = () => {
  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerValidationSchema),
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async ({ email, password }) => {
    const { user } = await firebase.register(email, password);
    dispatch(
      setUser({
        email: user.email,
        id: user.uid,
      }),
    );
    history.push(ROUTES.products);
  };

  return (
    <div className="form-wrapper ">
      <Card title={registerPageStr.formTitle} className="auth-form" bordered>
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
          <Form.Item
            validateStatus={errors.confirmPassword ? 'error' : null}
            help={errors.confirmPassword ? errors.confirmPassword.message : null}
          >
            <Controller
              name="confirmPassword"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Input.Password
                  type="password"
                  onChange={onChange}
                  value={value}
                  placeholder="Confirm password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-btn">
              {registerPageStr.submitBtnTitle}
            </Button>
            {registerPageStr.alreadyRegistered}
            <Link to={ROUTES.login}>{registerPageStr.loginLinkTitle}</Link>
          </Form.Item>
        </form>
      </Card>
    </div>
  );
};
