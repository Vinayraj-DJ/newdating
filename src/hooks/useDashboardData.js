import { useEffect, useState, useRef, useCallback } from "react";
import { ENDPOINTS } from "../config/apiConfig";
import {
  getCountByEndpoint,
  getDashboardStats,
} from "../services/api";
import { getEarningsSummary } from "../services/earningsService";

export const CACHE_KEY = "dashboard_cards_v2";
const CACHE_DURATION = 30 * 60 * 1000; // Increased to 30 minutes cache


function buildCardsFromStats(stats, icons, earningsData = null) {
  const cards = [
    {
      label: "Interest",
      value: stats.interestCount || stats.interests || 0,
      icon: icons[0],
    },
    {
      label: "Language",
      value: stats.languageCount || stats.languages || 0,
      icon: icons[1],
    },
    {
      label: "Religion",
      value: stats.religionCount || stats.religions || 0,
      icon: icons[2],
    },
    {
      label: "Relation Goal",
      value: stats.relationGoalCount || stats.relationGoals || 0,
      icon: icons[3],
    },
    {
      label: "FAQ",
      value: stats.faqCount || stats.faqs || 0,
      icon: icons[4],
    },
    {
      label: "Plan",
      value: stats.planCount || stats.plans || 0,
      icon: icons[5],
    },
    {
      label: "Total Users",
      value: stats.totalUsers || stats.usersTotal || (stats.maleUsers + stats.femaleUsers + stats.agencyUsers) || 0,
      icon: icons[6],
    },
    {
      label: "Total Pages",
      value: stats.pageCount || stats.pages || 0,
      icon: icons[7],
    },
    {
      label: "Total Gift",
      value: stats.giftCount || stats.gifts || 0,
      icon: icons[8],
    },
    {
      label: "Total Package",
      value: stats.packageCount || stats.packages || 0,
      icon: icons[9],
    },
    {
      label: "Total Male",
      value: stats.maleUsers || stats.maleCount || 0,
      icon: icons[10],
    },
    {
      label: "Total Female",
      value: stats.femaleUsers || stats.femaleCount || 0,
      icon: icons[11],
    },
    {
      label: "Total Agency",
      value: stats.agencyUsers || stats.agencyCount || stats.agency || 0,
      icon: icons[12],
    },
  ];

  // Add earnings card from earnings API if available
  if (earningsData && earningsData.totalEarnings !== undefined) {
    cards.push({
      label: "Total Earning",
      value: `₹${earningsData.totalEarnings.toFixed(2)}`,
      icon: icons[13],
    });
  } else {
    // Fallback to existing earnings data
    cards.push({
      label: "Total Earning",
      value: `${stats.totalEarning || stats.earning || 0}₹`,
      icon: icons[13],
    });
  }

  return cards;
}

