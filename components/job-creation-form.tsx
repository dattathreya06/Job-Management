"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon, Save, Send } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const jobSchema = z
  .object({
    title: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
    companyName: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name must be less than 100 characters"),
    location: z.string().min(1, "Location is required"),
    jobType: z.string().min(1, "Job type is required"),
    salaryFrom: z.string().min(1, "Minimum salary is required").regex(/^\d+$/, "Please enter a valid number"),
    salaryTo: z.string().min(1, "Maximum salary is required").regex(/^\d+$/, "Please enter a valid number"),
    description: z
      .string()
      .min(10, "Job description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters"),
    applicationDeadline: z.string().min(1, "Application deadline is required"),
  })
  .refine((data) => Number.parseInt(data.salaryTo) > Number.parseInt(data.salaryFrom), {
    message: "Maximum salary must be greater than minimum salary",
    path: ["salaryTo"],
  })

type JobFormData = z.infer<typeof jobSchema>

interface JobCreationFormProps {
  onJobCreated: (job: any) => void
}

export default function JobCreationForm({ onJobCreated }: JobCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const { toast } = useToast()

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      companyName: "",
      location: "",
      jobType: "",
      salaryFrom: "",
      salaryTo: "",
      description: "",
      applicationDeadline: "",
    },
  })

  const onSubmit = async (data: JobFormData, asDraft = false) => {
    setIsSubmitting(true)
    setIsDraft(asDraft)

    try {
      console.log("Submitting job data:", data)

      // Convert the date string to ISO format
      const deadlineDate = new Date(data.applicationDeadline)
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date format")
      }

      const jobData = {
        title: data.title,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salaryRange: `₹${data.salaryFrom}L - ₹${data.salaryTo}L`,
        description: data.description,
        applicationDeadline: deadlineDate.toISOString(),
        status: asDraft ? "draft" : "published",
      }

      console.log("Sending job data to API:", jobData)

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const newJob = await response.json()
      console.log("Job created successfully:", newJob)

      onJobCreated(newJob)
      form.reset()

      toast({
        title: "Success",
        description: asDraft ? "Job saved as draft successfully!" : "Job published successfully!",
      })
    } catch (error) {
      console.error("Error creating job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDraft(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Full Stack Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Amazon, Microsoft, Google" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Preferred Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="salaryFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary (in Lakhs)</FormLabel>
                <FormControl>
                  <Input placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaryTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary (in Lakhs)</FormLabel>
                <FormControl>
                  <Input placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" min={today} {...field} className="w-full" />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share a description to let the candidates know more about this job role"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit((data) => onSubmit(data, true))}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit((data) => onSubmit(data, false))}
            disabled={isSubmitting}
            className="flex-1 bg-[#00AAFF] hover:bg-[#0099EE]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting && !isDraft ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
