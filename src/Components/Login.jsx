import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useUser } from "../Context/context";
import { useNavigate } from "react-router";
const Login = () => {
  const [errormsg, setErrorMsg] = useState(null);
  const { updateAuth } = useUser();
  const navigate = useNavigate();
  const LoginValidation = Yup.object().shape({
    username: Yup.string().required("Please enter username"),
    password: Yup.string().required("Please enter username"),
  });

  const AuthLogin = async (value) => {
    try {
      const res = await axios.post("http://localhost:8080/Login", value);
      updateAuth(res.data);

      console.log(res.response);

      const role = res.data.Role?.toUpperCase();
      
      if (role === "USER") {
        navigate("/Rating");
      } else {
        console.log(res.data);
        
        console.log("something went wrong");
        navigate("/Dashboard");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response.data.message);
    }

    console.log(errormsg, "errrorr");
  };
  return (
    <>
      <section className="flex justify-center items-center h-screen bg-gray-300">
        <div className="w-100 p-9  shadow-lg bg-white rounded-2xl border-2 border-gray-100">
          <h1 className="text-3xl block text-center font-semibold">
            Welcome Back !
          </h1>
          <p className="text-shadow-2xs block text-center mt-3">
            Welcome back please enter your details
          </p>
          <hr className="mt-5 border-t-2 border-gray-200 w-2xs mx-auto opacity-70" />

          <div className="mt-10">
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={LoginValidation}
              onSubmit={AuthLogin}
            >
              {({}) => (
                <Form>
                  <div className="mt-3">
                    <label
                      htmlFor="username"
                      className="block text-lg font-base mb-1"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      as="input"
                      name="username"
                      className="border-2 border-gray-100 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-sm p-4 mt-1 mb-2"
                      placeholder="Enter Username ..."
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="username"
                      className="block  text-lg font-base mb-1"
                    >
                      Password
                    </label>
                    <Field
                      type="text"
                      as="input"
                      name="password"
                      className="border-2 border-gray-100 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-sm p-4 mt-1 mb-2"
                      placeholder="Enter Password .."
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  {errormsg && (
                    <div className="text-sm text-red-500 text-center">
                      {errormsg}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col">
                    <button
                      type="submit"
                      className="bg-blue-800 text-white text-lg font-bold py-1 rounded-xl active:scale-[0.98] mb-5 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
