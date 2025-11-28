import React from "react";
import { Link } from "react-router-dom";
import { ArrowBigLeft, BookOpen, School } from "lucide-react";
import { btnStyle } from "../../styles/componentsStyle";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-br  text-center px-4">
      {/* Icon */}
      <School className="text-sky-500 mb-4" size={60} />

      {/* Title */}
      <h1 className="text-6xl font-extrabold text-sky-600 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Oops! Page Not Found
      </h2>

      {/* School-themed message */}
      <p className="text-gray-600 max-w-md mb-6">
        Looks like you’re lost in the <span className="font-semibold">school corridors</span>.  
        Maybe the page you’re looking its not exist.
      </p>

      {/* Button */}
      <Link
        to="../"
        className={btnStyle.filled+" flex items-center gap-2"}
      >
        <ArrowBigLeft size={20} />
          Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
