"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

// 1. UPDATED: Import the "New" Quill library fixed for React 19
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import 'react-quill-new/dist/quill.snow.css'; // Updated CSS path

export default function AddJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyLogo: "",
    location: "",
    jobType: "Remote",
    experienceLevel: "Junior",
    description: "",
    applyUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too big! Please use an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, companyLogo: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Job Posted Successfully!");
        router.push("/admin");
      } else {
        alert("Server Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Job Title</label>
            <input name="title" required onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Senior React Developer" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Company Name</label>
              <input name="company" required onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Google" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Company Logo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-1 border rounded text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input name="location" required onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. New York, USA" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Job Type</label>
              <select name="jobType" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Experience Level</label>
              <select name="experienceLevel" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Application Link</label>
            <input name="applyUrl" type="url" required onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://company.com/apply" />
          </div>

          {/* RICH TEXT EDITOR */}
          <div className="h-64 mb-12">
            <label className="block text-sm font-bold mb-1">Job Description</label>
            <ReactQuill 
              theme="snow" 
              value={formData.description} 
              onChange={handleDescriptionChange} 
              className="h-48" 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition mt-10">
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}