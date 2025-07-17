import React, { useState } from 'react';
import { FiSend, FiMail, FiMapPin, FiPhone, FiUser, FiMessageSquare, FiClock } from 'react-icons/fi';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 2000);
  };

  const socialIcons = [
    { icon: <FaTwitter />, name: 'Twitter' },
    { icon: <FaLinkedinIn />, name: 'LinkedIn' },
    { icon: <FaInstagram />, name: 'Instagram' },
    { icon: <FaFacebookF />, name: 'Facebook' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#766df4] to-[#a18dfa] mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          We're here to help and answer any questions you might have.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-lg bg-[#766df4]/10 text-[#766df4] flex items-center justify-center mr-4">
                <FiSend className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-[#766df4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSend className="text-2xl text-[#766df4]" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Your Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:border-[#766df4] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiMail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:border-[#766df4] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Your Message</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <FiMessageSquare />
                    </div>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hello, I'd like to talk about..."
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:border-[#766df4] transition-all"
                      required
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-[#766df4] to-[#a18dfa] hover:from-[#6359e8] hover:to-[#8a7cf5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#766df4] transition-all"
                >
                  <FiSend className="mr-2" />
                  Send Message
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-[#766df4] to-[#a18dfa] rounded-2xl shadow-xl overflow-hidden text-white"
        >
          <div className="p-8 sm:p-10 h-full flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiMail className="text-xl" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-white/90">hello@apporbit.com</p>
                    <p className="text-white/90 mt-1">support@apporbit.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiPhone className="text-xl" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="text-white/90">+1 (555) 123-4567</p>
                    <p className="text-white/90 mt-1">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiMapPin className="text-xl" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Office</h3>
                    <p className="text-white/90">123 Tech Street</p>
                    <p className="text-white/90">San Francisco, CA 94107</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiClock className="text-xl" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Response Time</h3>
                    <p className="text-white/90">Typically within 24 hours</p>
                    <p className="text-white/90 mt-1">Emergency: 1 hour</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/20">
              <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-[#766df4]/10 text-[#766df4] flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly will I receive a response?",
                answer: "We typically respond within 24 hours during business days. For urgent matters, please call our support line."
              },
              {
                question: "What's the best way to contact support?",
                answer: "For technical issues, email support@apporbit.com. For general inquiries, use our contact form."
              },
              {
                question: "Do you offer phone support?",
                answer: "Yes, our phone support is available Monday to Friday, 9am-5pm EST."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;