import React from "react";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Failed ⚠️</h1>
      <p className="text-lg text-red-800">
        Your payment could not be processed. Please try again.
      </p>
    </div>
  );
};

export default PaymentFailed;
