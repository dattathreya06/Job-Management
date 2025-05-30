import { MongoClient, type Db } from "mongodb"

// Check if MongoDB URI is available
const uri = process.env.MONGODB_URI || ""

// Log the URI for debugging (first few characters only)
console.log("MongoDB URI available:", !!uri)
if (uri) {
  console.log("MongoDB URI preview:", uri.substring(0, 15) + "...")
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    if (uri) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    } else {
      globalWithMongo._mongoClientPromise = Promise.reject(new Error("No MongoDB URI provided"))
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  if (uri) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  } else {
    clientPromise = Promise.reject(new Error("No MongoDB URI provided"))
  }
}

export default clientPromise

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db } | null> {
  try {
    if (!uri) {
      console.error("MongoDB URI is not provided")
      return null
    }

    const client = await clientPromise
    const db = client.db("jobmanagement")

    // Test the connection
    await db.admin().ping()
    console.log("MongoDB connected successfully")

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    return null
  }
}

// Simplified database initialization without strict schema validation
export async function initializeDatabase() {
  try {
    const connection = await connectToDatabase()
    if (!connection) return

    const { db } = connection

    // Create jobs collection if it doesn't exist
    const collections = await db.listCollections({ name: "jobs" }).toArray()

    if (collections.length === 0) {
      await db.createCollection("jobs")

      // Create basic indexes for better performance
      await db
        .collection("jobs")
        .createIndexes([
          { key: { title: "text", companyName: "text", description: "text" } },
          { key: { location: 1 } },
          { key: { jobType: 1 } },
          { key: { status: 1 } },
          { key: { createdAt: -1 } },
        ])

      console.log("Database initialized successfully")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}
