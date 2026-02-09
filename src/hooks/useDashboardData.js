import { useEffect, useState, useRef, useCallback } from "react";
import { ENDPOINTS } from "../config/apiConfig";
import {
  getCountByEndpoint,
  getDashboardStats,
} from "../services/api";
import { getEarningsSummary } from "../services/earningsService";

const CACHE_KEY = "dashboard_cards_v1";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

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
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);
  const iconsRef = useRef(icons);

  // Update iconsRef when icons change
  useEffect(() => {
    iconsRef.current = icons;
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
        stats = await getDashboardStats();
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
      if (!stats.languageCount && !stats.languages) {
        try {
          const langCount = await getCountByEndpoint(ENDPOINTS.LANGUAGES.ROOT);
          if (langCount > 0) {
            stats.languageCount = langCount;
          }
        } catch (e) {
          console.warn("Retrying language count failed", e);
        }
      }

      // 4. Build Cards
      const cards = buildCardsFromStats(stats, iconsRef.current, earningsData);
      setCardsData(cards);

      // 5. Cache
      try {
        sessionStorage.setItem(
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

  // Initial Load & Cache Check
  useEffect(() => {
    const loadDataStrategy = () => {
      let hasData = false;
      let isFresh = false;

      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.cards) {
            // 1. Always load available cache (Stale-While-Revalidate)
            const cardsWithDataIcons = parsed.cards.map((card, index) => ({
              ...card,
              icon: iconsRef.current[index]
            }));
            setCardsData(cardsWithDataIcons);
            hasData = true;

            // 2. Check freshness
            if (parsed.ts) {
              const age = Date.now() - parsed.ts;
              if (age < CACHE_DURATION) {
                isFresh = true;
              }
            }
          }
        }
      } catch (e) { }

      return { hasData, isFresh };
    };

    const { hasData, isFresh } = loadDataStrategy();

    // Skeleton Loading (only if NO data at all)
    if (!hasData && cardsData.length === 0 && iconsRef.current.length > 0) {
      const skeletonCards = [
        { label: "Interest", value: "Loading...", icon: iconsRef.current[0] },
        { label: "Language", value: "Loading...", icon: iconsRef.current[1] },
        { label: "Religion", value: "Loading...", icon: iconsRef.current[2] },
        { label: "Relation Goal", value: "Loading...", icon: iconsRef.current[3] },
        { label: "FAQ", value: "Loading...", icon: iconsRef.current[4] },
        { label: "Plan", value: "Loading...", icon: iconsRef.current[5] },
        { label: "Total Users", value: "Loading...", icon: iconsRef.current[6] },
        { label: "Total Pages", value: "Loading...", icon: iconsRef.current[7] },
        { label: "Total Gift", value: "Loading...", icon: iconsRef.current[8] },
        { label: "Total Package", value: "Loading...", icon: iconsRef.current[9] },
        { label: "Total Male", value: "Loading...", icon: iconsRef.current[10] },
        { label: "Total Female", value: "Loading...", icon: iconsRef.current[11] },
        { label: "Total Agency", value: "Loading...", icon: iconsRef.current[12] },
        { label: "Total Earning", value: "Loading...", icon: iconsRef.current[13] },
      ];
      setCardsData(skeletonCards);
    }

    // Fetch if no data OR if data is stale
    if (!hasData || !isFresh) {
      if (initializedRef.current) return;
      initializedRef.current = true;
      fetchDashboardData(hasData);
    }
  }, [fetchDashboardData]);

  // Background Refresh
  useEffect(() => {
    const backgroundRefresh = () => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
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
