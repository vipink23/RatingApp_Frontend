
import "./App.css";
import Login from "./Components/Login";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Login/>
      <Outlet />
    </>
  );
}

export default App;
