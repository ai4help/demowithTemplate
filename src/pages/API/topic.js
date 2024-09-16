import axios from '../../../public/assets/libs/axios';
//import { getSessionId } from '../../../public/assets/libs/session';

export default async function handler(req, res) {
    const url = 'http://localhost:8000/topic'; // Django endpoint URL for setting topic
    const { topic } = req.body;
    //const sessionId = getSessionId();
    //console.log('topic sessionId: ', sessionId);
    try {
        const response = await axios.post(url, { topic }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        if (response.data.message === 'success') {
            res.status(200).json({ message: 'success' });
        } else {
            res.status(500).json({ message: 'failed' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
