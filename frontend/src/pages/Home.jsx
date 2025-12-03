import { Link } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiTrendingUp, FiUsers } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              AI-powered job search platform connecting talented professionals with top companies
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/jobs" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Browse Jobs
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobPortal?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Advanced filters to find exactly what you're looking for
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Get personalized job recommendations based on your skills
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with one click
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <p className="text-gray-600">
                Connect with leading companies worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Candidates</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of professionals who found their dream job through JobPortal
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
