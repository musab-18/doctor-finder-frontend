'use client';

import Link from 'next/link';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  services: [
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Book Appointments', href: '/dashboard' },
    { label: 'Health Articles', href: '/blog' },
    { label: 'Emergency', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediFind</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              Your trusted platform for finding the best healthcare professionals. 
              Connect with top-rated doctors, book appointments seamlessly, and take 
              control of your health journey.
            </p>
            <div className="space-y-3">
              <a href="mailto:contact@medifind.com" className="flex items-center text-slate-400 hover:text-teal-400 transition-colors">
                <Mail className="w-5 h-5 mr-3" />
                contact@medifind.com
              </a>
              <a href="tel:+923255442007" className="flex items-center text-slate-400 hover:text-teal-400 transition-colors">
                <Phone className="w-5 h-5 mr-3" />
                +92 325 5442007
              </a>
              <div className="flex items-center text-slate-400">
                <MapPin className="w-5 h-5 mr-3" />
                Raiwind Road, Lahore
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${index}`}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={`support-${index}`}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={`services-${index}`}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} MediFind. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Developed with ❤️ by <span className="text-teal-400 font-semibold">MUSAB IFTIKHAR</span>
            </p>
            <p className="text-slate-500 text-xs mt-1 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="tel:+923255442007" className="hover:text-teal-400 transition-colors">📱 03255442007</a>
              <a href="mailto:musabiftikhar12@icloud.com" className="hover:text-teal-400 transition-colors">✉️ musabiftikhar12@icloud.com</a>
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={`social-${index}`}
                href={social.href}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
