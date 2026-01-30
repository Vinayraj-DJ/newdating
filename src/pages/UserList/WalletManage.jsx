// src/pages/WalletManage/WalletManage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./WalletManage.module.css";
import { FaPlus, FaMinus, FaWallet } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { showCustomToast, ToastContainerCustom } from "../../components/CustomToast/CustomToast";
import { operateWalletBalance, getWalletTransactions } from "../../services/walletService";
import { getUserDetails } from "../../services/usersService";

import TableControls from "../../components/TableControls/TableControls";
import FancyPager from "../../components/FancyPager/FancyPager";

export default function WalletManage() {
  const { user_id, userType: userTypeFromUrl } = useParams();
  const userId = user_id;
  const [userType, setUserType] = useState(userTypeFromUrl || null);  // Use userType from URL if available, else determine dynamically

  const [activeTab, setActiveTab] = useState("add");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [logs, setLogs] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Helper functions for localStorage
  const getLocalStorageKey = (userId, userType) => `agency_wallet_logs_${userType}_${userId}`;
  
  const saveLogsToStorage = (userId, userType, logsData) => {
    if (userType === "agency" && userId) {
      const key = getLocalStorageKey(userId, userType);
      localStorage.setItem(key, JSON.stringify(logsData));
    }
  };
  
  const loadLogsFromStorage = (userId, userType) => {
    if (userType === "agency" && userId) {
      const key = getLocalStorageKey(userId, userType);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  };
  
  // Optional: Cleanup function to remove old logs (can be called manually if needed)
  const clearAgencyLogs = (userId, userType) => {
    if (userType === "agency" && userId) {
      const key = getLocalStorageKey(userId, userType);
      localStorage.removeItem(key);
    }
  };

  // pagination & search
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [5, 10, 25, 50];

  // guard - timestamp of last user-initiated page change (pager click)
  const lastUserPageActionRef = useRef(0);
  const RECENT_MS = 600; // if a user action happened within this ms, don't auto-reset page

  useEffect(() => {
    if (userId) {
      // If userType was provided in URL, use it directly
      if (userTypeFromUrl) {
        loadTransactions();
      } else {
        // Otherwise, determine userType dynamically
        loadUserDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userType]);
  
  // Load persisted logs for agencies on component mount
  useEffect(() => {
    if (userId && userType === "agency") {
      const storedLogs = loadLogsFromStorage(userId, userType);
      if (storedLogs.length > 0) {
        setLogs(storedLogs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  
  async function loadUserDetails() {
    if (!userId) return;
    
    try {
      // Try to get user details with different user types
      let user = null;
      let foundUserType = null;
      
      // Try male first
      try {
        user = await getUserDetails('male', userId);
        foundUserType = 'male';
      } catch (err) {
        // If not found in male, try female
        try {
          user = await getUserDetails('female', userId);
          foundUserType = 'female';
        } catch (err2) {
          // If not found in female, try agency
          try {
            user = await getUserDetails('agency', userId);
            foundUserType = 'agency';
          } catch (err3) {
            console.error("User not found in any category");
            foundUserType = 'male'; // Default fallback
          }
        }
      }
      
      setUserType(foundUserType);
      
      // Load transactions after user type is determined
      if (foundUserType) {
        loadTransactions();
      }
    } catch (err) {
      console.error("Failed to load user details:", err);
      setUserType('male'); // Default fallback
      loadTransactions(); // Try with default
    }
  }

  // async function loadTransactions() {
  //   if (!userId || !userType) return;
  //   setLoading(true);
  //   try {
  //     const res = await getWalletTransactions({ userType, userId });
  //     const payload = res?.data ?? res;
  //     const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : payload?.data ?? [];
  //     setLogs(list || []);

  //     const serverBalance =
  //       (payload && (payload.walletBalance ?? payload.balance ?? payload.balanceAfter)) ||
  //       (list[0] && (list[0].balanceAfter ?? list[0].walletBalance));
  //     if (typeof serverBalance !== "undefined" && serverBalance !== null) {
  //       setBalance(Number(serverBalance));
  //     } else {
  //       const comp = list.reduce((acc, t) => {
  //         const amt = Number(t.amount || 0);
  //         if (!isFinite(amt)) return acc;
  //         const a = String(t.action || "").toLowerCase();
  //         return a === "debit" ? acc - amt : acc + amt;
  //       }, 0);
  //       setBalance(comp);
  //     }
  //   } catch (err) {
  //     console.error("Failed to load transactions:", err);
  //     showCustomToast("Failed to load wallet transactions");
  //   } finally {
  //     setLoading(false);
  //   }
  // }










async function loadTransactions() {
  if (!userId || !userType) return;
  setLoading(true);
  try {
    // ✅ AGENCY: Load initial balance and any existing frontend logs
    if (userType === "agency") {
      const user = await getUserDetails("agency", userId);
      setBalance(Number(user?.walletBalance || 0));
      // Load persisted logs from localStorage
      const storedLogs = loadLogsFromStorage(userId, userType);
      setLogs(storedLogs);
      return;
    }

    // ⬇️ EXISTING CODE FOR MALE/FEMALE USERS
    const res = await getWalletTransactions({ userType, userId });
    const payload = res?.data ?? res;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : payload?.data ?? [];

    setLogs(list || []);

    const serverBalance =
      (payload && (payload.walletBalance ?? payload.balance ?? payload.balanceAfter)) ||
      (list[0] && (list[0].balanceAfter ?? list[0].walletBalance));

    if (typeof serverBalance !== "undefined" && serverBalance !== null) {
      setBalance(Number(serverBalance));
    } else {
      const comp = list.reduce((acc, t) => {
        const amt = Number(t.amount || 0);
        if (!isFinite(amt)) return acc;
        const a = String(t.action || "").toLowerCase();
        return a === "debit" ? acc - amt : acc + amt;
      }, 0);
      setBalance(comp);
    }
  } catch (err) {
    console.error("Failed to load transactions:", err);
    showCustomToast("Failed to load wallet transactions");
  } finally {
    setLoading(false);
  }
}





  // Filter by debouncedQuery (message, action, id, amount, date)
  const filtered = useMemo(() => {
    if (!debouncedQuery) return logs;
    const q = String(debouncedQuery).toLowerCase();
    return logs.filter((r) => {
      const fields = [
        r.message,
        r.action,
        r._id,
        r.amount,
        r.dateLabel,
        r.createdAt,
      ].map((v) => (v == null ? "" : String(v).toLowerCase()));
      return fields.some((f) => f.includes(q));
    });
  }, [logs, debouncedQuery]);

  // Pagination derived values
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Safe clamp (prevents jump-to-1 when totalPages temporarily small)
  useEffect(() => {
    if (totalPages <= 1) {
      setCurrentPage((prev) => (prev === 1 ? prev : 1));
      return;
    }
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const visibleRows = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filtered.slice(s, s + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      showCustomToast("Enter a valid amount");
      return;
    }
    if (!userId || !userType) {
      showCustomToast("User not selected or user type not determined");
      return;
    }
    setSaving(true);
    try {
      const action = activeTab === "add" ? "credit" : "debit";
      const payloadMsg = message || (action === "credit" ? "Wallet Balance Added!!" : "Wallet Balance Substract!!");
      const res = await operateWalletBalance({ userType, userId, action, amount: numericAmount, message: payloadMsg });
      const ok = res?.success ?? Boolean(res?.data);
      if (ok) {
        showCustomToast(`${action === "credit" ? "Added" : "Subtracted"} ₹${numericAmount}`);
        setAmount("");
        setMessage("");
        
        // ✅ Handle agency wallet logs on frontend
        if (userType === "agency") {
          // Add transaction to frontend logs
          const newTransaction = {
            _id: Date.now(),
            amount: numericAmount,
            action: action,
            message: payloadMsg,
            createdAt: new Date().toISOString(),
          };
          
          setLogs(prevLogs => {
            const updatedLogs = [newTransaction, ...prevLogs];
            // Persist to localStorage
            saveLogsToStorage(userId, userType, updatedLogs);
            return updatedLogs;
          });
          
          // Update balance
          setBalance(prevBalance => 
            action === "credit" ? prevBalance + numericAmount : prevBalance - numericAmount
          );
        } else {
          // For male/female users, reload from API
          await loadTransactions();
        }
      } else {
        showCustomToast(res?.message || "Operation failed");
      }
    } catch (err) {
      console.error("Operate wallet error:", err);
      showCustomToast(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  // displayed range
  const startDisplay = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endDisplay = Math.min(totalItems, currentPage * itemsPerPage);

  // Handlers passed to TableControls:
  // - onQueryImmediate: keep immediate state in sync (no page reset here)
  // - onQueryDebounced: user typed -> update debouncedQuery and reset page to 1,
  //    BUT only reset if user hasn't just pressed pager (guarded)
  const onQueryImmediate = (val) => {
    setQuery(val);
  };

  const onQueryDebounced = (val) => {
    setDebouncedQuery(val);
    // Only reset to page 1 if last user page action wasn't very recent
    const since = Date.now() - (lastUserPageActionRef.current || 0);
    if (since > RECENT_MS) {
      setCurrentPage(1);
    } else {
      // skip resetting because user just clicked the pager
      // (helps avoid race where pager -> next, and debounced search resets to 1)
      console.debug("Skipping reset-to-1 due to recent user page action", { since });
    }
  };

  const onItemsPerPageChange = (v) => {
    setItemsPerPage(v);
    // user changed items-per-page intentionally -> reset page to 1
    // But if user had just clicked pager, still it's reasonable to reset.
    setCurrentPage(1);
  };

  // FancyPager onPageChange -> mark lastUserPageActionRef to avoid race
  const onPagerChange = (p) => {
    lastUserPageActionRef.current = Date.now();
    setCurrentPage(p);
  };

  return (
    <div className={styles.container}>
      <ToastContainerCustom />

      <h2 className={styles.pageTitle}>Wallet Management</h2>

      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${activeTab === "add" ? styles.active : ""}`}
              onClick={() => setActiveTab("add")}
              type="button"
            >
              <FaPlus /> Add Balance
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "subtract" ? styles.active : ""}`}
              onClick={() => setActiveTab("subtract")}
              type="button"
            >
              <FaMinus /> Subtract Balance
            </button>
          </div>

          <div className={styles.balanceBadge}>Wallet Balance: ₹{balance}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Enter Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            disabled={saving}
          />
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputCol}>
            <label>Message (optional)</label>
            <input
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.actionBtn} ${activeTab === "add" ? styles.addBtn : styles.subtractBtn}`}
            onClick={handleSubmit}
            disabled={saving}
            type="button"
          >
            <FaWallet /> {saving ? "Processing..." : activeTab === "add" ? "Add Wallet Balance" : "Subtract Wallet Balance"}
          </button>
        </div>
      </div>

      {/* WALLET LOG */}
      <h3 className={styles.logTitle}>Wallet Log</h3>

      <div className={styles.logCard}>
        <TableControls
          idPrefix="wallet"
          query={query}
          onQueryImmediate={onQueryImmediate}
          onQueryDebounced={onQueryDebounced}
          debounceDelay={300}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={onItemsPerPageChange}
          itemsPerPageOptions={itemsPerPageOptions}
          placeholder="Search here..."
        />

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Amount</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className={styles.emptyRow}>Loading…</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan="5" className={styles.emptyRow}>No data available in table</td></tr>
              ) : (
                visibleRows.map((row, idx) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const isDebit = String(row.action || "").toLowerCase() === "debit";
                  const amtText = `${isDebit ? "-" : ""}₹${row.amount}`;
                  const dateText = row.createdAt ? new Date(row.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : (row.dateLabel || row.dateISO || "");
                  return (
                    <tr key={row._id || globalIndex} className={isDebit ? styles.rowDebit : styles.rowCredit}>
                      <td className={styles.cell}>{globalIndex}</td>
                      <td className={`${styles.cell} ${isDebit ? styles.debitCell : styles.creditCell}`}>{amtText}</td>
                      <td className={styles.cell}>{row.message || "-"}</td>
                      <td className={styles.cell}>{row.action || "-"}</td>
                      <td className={styles.cell}>{dateText}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.infoText}>Showing {startDisplay} to {endDisplay} of {totalItems} entries</div>

          <FancyPager
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPagerChange}
            showPrevNext={true}
            maxButtons={3}
          />
        </div>
      </div>
    </div>
  );
}










// // src/pages/WalletManage/WalletManage.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import styles from "./WalletManage.module.css";
// import { FaPlus, FaMinus, FaWallet } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { showCustomToast, ToastContainerCustom } from "../../components/CustomToast/CustomToast";
// import { operateWalletBalance, getWalletTransactions } from "../../services/walletService";
// import { getUserDetails } from "../../services/usersService";

// import TableControls from "../../components/TableControls/TableControls";
// import FancyPager from "../../components/FancyPager/FancyPager";

// export default function WalletManage() {
//   const { user_id, userType: userTypeFromUrl } = useParams();
//   const userId = user_id;
//   const [userType, setUserType] = useState(userTypeFromUrl || null);

//   const [activeTab, setActiveTab] = useState("add");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");

//   const [logs, setLogs] = useState([]);
//   const [balance, setBalance] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // pagination & search
//   const [query, setQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const itemsPerPageOptions = [5, 10, 25, 50];

//   const lastUserPageActionRef = useRef(0);
//   const RECENT_MS = 600;

//   useEffect(() => {
//     if (userId) {
//       if (userTypeFromUrl) {
//         loadTransactions();
//       } else {
//         loadUserDetails();
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId, userType]);

//   async function loadUserDetails() {
//     if (!userId) return;

//     try {
//       let foundUserType = null;

//       try {
//         await getUserDetails("male", userId);
//         foundUserType = "male";
//       } catch {
//         try {
//           await getUserDetails("female", userId);
//           foundUserType = "female";
//         } catch {
//           await getUserDetails("agency", userId);
//           foundUserType = "agency";
//         }
//       }

//       setUserType(foundUserType);
//       loadTransactions();
//     } catch (err) {
//       console.error("Failed to detect user type", err);
//     }
//   }

//   async function loadTransactions() {
//     if (!userId || !userType) return;
//     setLoading(true);
//     try {
//       // ✅ AGENCY: balance only (no API for logs)
//       if (userType === "agency") {
//         const user = await getUserDetails("agency", userId);
//         setBalance(Number(user?.walletBalance || 0));
//         setLogs([]);
//         return;
//       }

//       // ✅ MALE / FEMALE (unchanged)
//       const res = await getWalletTransactions({ userType, userId });
//       const payload = res?.data ?? res;
//       const list = Array.isArray(payload)
//         ? payload
//         : Array.isArray(payload?.data)
//         ? payload.data
//         : payload?.data ?? [];

//       setLogs(list || []);

//       const serverBalance =
//         (payload && (payload.walletBalance ?? payload.balance ?? payload.balanceAfter)) ||
//         (list[0] && (list[0].balanceAfter ?? list[0].walletBalance));

//       if (serverBalance !== undefined && serverBalance !== null) {
//         setBalance(Number(serverBalance));
//       }
//     } catch (err) {
//       console.error("Failed to load transactions:", err);
//       showCustomToast("Failed to load wallet transactions");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const filtered = useMemo(() => {
//     if (!debouncedQuery) return logs;
//     const q = debouncedQuery.toLowerCase();
//     return logs.filter((r) =>
//       [r.message, r.action, r._id, r.amount, r.createdAt]
//         .map(v => String(v ?? "").toLowerCase())
//         .some(f => f.includes(q))
//     );
//   }, [logs, debouncedQuery]);

//   const totalItems = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

//   useEffect(() => {
//     setCurrentPage(prev => (prev > totalPages ? totalPages : prev));
//   }, [totalPages]);

//   const visibleRows = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filtered.slice(start, start + itemsPerPage);
//   }, [filtered, currentPage, itemsPerPage]);

//   // ✅ FIXED HANDLE SUBMIT
//   const handleSubmit = async () => {
//     const numericAmount = Number(amount);
//     if (!numericAmount || numericAmount <= 0) {
//       showCustomToast("Enter a valid amount");
//       return;
//     }

//     setSaving(true);
//     try {
//       const action = activeTab === "add" ? "credit" : "debit";
//       const payloadMsg =
//         message || (action === "credit" ? "Wallet Balance Added!!" : "Wallet Balance Substract!!");

//       const res = await operateWalletBalance({
//         userType,
//         userId,
//         action,
//         amount: numericAmount,
//         message: payloadMsg,
//       });

//       const ok = res?.success ?? Boolean(res?.data);

//       if (ok) {
//         showCustomToast(`${action === "credit" ? "Added" : "Subtracted"} ₹${numericAmount}`);
//         setAmount("");
//         setMessage("");

//         // ✅ FRONTEND FIX FOR AGENCY WALLET LOG
//         if (userType === "agency") {
//           setLogs(prev => [
//             {
//               _id: Date.now(),
//               amount: numericAmount,
//               action,
//               message: payloadMsg,
//               createdAt: new Date().toISOString(),
//             },
//             ...prev,
//           ]);

//           setBalance(prev =>
//             action === "credit" ? prev + numericAmount : prev - numericAmount
//           );
//         } else {
//           await loadTransactions();
//         }
//       } else {
//         showCustomToast("Operation failed");
//       }
//     } catch (err) {
//       console.error("Operate wallet error:", err);
//       showCustomToast("Operation failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startDisplay = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
//   const endDisplay = Math.min(totalItems, currentPage * itemsPerPage);

//   return (
//     <div className={styles.container}>
//       <ToastContainerCustom />

//       <h2 className={styles.pageTitle}>Wallet Management</h2>

//       <div className={styles.card}>
//         <div className={styles.headerRow}>
//           <div className={styles.tabs}>
//             <button
//               className={`${styles.tabBtn} ${activeTab === "add" ? styles.active : ""}`}
//               onClick={() => setActiveTab("add")}
//               type="button"
//             >
//               <FaPlus /> Add Balance
//             </button>
//             <button
//               className={`${styles.tabBtn} ${activeTab === "subtract" ? styles.active : ""}`}
//               onClick={() => setActiveTab("subtract")}
//               type="button"
//             >
//               <FaMinus /> Subtract Balance
//             </button>
//           </div>

//           <div className={styles.balanceBadge}>Wallet Balance: ₹{balance}</div>
//         </div>

//         <div className={styles.inputGroup}>
//           <label>Enter Amount</label>
//           <input
//             type="number"
//             placeholder="Enter Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             disabled={saving}
//           />
//         </div>

//         <div className={styles.inputRow}>
//           <div className={styles.inputCol}>
//             <label>Message (optional)</label>
//             <input
//               type="text"
//               placeholder="Enter message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               disabled={saving}
//             />
//           </div>
//         </div>

//         <div className={styles.actionsRow}>
//           <button
//             className={`${styles.actionBtn} ${activeTab === "add" ? styles.addBtn : styles.subtractBtn}`}
//             onClick={handleSubmit}
//             disabled={saving}
//             type="button"
//           >
//             <FaWallet />
//             {saving
//               ? "Processing..."
//               : activeTab === "add"
//               ? "Add Wallet Balance"
//               : "Subtract Wallet Balance"}
//           </button>
//         </div>
//       </div>

//       <h3 className={styles.logTitle}>Wallet Log</h3>

//       <div className={styles.logCard}>
//         <TableControls
//           idPrefix="wallet"
//           query={query}
//           onQueryImmediate={setQuery}
//           onQueryDebounced={setDebouncedQuery}
//           itemsPerPage={itemsPerPage}
//           setItemsPerPage={(v) => {
//             setItemsPerPage(v);
//             setCurrentPage(1);
//           }}
//           itemsPerPageOptions={itemsPerPageOptions}
//         />

//         <div className={styles.tableWrapper}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Sr No.</th>
//                 <th>Amount</th>
//                 <th>Message</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className={styles.emptyRow}>Loading…</td>
//                 </tr>
//               ) : visibleRows.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className={styles.emptyRow}>No data available in table</td>
//                 </tr>
//               ) : (
//                 visibleRows.map((row, idx) => {
//                   const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
//                   const isDebit = row.action === "debit";
//                   return (
//                     <tr key={row._id || globalIndex}>
//                       <td>{globalIndex}</td>
//                       <td>{isDebit ? "-" : ""}₹{row.amount}</td>
//                       <td>{row.message || "-"}</td>
//                       <td>{row.action}</td>
//                       <td>{new Date(row.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className={styles.bottomRow}>
//           <div className={styles.infoText}>
//             Showing {startDisplay} to {endDisplay} of {totalItems} entries
//           </div>

//           <FancyPager
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
