"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Jobs when the page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Function to Delete a Job
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/jobs?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the job from the screen without refreshing
        setJobs(jobs.filter((job) => job._id !== id));
        alert("Job deleted.");
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("Error deleting job.");
    }
  };

  if (loading) return <div className="p-10">Loading jobs...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link 
            href="/admin/add" 
            className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700"
          >
            + Post New Job
          </Link>
        </div>

        {/* Job Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 font-bold text-gray-700">Job Title</th>
                <th className="p-4 font-bold text-gray-700">Company</th>
                <th className="p-4 font-bold text-gray-700">Date Posted</th>
                <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No jobs found. Click "Post New Job" to add one.
                  </td>
                </tr>
          
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{job.title}</td>
                    <td className="p-4 text-gray-600">{job.company}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        href={`/admin/edit/${job._id}`}
                        className="text-blue-500 hover:text-blue-700 font-bold text-sm mr-4"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(job._id)} 
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                      >
                        Delete
                      </button>
                      <LogoutButton />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}