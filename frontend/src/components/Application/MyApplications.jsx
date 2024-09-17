import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchApplications = async () => {
        try {
          const url = user.role === "Employer" 
            ? "http://localhost:4000/api/v1/application/employer/getall" 
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

          const { data } = await axios.get(url, { withCredentials: true });
          setApplications(data.applications);
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      };

      fetchApplications();
    }
  }, [user, isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
    return null;
  }

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, { withCredentials: true });
      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>{user.role === "Job Seeker" ? "My Applications" : "Applications From Job Seekers"}</h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element) => (
            user.role === "Job Seeker" ? (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
              />
            ) : (
              <EmployerCard
                element={element}
                key={element._id}
              />
            )
          ))
        )}
      </div>
    </section>
  );
};

export default MyApplications;
const JobSeekerCard = ({ element, deleteApplication }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};
const EmployerCard = ({ element }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>
    </div>
  );
};
