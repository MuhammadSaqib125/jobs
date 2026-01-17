"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditJob({ params }) {
  const router = useRouter();
  const { id } = use(params); // Next.js 15+ way to unwrap params
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Remote",
    experienceLevel: "Junior",
    description: "",
    applyUrl: "",
    companyLogo: ""
  });

  // 1. Fetch the existing job data when page loads
  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`/api/jobs?id=${id}`); // We'll need to tweak the GET API slightly for this to work perfectly by ID, but let's try this first
      // Actually, our current GET returns ALL jobs. Let's just fetch all and find the one we need for now (simplest way without changing API logic too much)
      // BETTER WAY: Let's quickly update the GET API in the next step to support fetching ONE job.
      // For now, let's assume we implement the single fetch logic below.
      
      const res2 = await fetch(`/api/jobs`); 
      const data = await res2.json();
      
      if (data.success) {
        const job = data.data.find(j => j._id === id);
        if (job) {
          setFormData(job);
        } else {
          alert("Job not found");
          router.push("/admin");
        }
      }
      setLoading(false);
    };

    fetchJob();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "PUT", // Use the new PUT method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      });

      if (res.ok) {
        alert("Job Updated!");
        router.push("/admin");
      } else {
        alert("Error updating job");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading job details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Job Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Company Name</label>
            <input name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Application Link</label>
            <input name="applyUrl" value={formData.applyUrl} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Job Description</label>
            <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            {loading ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
}