import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Body from './components/Body';
import '../src/public/public.css';
import '../src/public/reset.css';
import PrivateRoute, { LoginProvider } from './auth/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  return (
    <Router>
      <LoginProvider>
        {/* <Header /> */}
        <Body />
      </LoginProvider>
    </Router>
  );
}
export default App;
