// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const dynamic = 'force-dynamic' // defaults to auto

export default function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })
}
