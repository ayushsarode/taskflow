"use client";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaTasks, FaProjectDiagram, FaChartLine, FaRocket, FaCheckCircle, FaArrowRight } from 'react-icons/fa';


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
      {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center fade-target">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                taskflow
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Streamline your projects and tasks with our intuitive management system. 
              Organize, track, and collaborate efficiently to boost productivity.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 sm:px-8"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started
                <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md sm:px-8">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose taskflow?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Powerful features designed to boost your productivity and streamline your workflow
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-100 p-4 rounded-lg w-fit mb-6 group-hover:bg-blue-200 transition-colors">
                <FaTasks className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize and prioritize your tasks with ease using our intuitive drag-and-drop interface and smart categorization.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-purple-100 p-4 rounded-lg w-fit mb-6 group-hover:bg-purple-200 transition-colors">
                <FaProjectDiagram className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Project Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep track of multiple projects and their progress in one centralized dashboard with real-time updates.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group md:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="600">
              <div className="bg-green-100 p-4 rounded-lg w-fit mb-6 group-hover:bg-green-200 transition-colors">
                <FaChartLine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get valuable insights into your productivity with detailed charts, reports, and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Everything you need to stay organized
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our comprehensive task management solution helps teams and individuals stay on top of their work
                with powerful features designed for modern workflows.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3" data-aos="fade-up" data-aos-delay="200">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Real-time collaboration and team sync</span>
                </li>
                <li className="flex items-start gap-3" data-aos="fade-up" data-aos-delay="300">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced filtering and search capabilities</span>
                </li>
                <li className="flex items-start gap-3" data-aos="fade-up" data-aos-delay="400">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Customizable dashboards and reports</span>
                </li>
                <li className="flex items-start gap-3" data-aos="fade-up" data-aos-delay="500">
                  <FaCheckCircle className="text-green-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mobile-responsive design</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl" data-aos="fade-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">5 of 8 completed</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg transition-colors hover:bg-green-100" data-aos="fade-up" data-aos-delay="200">
                    <FaCheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-gray-700 line-through">Review project proposal</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg transition-colors hover:bg-green-100" data-aos="fade-up" data-aos-delay="300">
                    <FaCheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-gray-700 line-through">Update team documentation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100" data-aos="fade-up" data-aos-delay="400">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">Schedule client meeting</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100" data-aos="fade-up" data-aos-delay="500">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">Prepare quarterly report</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100" data-aos="fade-up" data-aos-delay="600">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">Design system updates</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4" data-aos="fade-up" data-aos-delay="700">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>62.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '62.5%'}}></div>
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
