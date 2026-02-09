import apiClient from "./apiClient";
import { ENDPOINTS } from "../config/apiConfig";

// Define payment-related endpoints
if (!ENDPOINTS.PAYMENT) {
  ENDPOINTS.PAYMENT = {
    ROOT: "/admin/payments",
    GATEWAYS: "/admin/payment-gateways",
  };
}

// Get all payment gateways
export async function getPaymentGateways({ signal } = {}) {
  try {
    const res = await apiClient.get(ENDPOINTS.PAYMENT.GATEWAYS, { signal });
    return res.data;
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    // Return mock data in case of error
    return {
      success: true,
      data: [
        {
          id: 1,
          gateway: "Razorpay",
          subtitle:
            "Card, UPI, Net banking, Wallet(Phone Pe, Amazon Pay, Freecharge)",
          image: null,
          status: "Publish",
          showOnWallet: "Publish",
        },
        {
          id: 2,
          gateway: "Paypal",
          subtitle:
            "Credit/Debit card with Easier way to pay – online and on your mobile.",
          image: null,
          status: "Publish",
          showOnWallet: "Publish",
        },
        {
          id: 3,
          gateway: "Stripe",
          subtitle:
            "Accept all major debit and credit cards from customers in every country",
          image: null,
          status: "Publish",
          showOnWallet: "Publish",
        },
      ],
    };
  }
}

// Get payment gateway by ID
export async function getPaymentGatewayById(id, { signal } = {}) {
  try {
    const res = await apiClient.get(`${ENDPOINTS.PAYMENT.GATEWAYS}/${id}`, { signal });
    return res.data;
  } catch (error) {
    console.error(`Error fetching payment gateway with id ${id}:`, error);
    throw error;
  }
}

// Create new payment gateway
export async function createPaymentGateway(payload, { signal } = {}) {
  try {
    const res = await apiClient.post(ENDPOINTS.PAYMENT.GATEWAYS, payload, { signal });
    return res.data;
  } catch (error) {
    console.error("Error creating payment gateway:", error);
    throw error;
  }
}

// Update payment gateway
export async function updatePaymentGateway(id, payload, { signal } = {}) {
  try {
    const res = await apiClient.put(`${ENDPOINTS.PAYMENT.GATEWAYS}/${id}`, payload, { signal });
    return res.data;
  } catch (error) {
    console.error(`Error updating payment gateway with id ${id}:`, error);
    throw error;
  }
}

// Delete payment gateway
export async function deletePaymentGateway(id, { signal } = {}) {
  try {
    const res = await apiClient.delete(`${ENDPOINTS.PAYMENT.GATEWAYS}/${id}`, { signal });
    return res.data;
  } catch (error) {
    console.error(`Error deleting payment gateway with id ${id}:`, error);
    throw error;
  }
}

// Toggle payment gateway status
export async function togglePaymentGatewayStatus(id, status, { signal } = {}) {
  try {
    const res = await apiClient.patch(`${ENDPOINTS.PAYMENT.GATEWAYS}/${id}/status`, 
      { status }, 
      { signal }
    );
    return res.data;
  } catch (error) {
    console.error(`Error toggling payment gateway status for id ${id}:`, error);
    throw error;
  }
}