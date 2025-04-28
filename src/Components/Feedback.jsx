import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../Context/context";
import { useEffect } from "react";
import axios from "axios";
import successImg from "../assets/alert-success.svg";

const Feedback = () => {
  const [rating, setRating] = useState([1, 2, 3, 4, 5]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const { auth, updateAuth } = useUser();
  const [success, setSuccess] = useState(false);
  const [selectedstar, setSelectedStar] = useState("");
  const [preview, setPreview] = useState(null);

  const HandleRating = (val, setFieldValue) => {
    setSelectedStar(val);
    const newSelected = Array.from({ length: val }, (_, index) => index + 1);
    setSelectedRatings(newSelected);
    setFieldValue("rating", newSelected);
  };

  const RatingValidation = Yup.object().shape({
    opinion: Yup.string().required("Please enter Opinion"),
  });
  const handleLogout = () => {
    updateAuth(null);
    localStorage.removeItem("Auth", null);
  };

  const HandleFileUpload = (e, setFieldValue) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setFieldValue("image", selectedFile); // If you're using Formik or similar
    } else {
      setFieldValue("image", "");
      setPreview(null);
    }

    // setFieldValue("image", selectedFile ? selectedFile : "");
    // setPreview(selectedFile);
  };

  const handleRemoveImage = (setFieldValue) => {
    setPreview(null);
    setFieldValue("image", null); // Clear field if using Formik
  };

  const HandleSubmit = (values) => {
    console.log(values);

    const bodyFormData = new FormData();
    bodyFormData.append("feedback", values.opinion);
    bodyFormData.append("rating", JSON.stringify(values.rating));
    bodyFormData.append("user", values.User);
    bodyFormData.append("image", values.image);
    bodyFormData.append("date", new Date().toISOString().split("T")[0]);
    bodyFormData.append("response", "");
    axios({
      method: "post",
      url: "http://localhost:8080/AddFeedback",
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        //handle success
        if (response.status === 200 && response.data.status === "OK") {
          setSuccess(true);
        } else {
          setSuccess(true);
        }
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-300 w-full">
        {!success && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-16 lg:py-18 shadow-lg bg-white rounded-xl border-2 border-gray-100">
            {/* content */}
            <div className="absolute top-10 right-10">
              <div className="bg-gray-200 h-12 w-12 rounded-full flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-600 text-xl"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl block text-start font-semibold">
                How did we do?
              </h1>
            </div>
            <div>
              <p className="block text-base mt-3">
                We value your feedback and would love to hear about your
                experience with us. Kindly rate our services on a scale of 1 to
                5.
              </p>
            </div>

            <Formik
              initialValues={{
                User: "",
                rating: "",
                opinion: "",
                image: "",
              }}
              validationSchema={RatingValidation}
              onSubmit={(values, { setFieldValue }) => {
                HandleSubmit(values, setFieldValue);
              }}
            >
              {({ setFieldValue }) => (
                <>
                  
                  {useEffect(() => {
                    setFieldValue("User", auth?.UserId);
                  }, [auth?.UserId, setFieldValue])}

                  <Form>
                    {/* Rating Selection */}
                    {/* <div className="grid grid-cols-5 gap-4 mt-8">
                      {rating?.map((item) => (
                //         <div
                //           key={item}
                //           onClick={() => HandleRating(item, setFieldValue)}
                //           className={`grid place-content-center text-gray-600 h-10 w-10 rounded-full cursor-pointer 
                // ${
                //   selectedRatings?.includes(item)
                //     ? "bg-amber-300"
                //     : "bg-zinc-200"
                // }`}
                //         >
                //           {item}
                //         </div>
                <div className="grid place-content-center text-gray-600 h-10 w-10 rounded-full cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="#FFD43B"
                        d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
                      />
                    </svg>
                </div>
                      ))}
                    </div> */}

                    <div className="grid grid-cols-5 gap-4 mt-8">
                      {rating?.map((item) => (
                        <div
                          key={item}
                          onClick={() => HandleRating(item, setFieldValue)}
                          className="grid place-content-center cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            className="h-8 w-8"
                          >
                            <path
                              fill={
                                selectedRatings?.includes(item)
                                  ? "#FFD700"
                                  : "#E5E7EB"
                              }
                              d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>

                    {/* Opinion Text Area */}
                    <div className="mt-8 flex gap-4">
                      <div className="w-3/2 flex flex-col">
                        <Field
                          as="textarea"
                          name="opinion"
                          className="border-2 border-gray-100 w-full h-32 text-base focus:outline-none focus:ring-0 focus:border-gray-600 rounded-sm mb-2 p-2"
                          placeholder="Your Opinion.."
                        />
                        <ErrorMessage
                          name="opinion"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* File Upload Section */}
                      <div className="box-border w-1/2 h-32 border-2 border-dotted p-4 rounded-2xl flex justify-center items-center relative">
                        <label className="w-full h-full flex justify-center items-center cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => HandleFileUpload(e,setFieldValue)}
                          />
                          {preview ? (
                            <img
                              src={preview}
                              alt="Preview"
                              className="object-contain w-full h-full rounded-2xl"
                            />
                          ) : (
                            <span className="text-gray-500">
                              Click to upload image
                            </span>
                          )}
                        </label>

                        {preview && (
                          <button
                            type="button"
                            onClick={()=>handleRemoveImage(setFieldValue)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex flex-col">
                      <button
                        type="submit"
                        className="bg-blue-800 text-white text-lg font-bold py-2 rounded-xl active:scale-[0.98] mb-5 cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        )}

        {success && (
          <div className="w-100 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-16 lg:py-18 shadow-lg bg-white rounded-xl border-2 border-gray-100">
            <div>
              <img src={successImg} alt="" className="w-30 h-40 mx-auto" />
            </div>

            <div className="mx-auto justify-center text-center mt-2.5">
              <span className=" bg-yellow-200 px-8 py-3 rounded-3xl">
                {`You are Rated ${selectedstar} out of 5`}
              </span>
            </div>

            <div className="mt-8">
              <h1 className="text-3xl block text-center font-semibold">
                Thank You !
              </h1>
            </div>

            <div>
              <p className="block text-sm mt-3"></p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Feedback;
