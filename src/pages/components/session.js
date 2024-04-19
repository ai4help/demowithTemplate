import React, { useEffect, useState, useRef } from 'react'
import { Button, Card, Col, Collapse, FloatingLabel, Form, Row } from 'react-bootstrap'
import Seo from '../../../shared/layout-components/seo/seo'
import Pageheader from '../../../shared/layout-components/header/pageheader'

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// Import necessary modules and components
const setTopic = async () => {
    // Call your API here
    // Example:
    await fetch('', {
        method: 'POST',
        body: JSON.stringify({ data: 'your data' }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
};

const Floatinglabels = () => {
    const [open4] = useState(false);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const startListening = () => {
        setIsRecording(true)
        setTranscript("Start speaking")
    }

    const stopListening = () => {
        setIsRecording(!isRecording)
        SpeechRecognition.stopListening()
    }
    return (
        <>
            <Seo title={"FloatingLabels"} />
            <Row className='mt-3' >
                <Col xl={9}>
                    <Card className="custom-card " >
                        <Card.Body>
                            {isRecording || transcript && (
                                <Row className='mt-3'>
                                    <Col xl={1}>
                                        <Button variant="success" onClick={SpeechRecognition.startListening} className="btn btn-icon rounded-pill btn-xxl  btn-wave">
                                            <i className="ri-mic-fill"></i>
                                        </Button>
                                        <Button variant="danger" onClick={SpeechRecognition.stopListening} className="btn btn-icon rounded-pill btn-xxl  btn-wave">
                                            <i className="ri-mic-fill "></i>
                                        </Button>
                                    </Col>
                                    <Col xl={11}>
                                        <p className='lead mt-0'>{transcript}</p>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className=" custom-card">
                        <Card.Body>
                            <Form.Floating className=" mb-4">
                                <Form.Control as="textarea" className="" placeholder="Leave a comment here"
                                    id="floatingTextarea"></Form.Control>
                                <label htmlFor="floatingTextarea">Save Topics </label>
                            </Form.Floating>
                            <Collapse in={open4} className=""><pre><code>{`
 <FloatingLabel
 controlId="floatingInput"
 label="Email address"
 className="mb-3">
 <Form.Control type="email" placeholder="name@example.com" />
</FloatingLabel>
<FloatingLabel controlId="floatingPassword" label="Password">
 <Form.Control type="password" placeholder="Password" />
</FloatingLabel>`}</code></pre></Collapse>
                            <Button variant="outline-info" onClick={setTopic} className="float-end">Submit</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >

        </>
    )
}
Floatinglabels.layout = "Contentlayout"

export default Floatinglabels
