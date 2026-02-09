import React, { useState, useEffect } from "react";
import styles from "./PaymentList.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { getPaymentGateways } from "../../services/paymentService";
import Loader from "../../components/Loader/Loader";

const PaymentList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);
      const response = await getPaymentGateways();
      if (response.success) {
        setPaymentGateways(response.data || []);
      } else {
        console.error("Failed to fetch payment gateways:", response.message);
        // Set mock data as fallback
        setPaymentGateways([
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
        ]);
      }
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      // Set mock data as fallback
      setPaymentGateways([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Payment Gateway Name", accessor: "gateway" },
    { title: "Payment Gateway Subtitle", accessor: "subtitle" },
    { title: "Payment Gateway Image", accessor: "image" },
    { title: "Payment Gateway Status", accessor: "status" },
    { title: "Show On Wallet?", accessor: "showOnWallet" },
    { title: "Action", accessor: "action" },
  ];

  const filtered = paymentGateways.filter((item) =>
    item.gateway.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const columnData = currentData.map((item, index) => ({
    sr: startIdx + index + 1,
    gateway: item.gateway,
    subtitle: item.subtitle,
    image: item.image ? (
      <img src={item.image} alt={item.gateway} width={40} height={40} />
    ) : (
      <div className={styles.noImage}>No Image</div>
    ),
    status: <span className={styles.publishBadge}>{item.status}</span>,
    showOnWallet: (
      <span className={styles.publishBadge}>{item.showOnWallet}</span>
    ),
    action: (
      <FaEdit
        className={styles.editIcon}
        onClick={() => navigate(`/payment/editgateway/${item.id}`)}
      />
    ),
  }));

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Payment Gateway List Management</h2>

      <div className={styles.tableCard}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Payment Gateways..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <DynamicTable
            headings={headings}
            columnData={columnData}
            noDataMessage="No gateways found."
          />
        </div>

        <PaginationTable
          data={filtered}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default PaymentList;