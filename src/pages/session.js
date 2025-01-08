import React, { useEffect, useState, useRef } from 'react';
import { FilePond, registerPlugin } from "react-filepond";
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import Seo from '../../shared/layout-components/seo/seo';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const Floatinglabels = () => {
    const [client, setClient] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [error, setError] = useState('');

    // Enable submit button only when job description and resume file are provided
    useEffect(() => {
        setIsSubmitEnabled(jobDescription && resumeFile);
    }, [jobDescription, resumeFile]);

    const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);

    const handleSubmit = async () => {
        if (!jobDescription || !resumeFile) {
            setError('Job description and resume are mandatory.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            // Send the resume to the backend for OpenAI processing
            const response = await fetch('/api/process-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                const { structuredData } = data;

                // Insert the extracted details into MongoDB
                const insertResponse = await fetch('/api/save-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: structuredData.name,
                        email: structuredData.email,
                        skills: structuredData.skills,
                        client,
                        jobDescription,
                        professionalExperience: structuredData.professional_experience,
                    }),
                });

                if (insertResponse.ok) {
                    alert('Data saved successfully!');
                } else {
                    alert('Failed to save data.');
                }
            } else {
                alert('Failed to process resume.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Seo title="Job Application" />
            <Row className="mt-3">
                <Col xl={9}>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="ClientDetails" className="mb-4">
                                    <Form.Label>Client (Optional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="JobDescription" className="mb-4">
                                    <Form.Label>Job Description or Tech Stack</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={jobDescription}
                                        onChange={handleJobDescriptionChange}
                                        required
                                    />
                                </Form.Group>

                                <FilePond
                                    files={files}
                                    onupdatefiles={(fileItems) => {
                                        setFiles(fileItems);
                                        if (fileItems.length > 0) {
                                            setResumeFile(fileItems[0].file);
                                        } else {
                                            setResumeFile(null);
                                        }
                                    }}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    name="resume"
                                    labelIdle='Drag & Drop your resume or <span class="filepond--label-action">Browse</span>'
                                    acceptedFileTypes={[
                                        "application/pdf",
                                        "application/msword",
                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    ]}
                                    maxFileSize="5MB"
                                />

                                <div className="text-end mt-4">
                                    <Button
                                        variant="primary"
                                        onClick={handleSubmit}
                                        disabled={!isSubmitEnabled}
                                    >
                                        Submit
                                    </Button>
                                </div>
                                {error && <p className="text-danger mt-2">{error}</p>}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

Floatinglabels.layout = 'Contentlayout';

export default Floatinglabels;
