import React from 'react';
import Login from './Login';

import '../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss';
import Header from './loginHeader';

export function AuthPage() {
  return (
    <>
      <Header />
      <Login />
    </>
  );
}
