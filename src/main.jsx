import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Feedback from "./Components/Feedback.jsx";
import Login from "./Components/Login.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute.jsx";
import { UserProvider } from "./Context/context.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import EditModal from "./Components/EditModal.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Protecting the Rating route with PrivateRoute */}
          <Route
            path="/Rating"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          {/* Redirecting root (/) to Login */}
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<App />} />
          <Route path="/Modal" element={<EditModal />} />

          {/* <Route path="/Dashboard" element={<Dashboard />} /> */}

        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
