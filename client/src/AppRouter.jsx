/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from './main.jsx';
import { publicRoutes, privateRoutes } from './routes';
import { HOME_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE } from './utils/consts';

// Component for handling page navigation with authentication
const AppRouter = observer(() => {
  // Access userStore from StoreContext
  const { userStore } = useContext(StoreContext);
  console.log(userStore);

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {userStore.isAuth ? (
        privateRoutes.map(({ path, Component }) => (
          // Restrict admin route to admin users
          path === ADMIN_ROUTE && !userStore.isAdmin ? null : (
            <Route key={path} path={path} element={<Component />} />
          )
        ))
      ) : (
        <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
      )}
      <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
    </Routes>
  );
});

export default AppRouter;





// Second version before mobx
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { publicRoutes, privateRoutes } from './routes';
// import { HOME_ROUTE } from './utils/consts';


// // Component for handling page navigation
// function AppRouter() {
//     return (
//         <Routes>
//             {publicRoutes.map(({ path, Component }) => (
//                 <Route key={path} path={path} element={<Component />} />
//             ))}
//             {privateRoutes.map(({ path, Component }) => (
//                 <Route key={path} path={path} element={<Component />} />
//             ))}
//             <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
//         </Routes>
//     );
// };

// export default AppRouter;

// First version before using routes
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Auth from './pages/Auth';
// import Device from './pages/Page';
// import Basket from './pages/Basket';
// import Admin from './pages/Admin';
// import User from './pages/User';
// import Order from './pages/Order';

// // Component for handling page navigation
// function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/auth" element={<Auth />} />
//       <Route path="/device/:deviceId" element={<Device />} />
//       <Route path="/basket" element={<Basket />} />
//       <Route path="/admin" element={<Admin />} />
//       <Route path="/user/:id" element={<User />} />
//       <Route path="/order" element={<Order />} />
//     </Routes>
//   );
// }

// export default AppRouter;