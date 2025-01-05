import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Seo from "../../shared/layout-components/seo/seo";
import { Row, Col, Card } from "react-bootstrap";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

const Profile = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    education: "",
    professionalInfo: {
      title: "",
      company: "",
      experience: "",
      skills: [],
    },
    resume: null,
  });

  useEffect(() => {
    const fetchSessionAndDetails = async () => {
      try {
        const response = await axios.get("/api/profile/details", {
          withCredentials: true,
        });
        if (response.data && response.data.user) {
          setFormData((prevData) => ({
            ...prevData,
            ...response.data.user,
          }));
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
      
    };
    fetchSessionAndDetails();
  }, []);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("resume", file[0].file);

      const response = await axios.post("/api/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Resume uploaded successfully!");
      } else {
        alert("Failed to upload resume. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading resume. Please try again.");
    }
  };

  return (
    <>
      <Seo title="Profile" />
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Profile</h1>
        </div>

        <div className="row">
          <div className="col-12 justify-content-center">
            <div className="custom-card overflow-hidden card">
              {/* Name and Email Section */}
              <div className="row mb-4 my-4">
                <div className="col-12">
                  <h2 className="text-primary text-center">
                    {formData.name || "Name not provided"}
                  </h2>
                  <p className="text-secondary text-center">
                    {formData.email || "Email not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Resume Section */}
        <Row>
        <Col xl={6}>
        </Col><Col xl={6}>
            <h6 className="mb-3">Resume</h6>
            <Card className="custom-card">
              <Card.Header>
                <Card.Title>Upload Your Resume</Card.Title>
              </Card.Header>
              <Card.Body>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                maxFiles={1}
                server={{
                  process: {
                    url: "/api/profile/upload",
                    method: "POST",
                    withCredentials: true, // Ensure cookies are sent
                    onload: (response) => {
                      console.log("Upload Response:", response);
                      alert("File uploaded successfully!");
                    },
                    onerror: (error) => {
                      console.error("Upload failed:", error);
                      alert("Failed to upload resume. Please try again.");
                    },
                  },
                }}
                name="resume"
                labelIdle='Drag & Drop your resume or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                maxFileSize="5MB"
              />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

Profile.layout = "Contentlayout";
export default Profile;
