import Register from "./components/Register";
// import ipConfig from "./ipConfig.json";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import NotFound from "./components/NotFound";
import Admin from "./components/Admin";

const prodUrl = `https://qkart-backend-v2-ku0s.onrender.com/api/v1`;
const localUrl = `http://localhost:3000/api/v1`;
export const config = {
  endpoint:
    import.meta.env.VITE_ENVIRONMENT == "production" ? prodUrl : localUrl,
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
