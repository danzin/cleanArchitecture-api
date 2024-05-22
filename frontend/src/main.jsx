import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import store from './store.js';
import { Provider } from 'react-redux';
import Home from './screens/Home.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.jsx';
import Signin from './screens/Signin.jsx';
import Signup from './screens/Signup.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import Forbidden from './screens/Forbidden.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './screens/Dashboard.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <App/> }>
      <Route index={true} path='/' element={<Home/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/forbidden' element={<Forbidden/>}/>

      { /* Private Routes */ }
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/upload' element={<ProfileScreen />} />
      </Route>

      { /* Protected Routes */ }
       <Route path='' element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  </Provider>
)
