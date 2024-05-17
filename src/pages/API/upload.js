export const dynamic = 'force-dynamic' // defaults to auto

export default async function handler(req, res) {
    const url = 'http://localhost:8000/upload-pdf'
    const FormData = req.body
    await fetch(url, {
        method: 'POST',
        body: ({ FormData }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('response', response.status)
            if (response.status === 200) {
                res.status(200).json('success');
            } else {
                res.status(500).json('error');
            }
        })
        .catch(error => {
            console.error('error', error);
            res.status(500).send('error');
            return 'error';
        })

}