export default function useDashboardData(icons = []) {
  // Synchronous cache initialization to prevent flicker
  const [cardsData, setCardsData] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.cards) {
          // Map icons immediately if available
          return parsed.cards.map((card, index) => ({
            ...card,
            icon: icons[index]
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to initialize dashboard from cache", e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);
  const iconsRef = useRef(icons);

  // Update iconsRef and cardsData when icons change (if we have cached data)
  useEffect(() => {
    iconsRef.current = icons;
    if (cardsData.length > 0) {
      setCardsData(prev => prev.map((card, index) => ({
        ...card,
        icon: icons[index]
      })));
    }
  }, [icons]);


  const fetchDashboardData = useCallback(async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setLoading(true);
      setError(null);
    }

    try {
      let stats = null;
      let usedFallback = false;

      // 1. Try Aggregate Endpoint
      try {
        const response = await getDashboardStats();
        // Correctly handle the { success, data: { ... } } wrapper
        stats = response?.data || response;

        if (stats && typeof stats === "object" && Object.keys(stats).length > 0) {
          console.log("Dashboard stats loaded from aggregate endpoint");
        }
      } catch (err) {
        console.warn("Dashboard stats endpoint not available, using fallback method");
      }


      // 2. Prepare Earnings Data
      let earningsData = null;
      try {
        const earningsResponse = await getEarningsSummary();
        if (earningsResponse?.success && earningsResponse?.data) {
          earningsData = earningsResponse.data;
        }
      } catch (earningsError) {
        console.warn("Failed to fetch earnings data:", earningsError);
      }

      // 3. Fallback Logic (if aggregate failed)
      if (!stats || typeof stats !== "object" || Object.keys(stats).length === 0) {
        usedFallback = true;
        console.log("Using fallback dashboard data fetching...");

        // Fetch earnings value fallback
        let earningsValue = 0;
        if (earningsData) {
          earningsValue = earningsData.totalEarnings || 0;
        } else {
          try {
            const statsFallback = await getDashboardStats();
            earningsValue = statsFallback?.totalEarning || statsFallback?.earning || statsFallback?.amount || 0;
          } catch (e) { earningsValue = 0; }
        }

        // Parallel Fetching for Count Endpoints
        const [males, females, agencies] = await Promise.all([
          getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=male`),
          getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=female`),
          getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=agency`)
        ]);

        const totalUsers = males + females + agencies;

        const [
          interests, languages, religions, relationGoals,
          faqs, plans, gifts, packages, pages
        ] = await Promise.all([
          getCountByEndpoint(ENDPOINTS.INTERESTS.ROOT),
          getCountByEndpoint(ENDPOINTS.LANGUAGES.ROOT),
          getCountByEndpoint(ENDPOINTS.RELIGIONS.ROOT),
          getCountByEndpoint(ENDPOINTS.RELATION_GOALS.ROOT),
          getCountByEndpoint(ENDPOINTS.FAQS.ROOT),
          getCountByEndpoint(ENDPOINTS.PLANS.ROOT),
          getCountByEndpoint(ENDPOINTS.GIFTS.ROOT),
          getCountByEndpoint(ENDPOINTS.PACKAGES.ROOT),
          getCountByEndpoint(ENDPOINTS.PAGES.ROOT),
        ]);

        stats = {
          interestCount: interests,
          languageCount: languages,
          religionCount: religions,
          relationGoalCount: relationGoals,
          faqCount: faqs,
          planCount: plans,
          totalUsers: totalUsers,
          pageCount: pages,
          giftCount: gifts,
          packageCount: packages,
          maleUsers: males,
          femaleUsers: females,
          agencyUsers: agencies,
          totalEarning: earningsValue
        };
      }

      // FIX: Explicitly check Language count if missing or 0 (Common issue)
      if (stats && (!stats.languageCount && !stats.languages)) {
        try {
          const langCount = await getCountByEndpoint(ENDPOINTS.LANGUAGES.ROOT);
          if (langCount > 0) {
            stats.languageCount = langCount;
          }
        } catch (e) {
          console.warn("Retrying language count failed", e);
        }
      }

      // FIX: Explicitly check Male User count if missing or 0
      if (stats && (!stats.maleUsers && !stats.maleCount)) {
        try {
          const maleCount = await getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=male`);
          if (maleCount > 0) {
            stats.maleUsers = maleCount;
          }
        } catch (e) {
          console.warn("Retrying male user count failed", e);
        }
      }


      // 4. Build Cards
      const cards = buildCardsFromStats(stats, iconsRef.current, earningsData);
      setCardsData(cards);

      // 5. Cache
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ cards, ts: Date.now() }),
        );
      } catch (e) { }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (!isBackgroundRefresh) {
        setError(err?.message || "Failed to load dashboard data");
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  }, []);

  // Initial Load & Background Refresh Trigger
  useEffect(() => {
    let hasData = cardsData.length > 0;
    let isFresh = false;

    // Check if the data we have is fresh
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ts) {
          const age = Date.now() - parsed.ts;
          if (age < CACHE_DURATION) {
            isFresh = true;
          }
        }
      }
    } catch (e) { }

    // Skeleton Loading (only if NO data at all)
    if (!hasData && cardsData.length === 0 && iconsRef.current.length > 0) {
      const skeletonCards = [
        { label: "Interest", value: "...", icon: iconsRef.current[0] },
        { label: "Language", value: "...", icon: iconsRef.current[1] },
        { label: "Religion", value: "...", icon: iconsRef.current[2] },
        { label: "Relation Goal", value: "...", icon: iconsRef.current[3] },
        { label: "FAQ", value: "...", icon: iconsRef.current[4] },
        { label: "Plan", value: "...", icon: iconsRef.current[5] },
        { label: "Total Users", value: "...", icon: iconsRef.current[6] },
        { label: "Total Pages", value: "...", icon: iconsRef.current[7] },
        { label: "Total Gift", value: "...", icon: iconsRef.current[8] },
        { label: "Total Package", value: "...", icon: iconsRef.current[9] },
        { label: "Total Male", value: "...", icon: iconsRef.current[10] },
        { label: "Total Female", value: "...", icon: iconsRef.current[11] },
        { label: "Total Agency", value: "...", icon: iconsRef.current[12] },
        { label: "Total Earning", value: "...", icon: iconsRef.current[13] },
      ];
      setCardsData(skeletonCards);
    }

    // Fetch if no data OR if data is stale
    if (!hasData || !isFresh) {
      if (initializedRef.current) return;
      initializedRef.current = true;
      fetchDashboardData(hasData);
    }
  }, [fetchDashboardData, cardsData.length]);



  // Background Refresh
  useEffect(() => {
    const backgroundRefresh = () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.ts) {
            const age = Date.now() - parsed.ts;
            // Refresh if older than 7 mins
            if (age > 7 * 60 * 1000) {
              fetchDashboardData(true);
            }
          }
        }
      } catch (e) { }
    };

    const intervalId = setInterval(backgroundRefresh, 2 * 60 * 1000);
    const initialTimeout = setTimeout(backgroundRefresh, 30000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(initialTimeout);
    };
  }, [fetchDashboardData]);

  const refresh = () => fetchDashboardData(false);

  return { cardsData, loading, error, refresh };
}
