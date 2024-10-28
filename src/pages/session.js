import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import Seo from '../../shared/layout-components/seo/seo';

const Floatinglabels = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [messages, setMessages] = useState([]);
    const recognitionRef = useRef(null);

    const setTopic = async () => {
        const topics = {
            client: document.getElementById('ClientDetails').value,
            jobDescription: document.getElementById('JobDescription').value,
            conversation: finalTranscript,
        };

        await fetch('/api/topic', {
            method: 'POST',
            body: JSON.stringify({ topic: topics.jobDescription }), // Adjusted to match the backend expectation
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('data: : :', data);
                if (data.message === 'success') {  // Changed from data.msg to data.message
                    document.getElementById('setTopicCard').style.border = '1px solid green';
                } else {
                    document.getElementById('setTopicCard').style.border = '1px solid red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('setTopicCard').style.border = '1px solid red';
            });
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

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const stopRecording = async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setRecordingComplete(true);
            const transcript = finalTranscript;
            setMessages((prevMessages) => [...prevMessages, { type: 'user', text: transcript }]);
            setInterimTranscript('');
            setFinalTranscript('');
            console.log('Final Transcript after stopping:', transcript);
            const data = { q: transcript };
            console.log('data:', data);
            // Send the final transcript to the Next.js API endpoint
            try {
                const response = await fetch('/api/conversation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    const readStream = async () => {
                        let { done, value } = await reader.read();
                        let completeResponse = '';
                        while (!done) {
                            const chunk = decoder.decode(value);
                            completeResponse += chunk;
                            ({ done, value } = await reader.read());
                        }
                        setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: completeResponse }]);
                    };

                    readStream();
                } else {
                    console.log('Failed to send transcript');
                }
            } catch (error) {
                console.error('Error sending transcript:', error);
            }
        }
    };

    const handleToggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const allowedFormats = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (file && allowedFormats.includes(file.type)) {
            const formData = new FormData();
            formData.append('file', file);

            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('File uploaded successfully');
                    } else {
                        console.log('File upload failed');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            console.log('Invalid file format');
        }
    };

    return (
        <>
            <Seo title={'FloatingLabels'} />
            <Row className='mt-3'>
                <Col xl={9}>
                    <Form>
                        <Form.Group controlId='formFile' className='mb-3'>
                            <Form.Label>Upload Document</Form.Label>
                            <Form.Control type='file' accept='.pdf,.doc,.docx' onChange={handleFileUpload} />
                        </Form.Group>
                    </Form>
                    <Card className='custom-card ' id='ConvCard'>
                        <Card.Body>
                            <Row className='flex items-center justify-center h-screen w-full'>
                                <Col xl={1} className=''>
                                    <div className='flex items-center w-full'>
                                        {isRecording ? (
                                            <Button
                                                onClick={handleToggleRecording}
                                                variant='outline-danger'
                                                className='btn btn-icon rounded-pill btn-wave'
                                            >
                                                <i className='ri-mic-fill '></i>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleToggleRecording}
                                                variant='outline-success'
                                                className='btn btn-icon  rounded-pill btn-wave'
                                            >
                                                <i className='ri-mic-fill'></i>
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                                <Col xl={11} className=''>
                                    {(isRecording || interimTranscript || finalTranscript) && (
                                        <div className='w-1/4 m-auto rounded-md border bg-white'>
                                            <div className='flex-1 flex w-full '>
                                                {isRecording && (
                                                    <div className='rounded-full w-4 h-4 bg-red-400 animate-pulse' />
                                                )}
                                            </div>
                                            {(interimTranscript || finalTranscript) && (
                                                <div className='border rounded-md p-2 h-fullm'>
                                                    <p id='transcript' className='mb-0'>
                                                        {finalTranscript + interimTranscript}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card className='mt-3'>
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
                <Col xl={3}>
                    <Card id='setTopicCard' className='custom-card '>
                        <Card.Body>
                            <Form.Floating className=' mb-4'>
                                <Form.Control as='input' className='' placeholder='Client Name' id='ClientDetails' />
                                <label htmlFor='floatingTextarea'>Client </label>
                            </Form.Floating>
                            <Form.Floating className=' mb-4'>
                                <Form.Control as='textarea' className='' placeholder='' id='JobDescription' style={{ height: '200px' }} />
                                <label htmlFor='floatingTextarea'>Job Description or Tech Stack</label>
                            </Form.Floating>
                            <Button variant='outline-info' onClick={setTopic} className='float-end'>
                                Submit
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

Floatinglabels.layout = 'Contentlayout';

export default Floatinglabels;
