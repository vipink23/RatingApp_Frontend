// import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";

function EditModal({ review, onClose, onUpdate }) {
  const [rating, setRating] = useState([1, 2, 3, 4, 5]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (review?.rating) {
      // Convert all items to Numbers
      const newSelected = review.rating.map((item) => Number(item));
      setSelectedRatings(newSelected);
    }
    if (review?.image !== "") {
      setPreview(review.image);
    }

    console.log(review, "revv");
  }, [review]);

  const handleRemoveImage = (setFieldValue) => {
    setPreview(null);
    setFieldValue("image", null); // Clear field if using Formik
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
  };

  const HandleSubmit = (values)=>{
    console.log(values,'valll');
    console.log(review.rating,'ra');

    
    
    const bodyFormData = new FormData();
    bodyFormData.append("feedback", review.Feedback);
    bodyFormData.append("rating", JSON.stringify(review.rating));
    bodyFormData.append("user", review.UserId);
    bodyFormData.append("image", values.image);
    bodyFormData.append("date", review.reviewDate);
    bodyFormData.append("response", values.response);

    axios({
        method: "put",
        url: `http://localhost:8080/UpdateFeedback/${review.Id}`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
            console.log(response,'response');
            
          //handle success
          if (response.status === 200 && response.data.status === true) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Updated Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setTimeout(() => {
                if (onUpdate) onUpdate();
                onClose();
              }, 1520);
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });


  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 "
        onClick={onClose}
        style={{ cursor: "pointer" }}
      ></div>

      {/* Modal Box */}
      <div className="relative z-10 flex items-center justify-center min-h-full">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl w-full max-w-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 dark:border-neutral-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Employee Review
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <Formik
            initialValues={{
              User: "",
              rating: "",
              opinion: "",
              image: "",
              response: review? review.response : "",
            }}
            enableReinitialize
            onSubmit={HandleSubmit}
            // validationSchema={DisplayingErrorMessagesSchema}
          >
            {({ handleChange, values, setFieldValue }) => (
              <Form>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-8">
                    <div className="mt-6 grid">
                      <div className="grid grid-cols-5 gap-4 mt-4 mb-10">
                        {rating?.map((item) => (
                          <div
                            key={item}
                            //   onClick={() => HandleRating(item, setFieldValue)}
                            className="grid place-content-center cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                              className="h-8 w-8"
                              fill={
                                selectedRatings?.includes(item)
                                  ? "#FFD700"
                                  : "#E5E7EB"
                              }
                            >
                              <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                            </svg>
                          </div>
                        ))}
                      </div>

                      <div className="mb-6">
                        <p
                          className="text-start text-base
                        "
                        >
                          Review :{" "}
                          <span className="text-sm px-2">
                            {review.Feedback}
                          </span>
                        </p>
                        {/* <p className="text-sm px-18"></p> */}
                      </div>
                      <div className="box-border w-1/4 h-32 border-2 border-dotted p-4 rounded-2xl flex justify-center items-center relative mb-8">
                        <label className="w-full h-full flex justify-center items-center cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => HandleFileUpload(e, setFieldValue)}
                          />
                          {preview ? (
                            <img
                              src={preview}
                              alt="Preview"
                              className="object-fit w-full h-full rounded-2xl"
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
                            onClick={() => handleRemoveImage(setFieldValue)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="w-full mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Response
                        </label>
                        <Field
                          as="textarea"
                          name="response"
                          className="border-2 border-gray-100 w-full h-32 text-base focus:outline-none focus:ring-0 focus:border-gray-200 rounded-sm mb-2 p-2"
                          placeholder="Your Response.."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-end gap-4 ">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer active:scale-[1.10]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ cursor: "pointer" }}
                    //   onClick={handleSubmit}
                    className="active:scale-[1.10] rounded-md bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}

export default EditModal;
