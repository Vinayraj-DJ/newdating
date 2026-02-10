// src/pages/Gift/ListGift.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ListGift.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { getAllGifts, deleteGift } from "../../services/giftService";
import { API_BASE } from "../../config/apiConfig";

const fixIconUrl = (icon) =>
  !icon ? "" : /^https?:\/\//i.test(icon) ? icon : `${API_BASE}/${String(icon).replace(/^\/+/, "")}`;

const CACHE_KEY = "admin_gifts_list";

export default function ListGift() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [highlight, setHighlight] = useState({}); // {id:{coin,status,icon}}
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load once
  useEffect(() => {
    const ctrl = new AbortController();
    let active = true;

    // 1. Try to load from cache first
    const cached = sessionStorage.getItem(CACHE_KEY);
    let hasCache = false;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setLoading(false); // Show content immediately
          hasCache = true;
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    if (!hasCache) {
      setLoading(true);
    }
    setErr("");

    // 2. Fetch fresh data (Stale-While-Revalidate)
    getAllGifts({ signal: ctrl.signal })
      .then((resList) => {
        if (!active) return;
        const list = Array.isArray(resList) ? resList : Array.isArray(resList?.data) ? resList.data : [];
        // Ensure each item has coin, icon, status normalized
        const normalized = list.map((g) => ({
          ...g,
          coin: g.coin ?? g.price ?? "",
          icon: g.icon ?? g.image ?? g.imageUrl ?? g.path ?? "",
          status: String(g.status || "").toLowerCase(),
        })).reverse();
        setItems(normalized);

        // Update cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
        } catch (e) { }

        if (!hasCache) setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        if (!active) return;
        // Only show error if we have no data at all
        if (!hasCache && items.length === 0) {
          setErr(e?.response?.data?.message || e?.message || "Failed to load");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      ctrl.abort();
    };
  }, []);

  // Patch in-place after edit
  useEffect(() => {
    const upd = location.state?.updated;
    if (!upd?.id) return;

    setItems((prev) => {
      const newItems = prev.map((it) => {
        if (it._id !== upd.id) return it;
        const next = { ...it };
        const flags = {};
        if (typeof upd.coin !== "undefined" && String(upd.coin) !== String(it.coin)) {
          next.coin = upd.coin;
          flags.coin = true;
        }
        if (typeof upd.status !== "undefined" && (String(upd.status).toLowerCase() !== String(it.status).toLowerCase())) {
          next.status = upd.status;
          flags.status = true;
        }
        if (typeof upd.icon !== "undefined" && upd.icon) {
          next.icon = upd.icon;
          flags.icon = true;
        }
        if (Object.keys(flags).length) {
          setHighlight((h) => ({ ...h, [upd.id]: flags }));
          setTimeout(() => {
            setHighlight((h) => {
              const { [upd.id]: _drop, ...rest } = h;
              return rest;
            });
          }, 1200);
        }
        return next;
      });

      // Update cache with patched data
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(newItems));
      } catch (e) { }

      return newItems;
    });

    // clear state so refresh doesn't re-apply
    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => String(it.coin ?? "").toLowerCase().includes(q));
  }, [items, searchTerm]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const doDelete = async (row) => {
    setItemToDelete(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteGift({ id: itemToDelete._id });
      setItems((prev) => {
        const next = prev.filter((i) => i._id !== itemToDelete._id);
        // Sync with cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
          // Clear dashboard cache
          localStorage.removeItem("dashboard_cards_v2");
        } catch (e) { }
        return next;
      });
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

  const headings = useMemo(
    () => [
      { title: "Sr No.", accessor: "sr" },
      { title: "Gift Image", accessor: "image" },
      { title: "Gift Coin", accessor: "coin" },
      { title: "Gift Status", accessor: "status" },
      { title: "Action", accessor: "action" },
    ],
    []
  );

  const columnData = useMemo(
    () =>
      currentData.map((it, i) => {
        const url = fixIconUrl(it.icon);
        const hl = highlight[it._id] || {};
        return {
          sr: startIdx + i + 1,
          image: url ? (
            <img
              src={url}
              alt={`gift-${i}`}
              width={50}
              height={50}
              className={hl.icon ? styles.flash : ""}
              style={{ objectFit: "cover", borderRadius: 8 }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className={`${styles.placeholderImg} ${hl.icon ? styles.flash : ""}`}>—</div>
          ),
          coin: <span className={hl.coin ? styles.flash : ""}>{it.coin ?? "-"}</span>,
          status: (
            <span
              className={`${(it.status || "").toLowerCase() === "publish" ? styles.publishBadge : styles.unpublishBadge} ${hl.status ? styles.flash : ""
                }`}
            >
              {it.status || "unpublish"}
            </span>
          ),
          action: (
            <div className={styles.actions}>
              <FaEdit className={styles.editIcon} title="Edit" onClick={() => navigate(`/gift/editgift/${it._id}`)} />
              <FaTrash className={styles.deleteIcon} title="Delete" onClick={() => doDelete(it)} />
            </div>
          ),
        };
      }),
    [currentData, navigate, startIdx, highlight]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Gift List Management
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Gift Coins..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </h2>
      <div className={styles.tableCard}>

        {loading ? (
          <DynamicTable loading={true} />
        ) : err ? (
          <div className={styles.error}>{err}</div>
        ) : (
          <>
            <DynamicTable headings={headings} columnData={columnData} noDataMessage="No gifts found." />
            <PaginationTable
              data={filtered}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </>
        )}
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Gift"
        message={`Are you sure you want to delete gift with {} coins? This action cannot be undone.`}
        highlightContent={itemToDelete?.coin ?? "-"}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
