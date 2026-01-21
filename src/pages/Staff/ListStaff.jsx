


// src/pages/Staff/ListStaff.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ListStaff.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { getAllStaff, deleteStaff } from "../../services/staffService";

const ListStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [highlight, setHighlight] = useState({}); // {id: {email:true, password:true, status:true}}
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let active = true;

    setLoading(true);
    setErr("");

    getAllStaff({ signal: ctrl.signal })
      .then((res) => {
        if (!active) return;
        // API might return:
        // 1) { success: true, data: [...] }
        // 2) { data: [...] }
        // 3) [...]
        // 4) res.data already equals { success, data } because service returned res.data
        const payload = res ?? {};
        // prefer payload.data if array, else try res.data (nested), else try res itself if array
        let arr = [];
        if (Array.isArray(payload)) arr = payload;
        else if (Array.isArray(payload.data)) arr = payload.data;
        else if (Array.isArray(payload?.data?.data)) arr = payload.data.data;
        else arr = [];

        setItems(arr);
      })
      .catch((e) => {
        // ignore abort/cancel errors (these aren't real failures)
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") {
          return;
        }
        setErr(e?.response?.data?.message || e?.message || "Failed to load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      ctrl.abort();
    };
  }, []);

  // Apply partial patch when coming back from edit
  useEffect(() => {
    const upd = location.state?.updated;
    if (!upd?.id) return;

    setItems((prev) =>
      prev.map((it) => {
        if ((it._id || it.id) !== upd.id) return it;
        const next = { ...it };
        const cellFlags = {};
        if (typeof upd.email !== "undefined" && upd.email !== it.email) {
          next.email = upd.email;
          cellFlags.email = true;
        }
        if (typeof upd.password !== "undefined" && upd.password !== it.password) {
          next.password = upd.password;
          cellFlags.password = true;
        }
        if (typeof upd.status !== "undefined" && upd.status !== it.status) {
          next.status = upd.status;
          cellFlags.status = true;
        }
        if (Object.keys(cellFlags).length) {
          setHighlight((h) => ({ ...h, [upd.id]: { ...cellFlags, action: true } }));
          // remove highlight after 1.2s
          setTimeout(() => {
            setHighlight((h) => {
              const { [upd.id]: _drop, ...rest } = h;
              return rest;
            });
          }, 1200);
        }
        return next;
      })
    );

    // clear history state so refresh doesn't re-apply
    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate]);

  const headings = [
    { title: "Sr No.", accessor: "sr" },
    { title: "Email", accessor: "email" },
    { title: "Password", accessor: "password" },
    { title: "Staff Status", accessor: "status" },
    { title: "Action", accessor: "action" },
  ];

  const filtered = useMemo(() => {
    const q = String(searchTerm || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      String(item.email || "").toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const onDelete = async (row) => {
    setItemToDelete(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteStaff({ id: itemToDelete._id || itemToDelete.id });
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== (itemToDelete._id || itemToDelete.id)));
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const columnData = currentData.map((item, index) => {
    const hl = highlight[(item._id || item.id)] || {};
    return {
    sr: startIdx + index + 1,
    email: (
      <span className={hl.email ? styles.flash : ""}>
        {item.email || "-"}
      </span>
    ),
    password: (
      <span className={hl.password ? styles.flash : ""}>
        {"••••••••"}
      </span>
    ),
    status: (
      <span className={`${(item.status || "").toLowerCase() === "publish" ? styles.publishBadge : styles.unpublishBadge} ${hl.status ? styles.flash : ""}`}>
        {item.status || "-"}
      </span>
    ),
    action: (
      <div className={`${styles.actions} ${hl.action ? styles.flash : ""}`}>
        <FaEdit
          className={styles.editIcon}
          onClick={() => navigate(`/staff/editstaff/${item._id || item.id}`)}
        />
        <FaTrash className={styles.deleteIcon} onClick={() => onDelete(item)} />
      </div>
    ),
  };});

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Staff List Management</h2>

      <div className={styles.tableCard}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Loading…</div>
          ) : err ? (
            <div className={styles.error}>{err}</div>
          ) : (
            <DynamicTable
              headings={headings}
              columnData={columnData}
              noDataMessage="No staff found."
            />
          )}
        </div>

        <PaginationTable
          data={filtered}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={currentPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Staff"
        message={`Are you sure you want to delete staff {}? This action cannot be undone.`}
        highlightContent={itemToDelete?.email}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ListStaff;
