"use client";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaTasks, FaProjectDiagram, FaChartLine, FaRocket, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Button from '../components/ui/Button.jsx';

export default function Page() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">taskflow</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
              Streamline your projects and tasks with our intuitive task management system.
              Organize, track, and collaborate efficiently to boost your productivity.
            </p>
            <div className="flex items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="400">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
              </Button>
              <Button variant="secondary" className="bg-white hover:bg-gray-50  border text-yellow-600 border-gray-300 px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose taskflow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed to boost your productivity and streamline your workflow</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-100 p-4 rounded-lg w-fit mb-6">
                <FaTasks className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-600 leading-relaxed">Organize and prioritize your tasks with ease using our intuitive drag-and-drop interface and smart categorization.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-purple-100 p-4 rounded-lg w-fit mb-6">
                <FaProjectDiagram className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Project Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Keep track of multiple projects and their progress in one centralized dashboard with real-time updates.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200" data-aos="fade-up" data-aos-delay="600">
              <div className="bg-green-100 p-4 rounded-lg w-fit mb-6">
                <FaChartLine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">Get valuable insights into your productivity with detailed charts, reports, and performance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Everything you need to stay organized</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our comprehensive task management solution helps teams and individuals stay on top of their work
                with powerful features designed for modern workflows.
              </p>
              <ul className="space-y-4">

                <li className="flex items-center gap-3" data-aos="fade-up" data-aos-delay="300">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced filtering and search capabilities</span>
                </li>
                <li className="flex items-center gap-3" data-aos="fade-up" data-aos-delay="400">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">Customizable dashboards and reports</span>
                </li>
                <li className="flex items-center gap-3" data-aos="fade-up" data-aos-delay="500">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">Mobile-responsive design</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl" data-aos="fade-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                  <span className="text-sm text-gray-500">5 of 8 completed</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg" data-aos="fade-up" data-aos-delay="200">
                    <FaCheckCircle className="text-green-500 h-4 w-4" />
                    <span className="text-sm text-gray-700 line-through">Review project proposal</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg" data-aos="fade-up" data-aos-delay="300">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full"></div>
                    <span className="text-sm text-gray-700">Update team documentation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg" data-aos="fade-up" data-aos-delay="400">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full"></div>
                    <span className="text-sm text-gray-700">Schedule client meeting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}