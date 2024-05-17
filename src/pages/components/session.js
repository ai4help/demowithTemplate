import React, { useEffect, useState, useRef } from 'react'
import { Button, Card, Col, Collapse, FloatingLabel, Form, Row } from 'react-bootstrap'
import Seo from '../../../shared/layout-components/seo/seo'
import Pageheader from '../../../shared/layout-components/header/pageheader'

// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// Import necessary modules and components
// Import necessary modules and components

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
// declare global {
//   interface Window {
// let webkitSpeechRecognition= window.webkitSpeechRecognition;
//   }
// }
let finalVal;
const setTopic = async () => {
    // Call your API here
    // Example:
    const topics = {
        "client": document.getElementById('ClientDetails').value,
        "technologies": document.getElementById('TopicDetails').value,
        "conversation": finalVal
    }

    await fetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({ data: topics }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            response.json().then((data) => {
                if (data.includes("success")) {
                    document.getElementById('setTopicCard').style.border = '1px solid green'
                } else {
                    document.getElementById('setTopicCard').style.border = '1px solid red'
                }
            })
        })
        .catch(error => {
            console.error('Error:', error)
        })

}

function Floatinglabels() {
    // State variables to manage recording status, completion, and transcript
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [transcript, setTranscript, finalval] = useState("");
    let conv = ''
    // Reference to store the SpeechRecognition instance
    const recognitionRef = useRef(null);

    // Function to start recording
    const startRecording = () => {
        setIsRecording(true);
        // Create a new SpeechRecognition instance and configure it
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Event handler for speech recognition results
        recognitionRef.current.onresult = (event) => {
            const { transcript } = event.results[event.results.length - 1][0];
            conv = conv + ' ' + transcript
            // Log the recognition results and update the transcript state
            // console.log(event.results);
            setTranscript(transcript);
        };

        // Start the speech recognition
        recognitionRef.current.start();
    };

    // Cleanup effect when the component unmounts
    useEffect(() => {
        return () => {
            // Stop the speech recognition if it's active
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Function to stop recording
    const stopRecording = async () => {
        if (recognitionRef.current) {
            // Stop the speech recognition and mark recording as complete
            recognitionRef.current.stop();
            setRecordingComplete(true);
            console.log("transcript==" + transcript);
            finalVal = transcript;
            const transcriptValue = document.getElementById('transcript').innerText;
            await fetch('/api/conversation', {
                method: 'POST',
                body: JSON.stringify({ conversation: transcriptValue }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    response.json().then((data) => {
                        console.log('data', data)
                    })
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    // Toggle recording state and manage recording actions
    const handleToggleRecording = () => {
        console.log("isRecording==" + isRecording);
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    // Function to handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (file && allowedFormats.includes(file.type)) {
            // File is valid, perform upload logic
            const formData = new FormData();
            formData.append('file', file);

            await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log('File uploaded successfully');
                        // Show success message
                    } else {
                        console.log('File upload failed');
                        // Show error message
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Show error message
                });
        } else {
            // Invalid file format, show error
            console.log('Invalid file format');
        }
    };

    return (
        <>
            <Seo title={"FloatingLabels"} />
            <Row className='mt-3' >
                <Col xl={9}>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload Document</Form.Label>
                            <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                        </Form.Group>
                    </Form>
                    <Card className="custom-card " id='ConvCard' >
                        <Card.Body>

                            <Row className="flex items-center justify-center h-screen w-full">
                                <Col xl={1} className="">
                                    <div className="flex items-center w-full">
                                        {isRecording ? (
                                            // Button for stopping recording
                                            <Button onClick={handleToggleRecording} variant="outline-danger" className="btn btn-icon rounded-pill btn-wave">
                                                <i className="ri-mic-fill "></i>
                                            </Button>
                                        ) : (
                                            // Button for starting recording
                                            <Button onClick={handleToggleRecording} variant="outline-success" className="btn btn-icon  rounded-pill btn-wave">
                                                <i className="ri-mic-fill"></i>
                                            </Button>

                                        )}

                                    </div>
                                </Col>
                                <Col xl={11} className="">
                                    {(isRecording || transcript) && (
                                        <div className="w-1/4 m-auto rounded-md border bg-white">
                                            <div className="flex-1 flex w-full ">
                                                {isRecording && (
                                                    <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
                                                )}
                                            </div>
                                            {transcript && (
                                                <div className="border rounded-md p-2 h-fullm">
                                                    <p id='transcript' className="mb-0">{transcript}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card id='setTopicCard' className="custom-card ">
                        <Card.Body>
                            <Form.Floating className=" mb-4">
                                <Form.Control as="input" className="" placeholder="Client Name"
                                    id="ClientDetails"></Form.Control>
                                <label htmlFor="floatingTextarea">Client </label>
                            </Form.Floating>
                            <Form.Floating className=" mb-4">
                                <Form.Control as="textarea" className="" placeholder=""
                                    id="TopicDetails"></Form.Control>
                                <label htmlFor="floatingTextarea">Technologies for this session </label>
                            </Form.Floating>
                            <Button variant="outline-info" onClick={setTopic} className="float-end">Submit</Button>
                        </Card.Body>
                    </Card >
                </Col >
            </Row >

        </>
    )
}
Floatinglabels.layout = "Contentlayout"

export default Floatinglabels
