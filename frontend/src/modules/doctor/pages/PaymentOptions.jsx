import React, { useState } from "react";
import { CreditCard, Bitcoin, PiggyBank } from "lucide-react"; // icons
import { toast } from "react-toastify";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

const PaymentOptions = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth()

const handleHesabPay = async () => {
  setLoading(true);
  try {
    // If you are using axios or your api helper
    const { data } = await api.post("/payments/hesabpay-checkout-session", {
      email: user.email || "user@example.com", // replace with actual user email
    });

    if (data.url) {
      // redirect to HesabPay
      window.location.href = data.url;
    } else {
      toast.error("Failed to get HesabPay URL");
      console.log(data);
    }
  } catch (err) {
    console.error(err);
    toast.error("Payment request failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">

      {/* HesabPay */}
      <div
        onClick={handleHesabPay}
        className={`flex gap-4 items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="p-4 bg-sky-100 rounded-full">
          <PiggyBank className="w-8 h-8 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">HesabPay</h3>
          <p className="text-sm text-gray-500 mt-1">
            Pay directly from your HesabPay account
          </p>
        </div>
      </div>

      {/* Binance */}
      <div
        onClick={() => toast.info("Binance integration not implemented yet")}
        className="flex gap-4 items-center p-6 bg-white rounded-xl shadow  transition cursor-progress"
      >
        <div className="p-4 bg-yellow-100 rounded-full">
          <Bitcoin className="w-8 h-8 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Binance</h3>
          <p className="text-sm text-gray-500 mt-1">
            Pay using your Binance wallet
          </p>
        </div>
      </div>

        {/* PayPal */}
        <div
            onClick={() => toast.info("PayPal integration not implemented yet")}
            className="flex gap-4 items-center p-6 bg-white rounded-xl shadow  transition cursor-progress"
        >
        <div className="p-4 bg-blue-100 rounded-full">
            <CreditCard className="w-8 h-8 text-blue-600" /> {/* You can replace with PayPal icon if available */}
        </div>
        <div>
            <h3 className="text-lg font-semibold">PayPal</h3>
            <p className="text-sm text-gray-500 mt-1">
            Pay with your PayPal account or linked credit/debit card
            </p>
        </div>
        </div>


    </div>
  );
};

export default PaymentOptions;
