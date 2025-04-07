import React from 'react';
import Login from './Login';

import '../../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss';
import Header from './loginHeader';
import './style.css';

export function LoginPage2() {
  return (
    <div className="login_page">
      <Header />
      <Login />
    </div>
  );
}
