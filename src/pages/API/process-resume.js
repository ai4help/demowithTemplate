import formidable from "formidable";
import clientPromise from "../../utils/dbConnect";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import OpenAI from "openai";
import mammoth from "mammoth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing
    },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const client = await clientPromise;
    const db = client.db();
    const sessionToken = req.cookies["next-auth.session-token"];
    const session = await db.collection("sessions").findOne({ sessionToken });

    if (!session || new Date() > new Date(session.expires)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const form = formidable({
        multiples: false, // Allow single file upload
        maxFileSize: MAX_FILE_SIZE,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable error while parsing file:", err);
            return res.status(400).json({ message: "Failed to parse the uploaded file." });
        }
    
        const resumeFile = files.resume[0];
      if (!resumeFile) {
        return res.status(400).json({ message: "No file provided." });
      }
      if (!resumeFile.filepath) {
        console.error("File path is undefined.");
        return res.status(400).json({ message: "Invalid file path." });
      }
    
        // Use fallback logic for file name
        const fileName = resumeFile.originalFilename || resumeFile.newFilename || "unknown";
        const fileExtension = fileName.includes(".")
            ? fileName.split(".").pop().toLowerCase()
            : null;
    
    
        if (!fileExtension || !["pdf", "doc", "docx"].includes(fileExtension)) {
            return res.status(400).json({ message: "Invalid file type. Please upload a valid PDF or Word document." });
        }
    
        try {
            let fileContent = "";
    
            if (fileExtension === "pdf") {
                const fileBuffer = await fs.readFile(resumeFile.filepath);
                const pdfData = await pdfParse(fileBuffer);
                fileContent = pdfData.text;
            } else if (fileExtension === "docx") {
                const fileBuffer = await fs.readFile(resumeFile.filepath);
                const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
                fileContent = value;
            } else {
                return res
                    .status(400)
                    .json({ message: "Unsupported file format. Please upload PDF or Word files." });
            }
    
            // OpenAI API Call
            const prompt = `
            Extract the all the information from the provided resume, so that it can be stored in a structured format to be used for further processing. also get all the detailed responsibilities and technologies used in the projects.:
            1. Your only purpose is to understand the ${fileContent} and find the related information regarding Education of the candidate and Work Experience of the candidate and  skills,CORE COMPETENCIES, technologies.
                            2. If you find create separate dict for each section in the following format.
            {
                "name": "<Name>",
                "email": "<Email>",
                "skills": ["<Skill1>", "<Skill2>", "<Skill3>"],
                "professional_experience": [
                    {
                        "client": "<Client Name>",
                        "responsibilities": "<Responsibilities>"
                    }
                ]
            }
            Resume:
            ${fileContent}
            Return only a valid JSON object with no additional text, comments, or explanations.`;
        
    
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-2024-04-09",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
            });
     // Log and parse the response

            const structuredData = JSON.parse(response.choices[0].message.content);
            res.status(200).json({ structuredData });
        } catch (error) {
            console.error("Error processing file:", error);
            res.status(500).json({ message: "Failed to process resume." });
        }
    });
    
}
