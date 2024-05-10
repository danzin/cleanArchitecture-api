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
  RouterProvider
} from 'react-router-dom'
import Signin from './screens/Signin.jsx';
import Signup from './screens/Signup.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <App/> }>
      <Route index={true} path='/' element={<Home/>}/>
      <Route index={true} path='/signin' element={<Signin/>}/>
      <Route index={true} path='/signup' element={<Signup/>}/>

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
