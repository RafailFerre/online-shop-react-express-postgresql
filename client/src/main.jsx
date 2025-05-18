import { StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { userStore } from './store/UserStore';
import { deviceStore } from './store/DeviceStore';
import { basketStore } from './store/BasketStore';
import { orderStore } from './store/OrderStore';
import './index.css';

// Create context for MobX stores
export const StoreContext = createContext(null);

// Collection of all MobX stores
const stores = { userStore, deviceStore, basketStore, orderStore, };

// Render the app with StoreContext and BrowserRouter
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContext.Provider value={stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreContext.Provider>
  </StrictMode>
);



// import React, { createContext } from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';
// import { userStore } from './store/UserStore';
// import { deviceStore } from './store/DeviceStore';
// import './index.css';

// // Create context for MobX stores
// export const StoreContext = createContext(null);

// // Collection of all MobX stores
// const stores = { userStore, deviceStore, };

// // Render the app with StoreContext and BrowserRouter
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <StoreContext.Provider value={stores}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </StoreContext.Provider>
//   </React.StrictMode>
// );