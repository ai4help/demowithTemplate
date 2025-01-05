import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import Seo from '../../shared/layout-components/seo/seo';

const Floatinglabels = () => {
    const [client, setClient] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const recognitionRef = useRef(null);

    const handleClientChange = (e) => setClient(e.target.value);
    const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);

    // Function to handle file selection and upload immediately
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        const allowedFormats = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (file && allowedFormats.includes(file.type)) {
            setResumeFile(file);

            const formData = new FormData();
            formData.append('file', file);
console.log('formData', formData)
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('File uploaded successfully');
                    setError('');
                } else {
                    console.log('File upload failed');
                    setError('Failed to upload the resume file.');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setError('An error occurred while uploading the file.');
            }
        } else {
            setError('Invalid file format. Please upload a PDF or Word document.');
        }
    };

    const handleSubmit = async () => {
        if (!client || !jobDescription || !resumeFile) {
            setError('All fields are mandatory.');
            return;
        }

        try {
            // Send client and job description to create a session
            const response = await fetch('/api/topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ client, jobDescription }),
            });

            const data = await response.json();
            if (data.sessionId) {
                setSessionId(data.sessionId);
                setIsMicEnabled(true); // Enable the mic button
                setError('');
            } else {
                setError('Failed to create session.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const { transcript } = event.results[i][0];
                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }
            setInterimTranscript(interim);
            setFinalTranscript((prev) => prev + final);
        };

        recognitionRef.current.start();
    };

    const stopRecording = async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            const transcript = finalTranscript;
            setMessages((prevMessages) => [...prevMessages, { type: 'user', text: transcript }]);
            setInterimTranscript('');
            setFinalTranscript('');

            // Send the transcription to the server
            if (sessionId) {
                try {
                    const response = await fetch('/api/conversation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ transcription: transcript, sessionId }),
                    });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let completeResponse = '';

                    const readStream = async () => {
                        let { done, value } = await reader.read();
                        while (!done) {
                            completeResponse += decoder.decode(value);
                            ({ done, value } = await reader.read());
                        }
                        setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: completeResponse }]);
                    };

                    readStream();
                } catch (error) {
                    console.error('Error sending transcript:', error);
                }
            }
        }
    };

    const handleToggleRecording = () => {
        if (!isMicEnabled) return;

        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    return (
        <>
            <Seo title={'Job Application'} />
            <Row className='mt-3'>
                <Col xl={9}>
                    <Form>
                        <Form.Group controlId='ClientDetails' className='mb-4'>
                            <Form.Label>Client</Form.Label>
                            <Form.Control type='text' value={client} onChange={handleClientChange} required />
                        </Form.Group>

                        <Form.Group controlId='JobDescription' className='mb-4'>
                            <Form.Label>Job Description or Tech Stack</Form.Label>
                            <Form.Control as='textarea' value={jobDescription} onChange={handleJobDescriptionChange} required />
                        </Form.Group>

                        <Form.Group controlId='formFile' className='mb-4'>
                            <Form.Label>Upload Resume</Form.Label>
                            <Form.Control type='file' accept='.pdf,.doc,.docx' onChange={handleResumeUpload} required />
                        </Form.Group>

                        <Button variant='primary' onClick={handleSubmit}>
                            Submit
                        </Button>
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </Form>

                    <Card className='mt-4'>
                        <Card.Body>
                            <Row className='d-flex align-items-center'>
                                <Col xl={1}>
                                    <Button
                                        onClick={handleToggleRecording}
                                        variant={isRecording ? 'outline-danger' : 'outline-success'}
                                        disabled={!isMicEnabled}
                                    >
                                        <i className='ri-mic-fill'></i>
                                    </Button>
                                </Col>
                                <Col xl={11}>
                                    {(isRecording || interimTranscript || finalTranscript) && (
                                        <div className='transcript-box'>
                                            <p>{finalTranscript + interimTranscript}</p>
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Card className='mt-4'>
                                        <Card.Body>
                                            <h5>Chat Conversation:</h5>
                                            {messages.map((message, index) => (
                                                <div key={index} className={`chat-message ${message.type}`}>
                                                    <p>{message.text}</p>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

Floatinglabels.layout = 'Contentlayout';

export default Floatinglabels;
