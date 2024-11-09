import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Desboard from "./pages/Desboard";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import CreateEmploye from "./pages/CreateEmploye";
import EmployeList from "./pages/EmployeList";


function App() {
  return (
    <>
      <Router future={{ v7_startTransition: true }}>
        <Suspense fallback={<Loader />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/desboard" element={<Desboard />} />
            <Route path="/create" element={<CreateEmploye />} />
            <Route path="/employeeList" element={<EmployeList />} />
            <Route path="/employeeList/:id" element={<CreateEmploye />} />
          </Routes>
          <ToastContainer autoClose={1000} />
        </Suspense>
      </Router>
    </>
  );
}

export default App;
