import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUser } from "../Context/context";
import NoImage from "../assets/No-Image-Placeholder.svg";
import Swal from "sweetalert2";
import EditModal from "./EditModal";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const itemsPerPage = 5;
  const { auth, updateAuth } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [review , setReview] = useState("")
  //   const hasCalledFeedbacks = useRef(false);

  const getFeedbacks = async (Token) => {
    try {
      const res = await axios.get("http://localhost:8080/GetallFeedback", {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  //   useEffect(() => {
  //     // console.log(auth);

  //     if (auth?.accessToken && !hasCalledFeedbacks.current) {
  //       hasCalledFeedbacks.current = true;
  //       getFeedbacks(auth?.accessToken);
  //     }
  //   }, [auth?.accessToken, load]);
  useEffect(() => {
    if (auth?.accessToken) {
      getFeedbacks(auth?.accessToken);
    }
  }, [auth?.accessToken, load]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(data)
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Array.isArray(data)
    ? Math.ceil(data.length / itemsPerPage)
    : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const Handledata = (id, methode) => {
    if (methode === "Remove") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteFeedback(id);
          setLoad(!load);
        }
      });
    } else {
      getFeedbackbyId(id)  
      setShowModal(true);
    }
  };

  const getFeedbackbyId = async (id)=>{
    try {
        const res = await axios.get(`http://localhost:8080/GetFeedbackById/${id}`);
        console.log(res);
        setReview(res.data)
    } catch (error) {
        console.log(error, 'err');
        
    }
  }

  const deleteFeedback = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/DeleteFeedback/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      if (res.status === 200 && res.data.status === true) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        setLoad(!load);
      }
    } catch (error) {
      console.log(error, "errr");
    }
  };
  const handleCloseModal = () => {
    // setSelectedEmployee(null);
    setShowModal(false);
    setReview("")
  };

  return (
    <>
      <div className="flex  p-8 min-h-screen bg-gray-100 w-full">
        <div className="w-full shadow-lg bg-white rounded-xl border-2 border-gray-100 py-7 px-5 min-h-screen">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-8 ">
            <h2 className="text-xl font-semibold text-gray-700">
              Feedback List
            </h2>
            <div className="flex flex-wrap gap-3 ml-auto">
              <input
                type="text"
                // value={searchquery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onChange={handleSerch}
                placeholder="Search rating, Date & Name"
                className="w-[290px] px-3 py-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-100 shadow-sm rounded-md">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Feedback</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td className="p-4" colSpan="4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">{item.User}</td>
                      <td className="p-4">{item.job}</td>
                      <td className="p-4">
                        {item.image === "" ? (
                          <div>
                            <img
                              src={NoImage}
                              alt=""
                              className="object-cover box-border w-28 h-22  border-1 border-gray-200 rounded-2xl"
                            />
                          </div>
                        ) : (
                          <div>
                            <img
                              src={item.image}
                              alt=""
                              className="object-fill box-border w-28 h-25  border-1 border-gray-200 rounded-2xl"
                            />
                          </div>
                        )}
                      </td>
                      <td className="p-4">{item.Feedback}</td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            title="Edit"
                            type="button"
                            onClick={() => Handledata(item.Id, "Edit")}
                            style={{ cursor: "pointer" }}
                            className="text-xs px-2 py-2 rounded-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-300 active:scale-[1.10] cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faPencil}
                              style={{ fontSize: "1rem" }}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => Handledata(item.Id, "Remove")}
                            title="Delete"
                            className="text-xs px-3 py-1 rounded-sm text-red-600 hover:text-red-800 border border-gray-300 hover:border-red-300 active:scale-[1.10] cursor-pointer "
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-gray-600">
              {data && data.length > 0
                ? `Showing ${
                    (currentPage - 1) * itemsPerPage + 1
                  } to ${Math.min(
                    currentPage * itemsPerPage,
                    data.length
                  )} of ${data.length} entries`
                : "Showing 0 to 0 of 0 entries"}
            </div>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-2 py-1.5 border text-sm rounded transition-colors duration-200 ${
                    currentPage === i + 1
                      ? "bg-indigo-400 text-white border-indigo-300"
                      : "bg-white text-gray-800 border-gray-400 hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {showModal && (
          <EditModal
            review={review}
            onClose={handleCloseModal}
            // onUpdate={handleUpdate}
          />
        )}
          </div>
        </div>
       
      </div>
    </>
  );
};

export default Dashboard;
