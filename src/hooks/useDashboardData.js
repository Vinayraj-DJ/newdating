import { useEffect, useState, useRef } from "react";
import { ENDPOINTS } from "../config/apiConfig";
import {
  getCountByEndpoint,
  getDashboardStats,
  getUsersCount,
} from "../services/api";
import { getEarningsSummary } from "../services/earningsService";

const CACHE_KEY = "dashboard_cards_v1";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

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

  // Try to read cached cards from sessionStorage to show immediate UI
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Check if cache is still valid (less than 5 minutes old)
        if (parsed && parsed.cards && parsed.ts) {
          const age = Date.now() - parsed.ts;
          if (age < CACHE_DURATION) {
            setCardsData(parsed.cards);
            // Don't show loading if we have fresh cache
            return;
          }
        }
      }
    } catch (e) {
      // ignore cache parse errors
    }
    
    // Pre-load with skeleton data to reduce perceived loading time
    if (cardsData.length === 0 && iconsRef.current.length > 0) {
      const skeletonCards = [
        { label: "Interest", value: "...", icon: iconsRef.current[0] },
        { label: "Language", value: "...", icon: iconsRef.current[1] },
        { label: "Religion", value: "...", icon: iconsRef.current[2] },
        { label: "Relation Goal", value: "...", icon: iconsRef.current[3] },
        { label: "FAQ", value: "...", icon: iconsRef.current[0] },
        { label: "Plan", value: "...", icon: iconsRef.current[1] },
        { label: "Total Users", value: "...", icon: iconsRef.current[2] },
        { label: "Total Pages", value: "...", icon: iconsRef.current[3] },
      ];
      setCardsData(skeletonCards);
    }
  }, []);

  useEffect(() => {
    // Avoid double-fetch during strict mode remounts
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fetchFresh = async () => {
      // Only show loading if we don't have fresh cached data
      const hasFreshCache = (() => {
        try {
          const raw = sessionStorage.getItem(CACHE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.cards && parsed.ts) {
              const age = Date.now() - parsed.ts;
              return age < CACHE_DURATION;
            }
          }
        } catch (e) {
          // ignore cache errors
        }
        return false;
      })();
      
      if (!hasFreshCache) {
        setLoading(true);
      }
      setError(null);
      try {
        let stats = null;
        try {
          stats = await getDashboardStats();
          // If stats is null (404), it will fall through to the else block
        } catch (err) {
          // ignore — fallback to individual endpoints
          console.warn("Dashboard stats endpoint not available, using fallback method");
        }

        if (
          stats &&
          typeof stats === "object" &&
          Object.keys(stats).length > 0
        ) {
          // Try to fetch earnings data
          let earningsData = null;
          try {
            const earningsResponse = await getEarningsSummary();
            if (earningsResponse?.success && earningsResponse?.data) {
              earningsData = earningsResponse.data;
            }
          } catch (earningsError) {
            console.warn("Failed to fetch earnings data:", earningsError);
          }
          
          const cards = buildCardsFromStats(stats, iconsRef.current, earningsData);
          setCardsData(cards);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ cards, ts: Date.now() }),
            );
          } catch (e) {}
        } else {
          // Attempt to get dashboard stats again with specific focus on earnings
          let earningsValue = 0;
          let earningsData = null;
          
          // Try to fetch earnings data from new API
          try {
            const earningsResponse = await getEarningsSummary();
            if (earningsResponse?.success && earningsResponse?.data) {
              earningsData = earningsResponse.data;
              earningsValue = earningsData.totalEarnings || 0;
            }
          } catch (earningsError) {
            console.warn("Failed to fetch earnings data:", earningsError);
            // Fallback to old method
            try {
              const stats = await getDashboardStats();
              earningsValue =
                stats?.totalEarning || stats?.earning || stats?.amount || 0;
            } catch (err) {
              // If dashboard stats still fails, use 0 as fallback
              earningsValue = 0;
            }
          }

          // Fetch user data separately since the combined endpoint might not work
          const [males, females, agencies] = await Promise.all([
            getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=male`),
            getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=female`),
            getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=agency`)
          ]);
          
          const totalUsers = males + females + agencies;
          
          const [
            interests,
            languages,
            religions,
            relationGoals,
            faqs,
            plans,
            gifts,
            packages,
            pages,
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

          const cards = buildCardsFromStats({
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
          }, iconsRef.current, earningsData);
          setCardsData(cards);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ cards, ts: Date.now() }),
            );
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchFresh();
  }, []);

  const refresh = async () => {
    // allow manual refresh (same logic as fetchFresh but simpler)
    setLoading(true);
    setError(null);
    try {
      // Attempt to get dashboard stats again with specific focus on earnings for refresh
      let earningsValue = 0;
      let earningsData = null;
      
      // Try to fetch earnings data from new API
      try {
        const earningsResponse = await getEarningsSummary();
        if (earningsResponse?.success && earningsResponse?.data) {
          earningsData = earningsResponse.data;
          earningsValue = earningsData.totalEarnings || 0;
        }
      } catch (earningsError) {
        console.warn("Failed to fetch earnings data:", earningsError);
        // Fallback to old method
        try {
          const stats = await getDashboardStats();
          // If stats is null (404), earningsValue remains 0
          if (stats) {
            earningsValue =
              stats?.totalEarning || stats?.earning || stats?.amount || 0;
          }
        } catch (err) {
          // If dashboard stats still fails, use 0 as fallback
          earningsValue = 0;
        }
      }

      // Fetch user data separately for refresh
      const [males, females, agencies] = await Promise.all([
        getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=male`),
        getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=female`),
        getCountByEndpoint(`${ENDPOINTS.ADMIN.USERS}?type=agency`)
      ]);
      
      const totalUsers = males + females + agencies;
      
      const [
        interests,
        languages,
        religions,
        relationGoals,
        faqs,
        plans,
        gifts,
        packages,
        pages,
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

      const cards = buildCardsFromStats({
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
      }, iconsRef.current, earningsData);
      setCardsData(cards);
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ cards, ts: Date.now() }),
        );
      } catch (e) {}
      
      // Update cache timestamp
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.cards) {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ cards: parsed.cards, ts: Date.now() })
            );
          }
        }
      } catch (e) {
        // ignore cache update errors
      }
    } catch (err) {
      setError(err?.message || "Failed to refresh dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Update iconsRef when icons change
  useEffect(() => {
    iconsRef.current = icons;
  }, [icons]);
  
  return { cardsData, loading, error, refresh };
}
