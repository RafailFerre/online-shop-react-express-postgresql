import "./App.css";
import AppRouter from './AppRouter';

// Main App component
function App() {
  return (
    <>
      <div className="container mt-4">
        <AppRouter />
      </div>
    </>
  );
}

export default App



// Version before mobx
// import { BrowserRouter } from "react-router-dom";
// import AppRouter from "./AppRouter";

// function App() {
//   return (
//     <BrowserRouter>
//       <AppRouter />
//     </BrowserRouter>
//   );
// }

// export default App;



// Version before Pages and routing with AppRouter
// function App() {
//   return (
//     <div>
//       <h1>Online Shop</h1>
//     </div>
//   );
// }

// export default App;