import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    PlusCircle,
    Trash2,
    LogOut,
    Search,
    Filter,
    Briefcase,
    MapPin,
    Clock,
    AlertCircle,
    X,
    Check
} from 'lucide-react';

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
    createdAt?: string;
    user: User;
};

export default function Admin() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('Full-time');
    const [description, setDescription] = useState('');

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchJobs();
    }, [router]);

    useEffect(() => {
        if (!jobs.length) return;

        let results = [...jobs];

        if (searchTerm) {
            results = results.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeFilter !== 'all') {
            results = results.filter(job => job.jobType === activeFilter);
        }

        setFilteredJobs(results);
    }, [searchTerm, activeFilter, jobs]);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs');
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobs(data);
            setFilteredJobs(data);
        } catch (error) {
            showNotification('Failed to load jobs. Please try again.', 'error');
            console.error('Error fetching jobs:', error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCompany('');
        setLocation('');
        setJobType('Full-time');
        setDescription('');
    };

    const openForm = () => {
        setIsFormOpen(true);
        resetForm();
    };

    const closeForm = () => {
        setIsFormOpen(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Authentication error. Please login again.', 'error');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('/api/jobs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, company, location, jobType, description }),
            });

            if (!res.ok) throw new Error('Failed to create job');

            const newJob = await res.json();
            setJobs([...jobs, newJob]);
            showNotification('Job added successfully!', 'success');
            closeForm();
        } catch (error) {
            console.error('Error submitting job:', error);
            showNotification('Failed to add job. Please try again.', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Authentication error. Please login again.', 'error');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`/api/jobs/delete/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to delete job');

            setJobs(jobs.filter((job) => job.id !== id));
            showNotification('Job deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting job:', error);
            showNotification('Failed to delete job. Please try again.', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 5000);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="shadow bg-blue-600 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-white cursor-pointer"
                        >
                            <LogOut className="h-5 w-5 mr-1" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block capitalize w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <button
                                onClick={() => {
                                    const menu = document.getElementById('filterMenu');
                                    if (menu) menu.classList.toggle('hidden');
                                }}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
                            >
                                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                                <span>Filter</span>
                            </button>
                            <div
                                id="filterMenu"
                                className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            >
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`block px-4 py-2 text-sm w-full text-left ${
                                            activeFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        All Jobs
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('Full-time')}
                                        className={`block px-4 py-2 text-sm w-full text-left ${
                                            activeFilter === 'Full-time' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        Full-time
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('Part-time')}
                                        className={`block px-4 py-2 text-sm w-full text-left ${
                                            activeFilter === 'Part-time' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        Part-time
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('Contract')}
                                        className={`block px-4 py-2 text-sm w-full text-left ${
                                            activeFilter === 'Contract' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        Contract
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('Remote')}
                                        className={`block px-4 py-2 text-sm w-full text-left ${
                                            activeFilter === 'Remote' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        Remote
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={openForm}
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            <span>Add Job</span>
                        </button>
                    </div>
                </div>

                {activeFilter !== 'all' && (
                    <div className="mb-4 flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Filtered by:</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
              {activeFilter}
                            <button
                                onClick={() => setActiveFilter('all')}
                                className="ml-1 text-blue-700 hover:text-blue-900"
                            >
                <X className="h-3 w-3" />
              </button>
            </span>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || activeFilter !== 'all'
                                ? "No jobs match your current filters. Try adjusting your search criteria."
                                : "You haven't created any jobs yet. Click the 'Add Job' button to get started."}
                        </p>
                        <button
                            onClick={openForm}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            <span>Add Your First Job</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-900 capitalize">{job.title}</h2>
                                        <div className="mt-2 flex items-center text-gray-600 capitalize">
                                            <Briefcase className="h-4 w-4 mr-1" />
                                            <span>{job.company}</span>
                                            <span className="mx-2">•</span>
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2 capitalize">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {job.jobType}
                      </span>
                                            {job.createdAt && (
                                                <span className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Posted: {formatDate(job.createdAt)}
                        </span>
                                            )}
                                        </div>
                                        <div className="mt-4 capitalize">
                                            <p className="text-gray-600 line-clamp-2">
                                                {job.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex self-end md:self-start">
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isFormOpen && (
                    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeForm}></div>
                        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 my-8">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Add New Job Listing</h3>
                                    <button
                                        onClick={closeForm}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Job Title *
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            placeholder="e.g. Front-End Developer"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="mt-1 capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                            Company *
                                        </label>
                                        <input
                                            id="company"
                                            type="text"
                                            placeholder="e.g. Tech Solutions Inc."
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="mt-1 capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Location *
                                        </label>
                                        <input
                                            id="location"
                                            type="text"
                                            placeholder="e.g. San Francisco, CA or Remote"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="mt-1 capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                                            Job Type *
                                        </label>
                                        <select
                                            id="jobType"
                                            value={jobType}
                                            onChange={(e) => setJobType(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            placeholder="Describe the job role, responsibilities, requirements, etc."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={6}
                                            className="mt-1 capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {notification.show && (
                    <div
                        className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center ${
                            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {notification.type === 'success' ? (
                            <Check className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertCircle className="h-5 w-5 mr-2" />
                        )}
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification({ ...notification, show: false })}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}