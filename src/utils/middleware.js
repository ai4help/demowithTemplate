import { NextResponse } from "next/server";
import clientPromise from "./utils/dbConnect";

export async function middleware(req) {
  const sessionID = req.headers.get("x-session-id");

  if (!sessionID) {
    return NextResponse.json({ message: "Unauthorized: Missing session ID" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const session = await db.collection("sessions").findOne({ _id: sessionID });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized: Invalid session" }, { status: 401 });
  }

  const now = new Date();
  const lastActive = new Date(session.lastActive);

  if (now - lastActive > 45 * 60 * 1000) {
    await db.collection("sessions").deleteOne({ _id: sessionID });
    return NextResponse.json({ message: "Session expired. Please log in again." }, { status: 401 });
  }

  await db.collection("sessions").updateOne(
    { _id: sessionID },
    { $set: { lastActive: now } }
  );

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Apply to all API routes
};
