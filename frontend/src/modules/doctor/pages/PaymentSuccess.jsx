import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>
      <p className="text-lg text-green-800">
        Your payment was completed successfully. Thank you for your payment!
      </p>
    </div>
  );
};

export default PaymentSuccess;
