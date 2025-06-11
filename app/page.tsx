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
    } else {
      return `${diffInHours}h Ago`; // Capital "A"
    }
  };

  const formatJobDescription = (description: string) => {
    return description
      .split(".") // split only by full stops
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0)
      .slice(0, 3) // limit to first 3 items
      .map((sentence, index) => (
        <li key={index} className="text-xs text-gray-600 mb-1">
          {sentence}.
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
      {/* Header with 60% width navbar and 20% spacing on each side */}
      <header className="py-6 px-6 bg-gray-50">
        <div className="w-full flex justify-center">
          {/* Navbar with 60% width */}
          <div className="w-[65%] bg-white rounded-[4rem] shadow-sm border border-gray-100 flex items-center justify-between px-8 py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center">
                {/* <span className="text-white font-bold text-lg">CM</span> */}
                <img
                  src="/cyberminds_logo.png" // ✅ Update this path to your actual logo
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Desktop Navigation - Centered with proper spacing */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center mx-12">
              <a
                href="#"
                className="text-[#303030] hover:text-black font-medium text-sm"
              >
                Home
              </a>
              <a
                href="#"
                className="text-[#303030] hover:text-black font-medium text-sm"
              >
                Find Jobs
              </a>
              <a
                href="#"
                className="text-[#303030] hover:text-black font-medium text-sm"
              >
                Find Talents
              </a>
              <a
                href="#"
                className="text-[#303030] hover:text-black font-medium text-sm"
              >
                About us
              </a>
              <a
                href="#"
                className="text-[#303030] hover:text-black font-medium text-sm"
              >
                Testimonials
              </a>
            </nav>

            {/* Desktop Create Jobs Button */}
            <div className="hidden md:block">
              <Button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-[#A128FF] to-[#6100AD] hover:from-[#9020EE] hover:to-[#5000A0] text-white px-6 py-2.5 rounded-[4rem] font-medium text-sm shadow-lg"
              >
                {/* <Plus className="h-4 w-4 mr-2" /> */}
                Create Jobs
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <a
                      href="#"
                      className="text-gray-700 hover:text-gray-900 font-medium block py-2"
                    >
                      Home
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-gray-900 font-medium block py-2"
                    >
                      Find Jobs
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-gray-900 font-medium block py-2"
                    >
                      Find Talents
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-gray-900 font-medium block py-2"
                    >
                      About us
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-gray-900 font-medium block py-2"
                    >
                      Testimonials
                    </a>
                    <div className="pt-4 border-t">
                      <Button
                        onClick={openCreateModal}
                        className="w-full bg-gradient-to-r from-[#A128FF] to-[#6100AD] hover:from-[#9020EE] hover:to-[#5000A0] text-white rounded-xl"
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
              <DialogContent className="max-w-[848px] max-h-[779px] overflow-y-auto rounded-[16px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Create Job Opening
                  </DialogTitle>
                </DialogHeader>
                <JobCreationForm onJobCreated={handleJobCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full px-4 sm:px-6 py-4 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
            <div className="flex flex-col lg:flex-row items-stretch justify-between w-full gap-4">
              {/* Search Input */}
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search By Job Title, Role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none shadow-none px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-full"
                />
              </div>

              {/* Divider */}
              <div className="hidden lg:block h-6 border-l border-gray-200"></div>

              {/* Location Filter */}
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="border-none shadow-none focus:ring-0 focus:ring-offset-0 p-0 text-sm w-full">
                    <SelectValue placeholder="Preferred Location" />
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

              {/* Divider */}
              <div className="hidden lg:block h-6 border-l border-gray-200"></div>

              {/* Job Type Filter */}
              <div className="flex items-center gap-2 flex-1">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <Select
                  value={selectedJobType}
                  onValueChange={setSelectedJobType}
                >
                  <SelectTrigger className="border-none shadow-none focus:ring-0 focus:ring-offset-0 p-0 text-sm w-full">
                    <SelectValue placeholder="Job type" />
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

              {/* Divider */}
              <div className="hidden lg:block h-6 border-l border-gray-200"></div>

              {/* Salary Range */}
              <div className="flex flex-col flex-1">
                {/* <span className="text-xs font-medium text-gray-500 mb-1 hidden sm:block">
                  Salary Per Month
                </span> */}
                <EnhancedRangeSlider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={30}
                  max={200}
                  step={10}
                  formatLabel={(val) => `₹${val}k`}
                />
                {/* <div className="text-sm text-gray-700 mt-1 hidden sm:block">
                  ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
                </div> */}
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
                className="w-full sm:w-[300px] h-auto rounded-[12px] hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          getCompanyLogo(job.companyName) || "/placeholder.svg"
                        }
                        alt={`${job.companyName} logo`}
                        className="w-14 h-14 object-contain"
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
                      className="bg-[#B0D9FF] text-[#000000] text-xs whitespace-nowrap ml-2 rounded-[10px] h-[33px] w-[75px]"
                    >
                      {getTimeAgo(job.createdAt)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                      {job.title}
                    </h3>
                    {/* Horizontal Job Details */}
                    <div className="flex items-center gap-1 text-base text-gray-600 py-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>1-3 yr Exp</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        {/* <span className="truncate">{job.location}</span> */}
                        <span className="truncate">On-site</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 flex-shrink-0" />
                        {/* <span className="truncate">{job.salaryRange}</span> */}
                        <span className="truncate">
                          {job.salaryRange.split("-")[0].trim()}PA
                        </span>
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
                <CardFooter className="">
                  <Button className="w-full h-[46px] rounded-[10px] border border-solid border-gray-300 px-[10px] py-[12px] gap-[10px] bg-[#00AAFF] hover:bg-[#0099EE] text-white">
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
