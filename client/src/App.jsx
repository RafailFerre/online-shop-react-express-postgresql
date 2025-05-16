// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRouter from "./AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;



// First version before Pages and routing with AppRouter
// function App() {
//   return (
//     <div>
//       <h1>Online Shop</h1>
//     </div>
//   );
// }

// export default App;