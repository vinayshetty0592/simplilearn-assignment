import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Login from './pages/login';
import Registration from './pages/registration';
import Profile from './pages/profile';
import Page404 from './pages/page-404';
import Loader from './components/loader';
import { UserProvider } from './contexts/user';

const App = () => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    data: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (document.cookie.includes('x_access_token')) {
      axios(`${process.env.REACT_APP_API_HOST}/api/me`, { withCredentials: true })
        .then(response => response.data)
        .then(({ success, data }) => {
          setUser({
            isLoggedIn: success,
            data
          });
          setIsLoading(false);
        })
        .catch(() => {
          setUser({
            isLoggedIn: false,
            data: {}
          });
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className='app'>
      <UserProvider value={{ user, setUser }}>
        {
          isLoading ?
            <Loader /> :
            <BrowserRouter>
              {
                <Switch>
                  <Route exact path='/' component={Profile} />
                  <Route path='/profile' component={Profile} />
                  <Route exact path='/' component={Login} />
                  <Route path='/login' component={Login} />
                  <Route path='/register' component={Registration} />
                  <Route component={Page404} />
                </Switch>
              }
            </BrowserRouter>
        }
      </UserProvider>
    </div>
  );
};

export default App;