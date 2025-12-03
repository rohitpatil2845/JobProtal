const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobPortal</h3>
            <p className="text-gray-400">
              Find your dream job with our AI-powered job search platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/jobs" className="hover:text-white">Browse Jobs</a></li>
              <li><a href="/recommendations" className="hover:text-white">Recommendations</a></li>
              <li><a href="/my-applications" className="hover:text-white">My Applications</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/admin/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/admin/jobs" className="hover:text-white">Post a Job</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
