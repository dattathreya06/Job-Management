"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users,
  Briefcase,
  DollarSign,
  Building,
  Plus,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import JobCreationForm from "@/components/job-creation-form";
import { EnhancedRangeSlider } from "@/components/enhanced-range-slider";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
  applicationDeadline: string;
  status: string;
  createdAt: string;
}

export default function JobManagementInterface() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  // Changed to k format: 50k-150k range
  const [salaryRange, setSalaryRange] = useState([50, 150]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs when filters change
  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedLocation, selectedJobType, salaryRange]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    if (selectedJobType && selectedJobType !== "all") {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
    }

    // Filter by salary range - convert k to L format for comparison
    // salaryRange is in k (50k-150k), job salaryRange is in L (5L-15L)
    filtered = filtered.filter((job) => {
      const salaryMatch = job.salaryRange.match(/₹(\d+)L/);
      if (salaryMatch) {
        const jobSalaryInL = Number.parseInt(salaryMatch[1]);
        const jobSalaryInK = jobSalaryInL * 10; // Convert L to k (5L = 50k)

        // Check if job salary falls within the selected range
        return jobSalaryInK >= salaryRange[0] && jobSalaryInK <= salaryRange[1];
      }
      return true;
    });

    setFilteredJobs(filtered);
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setIsCreateModalOpen(false);
    toast({
      title: "Success",
      description: "Job created successfully!",
    });
  };

  const getCompanyLogo = (companyName: string) => {
    const logos: { [key: string]: string } = {
      Amazon: "https://logo.clearbit.com/amazon.com",
      Google: "https://logo.clearbit.com/google.com",
      Microsoft: "https://logo.clearbit.com/microsoft.com",
      Apple: "https://logo.clearbit.com/apple.com",
      Meta: "https://logo.clearbit.com/meta.com",
      Netflix: "https://logo.clearbit.com/netflix.com",
      Tesla: "https://logo.clearbit.com/tesla.com",
      Spotify: "https://logo.clearbit.com/spotify.com",
      Uber: "https://logo.clearbit.com/uber.com",
      Airbnb: "https://logo.clearbit.com/airbnb.com",
      Swiggy: "https://logo.clearbit.com/swiggy.com",
      Zomato: "https://logo.clearbit.com/zomato.com",
      Flipkart: "https://logo.clearbit.com/flipkart.com",
      Paytm: "https://logo.clearbit.com/paytm.com",
    };
    return (
      logos[companyName] ||
      "https://via.placeholder.com/48x48/6366f1/ffffff?text=" +
        companyName.charAt(0)
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatJobDescription = (description: string) => {
    // Split description into sentences and create bullet points
    const sentences = description
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    return sentences.slice(0, 3).map((sentence, index) => (
      <li key={index} className="text-xs text-gray-600 mb-1">
        {sentence.trim()}
      </li>
    ));
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const NavItems = () => (
    <>
      <a
        href="#"
        className="text-gray-700 hover:text-gray-900 font-medium block py-2 md:py-0"
      >
        Home
      </a>
      <a
        href="#"
        className="text-gray-700 hover:text-gray-900 font-medium block py-2 md:py-0"
      >
        Find Jobs
      </a>
      <a
        href="#"
        className="text-gray-700 hover:text-gray-900 font-medium block py-2 md:py-0"
      >
        Find Talents
      </a>
      <a
        href="#"
        className="text-gray-700 hover:text-gray-900 font-medium block py-2 md:py-0"
      >
        About us
      </a>
      <a
        href="#"
        className="text-gray-700 hover:text-gray-900 font-medium block py-2 md:py-0"
      >
        Testimonials
      </a>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavItems />
            </nav>

            {/* Desktop Create Jobs Button */}
            <div className="hidden md:block">
              <Button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-[#A128FF] to-[#6100AD] hover:from-[#9020EE] hover:to-[#5000A0] text-white px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Jobs
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <NavItems />
                    <div className="pt-4 border-t">
                      <Button
                        onClick={openCreateModal}
                        className="w-full bg-gradient-to-r from-[#A128FF] to-[#6100AD] hover:from-[#9020EE] hover:to-[#5000A0] text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Jobs
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Modal dialog */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Job Opening</DialogTitle>
                </DialogHeader>
                <JobCreationForm onJobCreated={handleJobCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search By Job Title, Role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
              {/* Location Filter */}
              <div className="min-w-[180px]">
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Filter */}
              <div className="min-w-[140px]">
                <Select
                  value={selectedJobType}
                  onValueChange={setSelectedJobType}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Job type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range Filter - Now in k format */}
              <div className="min-w-[220px]">
                <EnhancedRangeSlider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={30}
                  max={200}
                  step={10}
                  formatLabel={(val) => `₹${val}k`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or create a new job posting.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          getCompanyLogo(job.companyName) || "/placeholder.svg"
                        }
                        alt={`${job.companyName} logo`}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/32x32/6366f1/ffffff?text=${job.companyName.charAt(
                            0
                          )}`;
                        }}
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 text-xs whitespace-nowrap ml-2"
                    >
                      {getTimeAgo(job.createdAt)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {job.companyName}
                    </p>

                    {/* Horizontal Job Details */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 flex-shrink-0" />
                        <span>2+ yr Exp</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{job.salaryRange}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1">
                  <div className="text-sm text-gray-600">
                    <ul className="list-disc list-inside space-y-1">
                      {formatJobDescription(job.description)}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button className="w-full bg-[#00AAFF] hover:bg-[#0099EE] text-white">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
