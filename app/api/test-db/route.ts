import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI)
    console.log("MONGODB_URI preview:", process.env.MONGODB_URI?.substring(0, 20) + "...")

    const connection = await connectToDatabase()

    if (!connection) {
      return NextResponse.json({
        status: "error",
        message: "Failed to connect to MongoDB",
        mongoUri: !!process.env.MONGODB_URI ? "Present" : "Missing",
      })
    }

    const { db } = connection

    // Test database operations
    const collections = await db.listCollections().toArray()
    const jobsCount = await db.collection("jobs").countDocuments()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      collections: collections.map((c) => c.name),
      jobsCount,
      mongoUri: "Present",
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      mongoUri: !!process.env.MONGODB_URI ? "Present" : "Missing",
    })
  }
}
