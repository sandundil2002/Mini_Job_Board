import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    description: string;
};

export default function Admin() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) router.push('/login');

        fetch('/api/jobs')
            .then((res) => res.json())
            .then((data) => setJobs(data));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('/api/jobs/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, company, location, jobType, description }),
        });
        if (res.ok) {
            const newJob = await res.json();
            setJobs([...jobs, newJob]);
        }
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/jobs/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            setJobs(jobs.filter((job) => job.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Job Type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Add Job
                </button>
            </form>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-4 rounded shadow flex justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{job.title}</h2>
                            <p>{job.company} - {job.location}</p>
                            <p>{job.jobType}</p>
                            <p>{job.description}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(job.id)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}