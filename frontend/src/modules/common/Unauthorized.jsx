import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized Access</h1>
      <p className="mt-4">Sorry, you do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
