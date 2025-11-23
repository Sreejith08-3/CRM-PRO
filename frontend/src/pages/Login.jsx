// frontend/src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, message } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import RegisterForm from '@/forms/RegisterForm';
import { request } from '@/request';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // local UI state to toggle between login and register forms
  const [showRegister, setShowRegister] = useState(false);
  // small local loading for register operation
  const [registerLoading, setRegisterLoading] = useState(false);

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess && !showRegister) navigate('/');
    // if registered successfully we will not depend on isSuccess here (we handle register flow separately)
  }, [isSuccess, navigate, showRegister]);

  // Submit handler for register form (uses existing request helper)
  const onRegisterFinish = async (values) => {
    try {
      setRegisterLoading(true);
      // POST to /api/register (adjust url if your backend expects a different path)
      // const res = await request.post({ url: '/api/register', jsonData: values });
      const res = await request.post({ entity: '/register', jsonData: values });
      setRegisterLoading(false);

      if (res && res.success) {
        message.success('Registration successful — please login');
        setShowRegister(false); // switch back to login form
      } else {
        message.error(res?.message || 'Registration failed');
      }
    } catch (err) {
      setRegisterLoading(false);
      message.error(err?.message || 'Registration error');
    }
  };

  const FormContainer = () => {
    if (showRegister) {
      // Render the existing RegisterForm inside a Form wrapper
      return (
        <Loading isLoading={registerLoading}>
          <Form
            layout="vertical"
            name="register_form"
            className="login-form"
            initialValues={{ country: undefined }}
            onFinish={onRegisterFinish}
          >
            <RegisterForm userLocation={undefined} />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={registerLoading}
                size="large"
              >
                {translate('Register')}
              </Button>
              {' '}
              <a
                style={{ marginLeft: 12, cursor: 'pointer' }}
                onClick={() => setShowRegister(false)}
              >
                {translate('Already have an account? Login')}
              </a>
            </Form.Item>
          </Form>
        </Loading>
      );
    }

    // Default: show login form
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
            email: '',
            password: '',
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
            >
              {translate('Log in')}
            </Button>
            {' '}
            <a
              style={{ marginLeft: 12, cursor: 'pointer' }}
              onClick={() => setShowRegister(true)}
            >
              {translate('Register')}
            </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE={showRegister ? 'Register' : 'Sign in'} />;
};

export default LoginPage;
