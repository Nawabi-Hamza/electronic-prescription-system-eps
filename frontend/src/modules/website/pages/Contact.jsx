import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

function Contact() {
  return (
    <div className="w-full overflow-x-hidden relative bg-white antialiased animate__fadeIn animate__animated animate__delay-.5s">
      {/* Header */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-b from-sky-100/70 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-700">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            We're here to help! Reach out anytime for support, questions or
            partnership inquiries.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-6 md:px-16 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email */}
          <div className="bg-white border border-sky-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <Mail className="h-10 w-10 text-sky-600 mb-3" />
            <h3 className="text-xl font-semibold text-sky-700">Email</h3>
            <p className="text-gray-600 mt-2">paikarict@gmail.com</p>
            <p className="text-gray-600 mt-2">paikarsoftware@gmail.com</p>
          </div>

          {/* Phone */}
          <div className="bg-white border border-sky-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <Phone className="h-10 w-10 text-sky-600 mb-3" />
            <h3 className="text-xl font-semibold text-sky-700">Phone</h3>
            <p className="text-gray-600 mt-2">+93 783231188</p>
            <p className="text-gray-600 mt-2">+93 783231188</p>
          </div>

          {/* Address */}
          <div className="bg-white border border-sky-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <MapPin className="h-10 w-10 text-sky-600 mb-3" />
            <h3 className="text-xl font-semibold text-sky-700">Address</h3>
            <p className="text-gray-600 mt-2">Kabul, Afghanistan</p>
            <p className="text-gray-600 mt-2">https://paikareps.netlify.app</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 md:px-16 py-16 bg-sky-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
          <h2 className="text-3xl font-bold text-sky-700 text-center">
            Send Us a Message
          </h2>
          <p className="mt-2 text-center text-gray-600">
            We will get back to you as soon as possible.
          </p>

          <form className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-500 focus:ring-sky-400 outline-none"
                placeholder="Your name..."
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-500 focus:ring-sky-400 outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Subject */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-500 focus:ring-sky-400 outline-none"
                placeholder="Message subject..."
              />
            </div>

            {/* Message */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="5"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-500 focus:ring-sky-400 outline-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            {/* Button */}
            <div className="col-span-2 flex justify-center">
              <button
                type="submit"
                className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white text-lg rounded-xl shadow-md flex items-center gap-3 transition"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Support Box */}
      <section className="px-6 md:px-16 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-sky-600 mb-4" />
          <h2 className="text-3xl font-bold text-sky-700">
            Need Quick Support?
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Our team is available to assist you with any issue related to EPS.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Contact;
