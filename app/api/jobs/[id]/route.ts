import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Fetching job with ID: ${params.id}`)

    const connection = await connectToDatabase()

    if (!connection) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { db } = connection

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(params.id) })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const formattedJob = {
      ...job,
      id: job._id.toString(),
      _id: undefined,
      createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
      applicationDeadline:
        job.applicationDeadline instanceof Date ? job.applicationDeadline.toISOString() : job.applicationDeadline,
    }

    return NextResponse.json(formattedJob)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Updating job with ID: ${params.id}`)

    const body = await request.json()
    const connection = await connectToDatabase()

    if (!connection) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { db } = connection

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Convert applicationDeadline to Date if it's a string
    if (updateData.applicationDeadline && typeof updateData.applicationDeadline === "string") {
      updateData.applicationDeadline = new Date(updateData.applicationDeadline)
    }

    const result = await db.collection("jobs").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const updatedJob = await db.collection("jobs").findOne({ _id: new ObjectId(params.id) })

    const formattedJob = {
      ...updatedJob,
      id: updatedJob?._id.toString(),
      _id: undefined,
      createdAt: updatedJob?.createdAt instanceof Date ? updatedJob.createdAt.toISOString() : updatedJob?.createdAt,
      applicationDeadline:
        updatedJob?.applicationDeadline instanceof Date
          ? updatedJob.applicationDeadline.toISOString()
          : updatedJob?.applicationDeadline,
    }

    return NextResponse.json(formattedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Deleting job with ID: ${params.id}`)

    const connection = await connectToDatabase()

    if (!connection) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { db } = connection

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
