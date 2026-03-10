import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-16 px-8 md:px-16 mt-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-700">
        
        {/* Column 1: Address */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="mb-6">
             <img src="/logo.png" alt="Ultra Hustle" className="h-8 object-contain" />
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-600">Address</h4>
            <div className="space-y-2 text-gray-600 font-medium">
                <p>1234 Fashion Street, Suite 567,</p>
                <p>New York, NY 10001</p>
            </div>
          </div>

          <div className="space-y-1 text-gray-600 font-medium">
             <p>Email: info@fashionshop.com</p>
             <p>Phone: (212) 555-1234</p>
          </div>
        </div>

        {/* Column 2: Help */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-gray-600">Help</h4>
          <ul className="space-y-3 text-gray-600 font-medium">
            <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-black transition-colors">My Wishlist</a></li>
          </ul>
        </div>

        {/* Column 3: About us */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-gray-600">About us</h4>
          <ul className="space-y-3 text-gray-600 font-medium">
            <li><a href="#" className="hover:text-black transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Account</a></li>
          </ul>
        </div>

        {/* Column 4: Sign Up For Email */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-gray-600">Sign Up For Email</h4>
          <p className="text-gray-600 font-medium mb-6 leading-relaxed">
            Get first dibs on new arrivals sales, exclusive content and more!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <input 
                type="email" 
                placeholder="Enter Your email.." 
                className="flex-1 px-4 py-2 bg-transparent border-b border-gray-400 focus:outline-none focus:border-black placeholder-gray-500 text-sm"
             />
             <button className="px-6 py-2 bg-[#D4FF00] text-gray-900 font-bold text-sm rounded shadow-sm hover:bg-[#c0e600] transition-colors">
                Subscribe
             </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
