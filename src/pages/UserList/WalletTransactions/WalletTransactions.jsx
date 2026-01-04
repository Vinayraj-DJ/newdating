import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// import { getUserTransactions } from "../../services/transactionService";
import styles from "./WalletTransactions.module.css";

const WalletTransactions = () => {
  const { user_id } = useParams();
  const [searchParams] = useSearchParams();
  const operationType = searchParams.get("type"); // wallet | coin

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [operationType]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getUserTransactions(user_id, operationType);
      setTransactions(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {operationType === "wallet" ? "Wallet Transactions" : "Coin Transactions"}
      </h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Action</th>
            <th>Amount</th>
            <th>Balance After</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5">No transactions found</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx._id}>
                <td className={tx.action === "credit" ? styles.credit : styles.debit}>
                  {tx.action.toUpperCase()}
                </td>
                <td>{tx.amount}</td>
                <td>{tx.balanceAfter}</td>
                <td>{tx.message}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTransactions;
