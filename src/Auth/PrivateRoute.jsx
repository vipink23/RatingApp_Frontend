import { useUser } from "../Context/context";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { auth } = useUser();
  const Auths = localStorage.getItem("Auth");
  if (!auth && !Auths) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default PrivateRoute;
