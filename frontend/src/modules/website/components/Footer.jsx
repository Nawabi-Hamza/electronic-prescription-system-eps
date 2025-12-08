import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-sky-900 text-sky-100 px-6 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h1 className="text-2xl font-bold text-white">EPS System</h1>
            <p className="text-sky-200 mt-2">Paikar ICT: Smart Technology For Tomorrow</p>
            <p className="text-sky-200 mt-2">EPS: Secure, Fast, Easy, and modern electronic prescription system.</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sky-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/appointment" className="hover:text-white">Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/auth" className="hover:text-white">I am doctor ?</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Contact</h4>
            <p className="text-sky-200">Email: PaikarSoftware@gmail.com</p>
            <p className="text-sky-200">Email: PaikarICT@gmail.com</p>
            <p className="text-sky-200">Phone: +93 783 23 11 88</p>
            <p className="text-sky-200">Phone: +93 771 84 47 70</p>
          </div>
        </div>

        <div className="text-center text-sky-300 mt-10 text-sm">
          © {new Date().getFullYear()} Paikar -EPS- System. All Rights Reserved.
        </div>
    </footer>
  )
}

export default Footer