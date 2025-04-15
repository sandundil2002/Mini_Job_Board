import { useEffect, useState } from 'react';
import Link from 'next/link';
import {Search, MapPin, Briefcase, Calendar} from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/jobs')
            .then((res) => res.json())
            .then((data) => {
                setJobs(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                setIsLoading(false);
            });
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || job.jobType === filter;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900">JobBoard</h1>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Beta
              </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/auth"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Find Your Dream Job Today
                    </h2>
                    <p className="mt-4 text-xl text-blue-100">
                        Browse thousands of job listings from top companies
                    </p>

                    <div className="mt-8 flex rounded-md shadow-sm">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-white" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="focus:ring-blue-500 text-white focus:border-blue-500 block w-full pl-10 py-4 sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Search jobs by title, company, or keyword"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === 'all'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        All Jobs
                    </button>
                    <button
                        onClick={() => setFilter('Full-time')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === 'Full-time'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Full-time
                    </button>
                    <button
                        onClick={() => setFilter('Part-time')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === 'Part-time'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Part-time
                    </button>
                    <button
                        onClick={() => setFilter('Contract')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === 'Contract'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Contract
                    </button>
                    <button
                        onClick={() => setFilter('Remote')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                            filter === 'Remote'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Remote
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-pulse text-center">
                            <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 capitalize">{job.title}</h2>
                                    <p className="text-lg text-gray-600 mt-1 capitalize">{job.company}</p>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <div className="flex items-center text-gray-500 text-sm capitalize">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm capitalize">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        {job.jobType}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formatDate(job.createdAt)}
                                    </div>
                                </div>

                                <p className="mt-4 text-gray-600">
                                    {truncateText(job.description, 200)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">JobBoard</h3>
                            <p className="text-gray-300">
                                Connecting talented professionals with amazing opportunities.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-white">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-white">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-white">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
                            <p className="text-gray-300 mb-4">
                                Get the latest job updates delivered to your inbox.
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}