import Register from "./components/Register";
// import ipConfig from "./ipConfig.json";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `http://localhost:3000/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;
