import clientPromise from "../../utils/dbConnect";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        console.log('req.body',req.body)
        const {name,email, client, jobDescription,skills, professionalExperience } = req.body;
        const clientDB = await clientPromise;
        const db = clientDB.db();

        await db.collection("conv").insertOne({
            name,
            email,
            skills,
            client,
            jobDescription,
            professionalExperience,
            createdAt: new Date(),
        });

        res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to save data." });
    }
}
