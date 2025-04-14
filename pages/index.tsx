import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
    id: number;
    email: string;
};

type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    description: string;
    createdAt: string;
    user: User; 
};

export default function Home() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        fetch('/api/jobs')
            .then((res) => res.json())
            .then((data) => setJobs(data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <nav className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Mini Job Board</h1>
                <Link href="/login" className="text-blue-500">Login</Link>
            </nav>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                        <p>{job.company} - {job.location}</p>
                        <p>{job.jobType}</p>
                        <p>{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}