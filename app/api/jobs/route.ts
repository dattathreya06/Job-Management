import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, initializeDatabase } from "@/lib/mongodb"

// Sample fallback data
const fallbackJobs = [
  {
    id: "sample-1",
    title: "Full Stack Developer",
    companyName: "Amazon",
    location: "Bangalore",
    jobType: "Full-time",
    salaryRange: "₹70L - ₹90L",
    description:
      "A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized itineraries.",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-2",
    title: "Node.js Developer",
    companyName: "Google",
    location: "Mumbai",
    jobType: "Full-time",
    salaryRange: "₹60L - ₹80L",
    description:
      "Join our backend team to build scalable APIs and microservices. Work with cutting-edge technologies and contribute to products used by millions.",
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-3",
    title: "UX/UI Designer",
    companyName: "Microsoft",
    location: "Delhi",
    jobType: "Full-time",
    salaryRange: "₹55L - ₹75L",
    description:
      "Create intuitive and beautiful user experiences for our enterprise software products. Collaborate with product managers and engineers.",
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-4",
    title: "Frontend Developer",
    companyName: "Meta",
    location: "Pune",
    jobType: "Contract",
    salaryRange: "₹50L - ₹70L",
    description:
      "Build responsive and interactive user interfaces using React and modern frontend technologies. Focus on performance and user experience.",
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Initialize database on first load
initializeDatabase()

export async function GET() {
  try {
    console.log("Attempting to fetch jobs from database...")

    const connection = await connectToDatabase()

    if (!connection) {
      console.log("MongoDB not available, using fallback data")
      return NextResponse.json(fallbackJobs)
    }

    const { db } = connection
    const jobs = await db.collection("jobs").find({ status: "published" }).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${jobs.length} jobs in database`)

    // Convert MongoDB _id to string id for frontend
    const formattedJobs = jobs.map((job) => ({
      ...job,
      id: job._id.toString(),
      _id: undefined,
      createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
      applicationDeadline:
        job.applicationDeadline instanceof Date ? job.applicationDeadline.toISOString() : job.applicationDeadline,
    }))

    // If no jobs in database, return fallback data
    if (formattedJobs.length === 0) {
      console.log("No jobs found in database, returning fallback data")
      return NextResponse.json(fallbackJobs)
    }

    return NextResponse.json(formattedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)

    // Return fallback data on any error
    return NextResponse.json(fallbackJobs)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Attempting to create new job...")

    const body = await request.json()
    console.log("Received job data:", body)

    // Validate required fields
    const requiredFields = [
      "title",
      "companyName",
      "location",
      "jobType",
      "salaryRange",
      "description",
      "applicationDeadline",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`)
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const connection = await connectToDatabase()

    if (!connection) {
      console.error("MongoDB not available for job creation")
      // Create a mock job for demonstration
      const mockJob = {
        id: `mock-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      console.log("Created mock job:", mockJob)
      return NextResponse.json(mockJob, { status: 201 })
    }

    const { db } = connection

    const newJob = {
      title: body.title,
      companyName: body.companyName,
      location: body.location,
      jobType: body.jobType,
      salaryRange: body.salaryRange,
      description: body.description,
      applicationDeadline: new Date(body.applicationDeadline),
      status: body.status || "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Inserting job into database:", newJob)
    const result = await db.collection("jobs").insertOne(newJob)
    console.log("Job inserted with ID:", result.insertedId)

    const createdJob = {
      ...newJob,
      id: result.insertedId.toString(),
      _id: undefined,
      createdAt: newJob.createdAt.toISOString(),
      updatedAt: newJob.updatedAt.toISOString(),
      applicationDeadline: newJob.applicationDeadline.toISOString(),
    }

    console.log("Job created successfully:", createdJob)
    return NextResponse.json(createdJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)

    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to create job",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
