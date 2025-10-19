import { Mail, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-8 w-full bg-gradient-to-t from-blue-50 to-white border-t border-gray-200 p-6 md:p-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0 border-b border-gray-200 pb-6">
        {/* Logo */}
        <div className="flex items-center">
          <img className="h-12 md:h-14" src="/logo.png" alt="ArtByAnchal Logo" />
        </div>

        {/* Contact Info */}
        <div className="flex-1 flex flex-col md:flex-row justify-end gap-6">
          {/* Instagram */}
          <a
            href="https://instagram.com/artbyanchal12"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 items-center hover:text-pink-500 transition-colors"
          >
            <Instagram size={16} className="text-pink-500" />
            <span className="text-sm text-gray-600">@artbyanchal12</span>
          </a>

          {/* Email */}
          <a
            href="mailto:artbyanchal012@gmail.com"
            className="flex gap-2 items-center hover:text-pink-500 transition-colors"
          >
            <Mail size={16} className="text-pink-500" />
            <span className="text-sm text-gray-600">artbyanchal012@gmail.com</span>
          </a>

          {/* Location */}
          <div className="flex gap-2 items-center text-gray-600">
            <MapPin size={16} className="text-pink-500" />
            <span className="text-sm">Mumbai, Maharashtra</span>
          </div>
        </div>
      </div>

     {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
        <h3 className="text-xs text-gray-500 text-center md:text-left">
          © 2024 All rights reserved by ArtByAnchal
        </h3>
        <p className="text-xs text-gray-500 text-center md:text-right">
          Crafted with ❤️ and creativity.
        </p>
      </div>
    </footer>
  );
}
