import React from 'react';
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import App from './App.jsx'
import {Provider} from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import rootReducer  from './reducer/';
import { Toaster } from "react-hot-toast";


//this is define the store and add all slice reducer which combine in one;
const store=configureStore({
  reducer:rootReducer,
})

const root =ReactDOM.createRoot(document.getElementById('root'));//create DOM;
root.render(
  <React.StrictMode>
    {/* provider use for redux toolkit */}
    <Provider store={store}>  

       <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>

    </Provider> 
  </React.StrictMode>,
)

