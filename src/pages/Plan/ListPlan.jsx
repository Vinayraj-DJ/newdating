// src/pages/Plan/ListPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ListPlan.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import PaginationTable from "../../components/PaginationTable/PaginationTable";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { getAllPlans, deletePlan } from "../../services/planService";

const CACHE_KEY = "admin_plans_list";

export default function ListPlan() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [highlight, setHighlight] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // normalize server item: pull toggleButtons fields to top-level for UI convenience
  const normalizeItem = (it) => {
    if (!it) return it;
    const tb = it.toggleButtons || {};
    return {
      ...it,
      filterInclude: typeof it.filterInclude !== "undefined" ? it.filterInclude : !!tb.filterInclude,
      audioVideo: typeof it.audioVideo !== "undefined" ? it.audioVideo : !!tb.audioVideo,
      directChat: typeof it.directChat !== "undefined" ? it.directChat : !!tb.directChat,
      chat: typeof it.chat !== "undefined" ? it.chat : !!tb.chat,
      likeMenu: typeof it.likeMenu !== "undefined" ? it.likeMenu : !!tb.likeMenu,
    };
  };

  // load
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
    getAllPlans({ signal: ctrl.signal })
      .then((res) => {
        if (!active) return;
        // server might return { data: [...] } or [...], handle both
        const payload = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.data || res;
        const arr = Array.isArray(payload) ? payload.map(normalizeItem) : [];
        setItems(arr);

        // Update cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(arr));
        } catch (e) { }

        if (!hasCache) setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        if (active) {
          // Only show error if we have no data at all
          if (!hasCache && items.length === 0) {
            setErr(e?.response?.data?.message || e?.message || "Failed to load");
          }
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
      ctrl.abort();
    };
  }, []);

  // patch after edit
  useEffect(() => {
    const upd = location.state?.updated;
    if (!upd?.id) return;

    setItems((prev) => {
      const newItems = prev.map((it) => {
        if (it._id !== upd.id) return it;
        const next = { ...it };
        const f = {};

        // when server returns updated delta, it may contain toggle fields or toggleButtons;
        // treat toggles as top-level for UI
        const toggles = ["filterInclude", "audioVideo", "directChat", "chat", "likeMenu"];
        for (const k of [
          "title",
          "amount",
          "dayLimit",
          "description",
          ...toggles,
          "status",
        ]) {
          if (typeof upd[k] !== "undefined" && upd[k] !== it[k]) {
            next[k] = upd[k];
            f[k] = true;
          }
        }

        // if server accidentally sent toggleButtons object in `upd`, merge its values too
        if (upd.toggleButtons && typeof upd.toggleButtons === "object") {
          for (const t of toggles) {
            if (typeof upd.toggleButtons[t] !== "undefined" && upd.toggleButtons[t] !== it[t]) {
              next[t] = upd.toggleButtons[t];
              f[t] = true;
            }
          }
        }

        if (Object.keys(f).length) {
          setHighlight((h) => ({ ...h, [upd.id]: { ...f, action: true } }));
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

    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate]);

  const headings = useMemo(
    () => [
      { title: "Sr No.", accessor: "sr" },
      { title: "Plan Title", accessor: "title" },
      { title: "Plan Amount", accessor: "amount" },
      { title: "Day Limit", accessor: "dayLimit" },
      { title: "Filter Include ?", accessor: "filterInclude" },
      { title: "Direct Chat ?", accessor: "directChat" },
      { title: "Chat ?", accessor: "chat" },
      { title: "Like Menu ?", accessor: "likeMenu" },
      { title: "Audio Video ?", accessor: "audioVideo" },
      { title: "Plan Status", accessor: "status" },
      { title: "Action", accessor: "action" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        String(it.title || "")
          .toLowerCase()
          .includes(q) ||
        String(it.amount || "")
          .toLowerCase()
          .includes(q)
    );
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
      await deletePlan({ id: itemToDelete._id });
      setItems((prev) => {
        const next = prev.filter((i) => i._id !== itemToDelete._id);
        // Sync with cache
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
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

  const yesNo = (v) => (v ? "Yes" : "No");

  const columnData = useMemo(
    () =>
      currentData.map((it, i) => {
        const hl = highlight[it._id] || {};
        return {
          sr: startIdx + i + 1,
          title: (
            <span className={hl.title ? styles.flash : ""}>
              {it.title || "-"}
            </span>
          ),
          amount: (
            <span className={hl.amount ? styles.flash : ""}>
              {it.amount ?? "-"}
            </span>
          ),
          dayLimit: (
            <span className={hl.dayLimit ? styles.flash : ""}>
              {it.dayLimit ?? "-"}
            </span>
          ),
          filterInclude: (
            <span className={hl.filterInclude ? styles.flash : ""}>
              {yesNo(it.filterInclude)}
            </span>
          ),
          directChat: (
            <span className={hl.directChat ? styles.flash : ""}>
              {yesNo(it.directChat)}
            </span>
          ),
          chat: (
            <span className={hl.chat ? styles.flash : ""}>
              {yesNo(it.chat)}
            </span>
          ),
          likeMenu: (
            <span className={hl.likeMenu ? styles.flash : ""}>
              {yesNo(it.likeMenu)}
            </span>
          ),
          audioVideo: (
            <span className={hl.audioVideo ? styles.flash : ""}>
              {yesNo(it.audioVideo)}
            </span>
          ),
          status: (
            <span
              className={`${(it.status || "").toLowerCase() === "publish"
                  ? styles.publishBadge
                  : styles.unpublishBadge
                } ${hl.status ? styles.flash : ""}`}
            >
              {it.status || "UnPublish"}
            </span>
          ),
          action: (
            <div className={`${styles.actions} ${hl.action ? styles.flash : ""}`}>
              <FaEdit
                className={styles.editIcon}
                title="Edit"
                onClick={() => navigate(`/plan/editplan/${it._id}`)}
              />
              <FaTrash
                className={styles.deleteIcon}
                title="Delete"
                onClick={() => doDelete(it)}
              />
            </div>
          ),
        };
      }),
    [currentData, navigate, startIdx, highlight]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Plan List Management
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Search Plans..."
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
            <DynamicTable
              headings={headings}
              columnData={columnData}
              noDataMessage="No plans found."
            />
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
        title="Delete Plan"
        message={`Are you sure you want to delete plan {}? This action cannot be undone.`}
        highlightContent={itemToDelete?.title}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
