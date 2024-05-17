export const dynamic = 'force-dynamic' // defaults to auto

export default async function handler(req, res) {
    const url = 'http://localhost:8000/question'
    const data = req.body
    console.log('data', data)
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'q': data }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            // Get the readable stream from the response body
            const stream = response.body;
            // Get the reader from the stream
            const reader = stream.getReader();
            let chunkString = '';
            // Define a function to read each chunk
            const readChunk = () => {
                // Read a chunk from the reader
                reader.read()
                    .then(({
                        value,
                        done
                    }) => {
                        // Check if the stream is done
                        if (done) {
                            // Log a message
                            console.log('Stream finished');
                            // Return from the function
                            return chunkString;
                        }
                        // Convert the chunk value to a string
                        chunkString = new TextDecoder().decode(value);
                        // Log the chunk string
                        console.log('chuck msg', chunkString);
                        res.status(200).json(chunkString);
                        // Read the next chunk
                        readChunk();
                    })
                    .catch(error => {
                        // Log the error
                        console.error(error);
                        // Return from the function
                        res.status(500).send('error');
                    });
            }
            // Start reading the first chunk
            readChunk()

        })
        .catch(error => {
            console.error(error);
            res.status(500).send('error');
            return 'error';
        })

}
