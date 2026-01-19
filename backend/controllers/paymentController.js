require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const HESAB_API_KEY = process.env.HESAB_API_KEY;

// Fixed product
const EPS_MONTHLY_FEE = {
  id: "EPS001",
  name: "EPS Fee",
  price: 500, // AF
};

// Verify payment and redirect to frontend pages
const verifyPayment = async (req, res) => {
  try {
    // If HesabPay sends any query params (like ?data=...), we ignore them
    // Simply redirect to the appropriate frontend page
    // You can decide to show success/failure based on some condition if needed
    // For now, always redirect to payment-success for demo
    return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (err) {
    console.error("Payment verification error:", err.message);
    // On any error, redirect to failure page
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};


// Create payment session
async function createPaymentSession(email) {
  const endpoint = "https://api.hesab.com/api/v1/payment/create-session";

  const headers = {
    Authorization: `API-KEY ${HESAB_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const payload = {
    items: [EPS_MONTHLY_FEE],
    email: email ?? null,
    redirect_success_url: `${process.env.SERVER_URL}/payments/verify-payment`,
    redirect_failure_url: `${process.env.SERVER_URL}/payments/verify-payment`,
  };

  const response = await axios.post(endpoint, payload, {
    headers,
    timeout: 30000,
  });

  return response.data;
}

// Endpoint to create HesabPay session
const hesabPayPayment = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const session = await createPaymentSession(email);

    console.log("HesabPay session:", session);

    return res.json(session); // includes payment_url
  } catch (error) {
    console.error("HesabPay Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Payment session creation failed",
      details: error.response?.data || error.message,
    });
  }
};

module.exports = {
  hesabPayPayment,
  verifyPayment,
};
