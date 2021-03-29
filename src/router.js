import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import { PrivateRoute, AuthRoute, AuthVerified } from './components';
import { Login, Register, Products, CreateProduct, EditProduct } from './pages';

import { ROUTES } from './constants';

const { Content } = Layout;

const AppRouter = () => {
  return (
    <Layout className="layout">
      <AuthVerified>
        <Router>
          <Content>
            <Switch>
              <PrivateRoute exact path={ROUTES.products} component={Products} />
              <PrivateRoute path={ROUTES.createProduct} component={CreateProduct} />
              <PrivateRoute
                path={`${ROUTES.editProduct}/:productId`}
                component={EditProduct}
              />
              <AuthRoute path={ROUTES.login} component={Login} />
              <AuthRoute path={ROUTES.register} component={Register} />
              <Route component={() => <div>Not found</div>} />
            </Switch>
          </Content>
        </Router>
      </AuthVerified>
    </Layout>
  );
};

export default AppRouter;
