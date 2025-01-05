import clientPromise from "../../../utils/dbConnect";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Retrieve session token from cookies
    const sessionToken = req.cookies["next-auth.session-token"];

    // Fetch session document from MongoDB
    const session = await db.collection("sessions").findOne({
      sessionToken,
    });

    // Check if session is valid
    if (!session && new Date() > new Date(session.expires)) {
      console.log("Session expired or invalid.");
      res.status(401).json({ message: "Unauthorized" });
      return; // Stop execution
    }

    // Fetch the user associated with the session
    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    console.log("User Document:", user);  

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Stop execution
    }

    // Respond with the user's profile details
    res.status(200).json({
      message: "Session is valid",
      user: {
        name: user.name,
        email: user.email,
        education: user.education || "",
        professionalInfo: user.professionalInfo || {},
        resume: user.resume || null,
      },
    });
  } catch (err) {
    console.error("Error fetching profile details:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
