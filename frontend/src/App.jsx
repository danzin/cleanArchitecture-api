import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto px-4 my-2">
        <Outlet/>
      </div>
    </>
  )
}

export default App
