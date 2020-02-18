import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/auth.action';
import { clearCurrentProfile } from './redux/actions/profile.action';
import { Provider } from 'react-redux';
import store from './redux/store';

import PrivateRoute from './components/common/PrivateRoute';

//#region layout
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
//#endregion
//#region auth
import Register from './components/auth/Register';
import Login from './components/auth/Login';
//#endregion
//#region dashboard
import Dashboard from './components/dashboard/Dashboard';
//#endregion
//#region create-profile
import CreateProfile from './components/create-profile/CreateProfile';
//#endregion
//#region edit-profile
import EditProfile from './components/edit-profile/EditProfile';
//#endregion
//#region add-credentials
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
//#endregion
//#region profiles
import Profiles from './components/profiles/Profiles';
//#endregion
//#region profile
import Profile from './components/profile/Profile';
//#endregion
//#region not-found
import NotFound from './components/not-found/NotFound';
//#endregion
//#region posts
import Posts from './components/posts/Post';
//#endregion
//#region post
import Post from './components/post/Post'
//#endregion

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser);
    // TODO: clear current Profile
    store.dispatch(clearCurrentProfile);
    // Redirect to login
    window.location.href = '/login';
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/add-education" component={AddEducation} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
            <Route exact path="/not-found" component={NotFound} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
