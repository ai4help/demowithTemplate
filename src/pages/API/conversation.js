import axios from 'axios';

export default async function handler(req, res) {
    const url = 'http://localhost:8000/question'; // Django endpoint URL
    const { q } = req.body;  // Correctly extract 'q' from req.body

    console.log('Received question:', q);

    try {
        const response = await axios.post(url, { q }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let chunkString = '';

        const readChunk = async () => {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    res.end();
                    return;
                }
                chunkString += decoder.decode(value);
                res.write(`data: ${chunkString}\n\n`);
                readChunk();
            } catch (error) {
                res.status(500).send('error');
            }
        };

        readChunk();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
