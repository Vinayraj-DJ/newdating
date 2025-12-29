import { useEffect, useState, useRef } from "react";
import { ENDPOINTS } from "../config/apiConfig";
import { getCountByEndpoint, getDashboardStats, getUsersCount } from "../services/api";

const CACHE_KEY = "dashboard_cards_v1";

function buildCardsFromStats(stats, icons) {
  return [
    { label: "Interest", value: stats.interestCount || stats.interests || 0, icon: icons[0] },
    { label: "Language", value: stats.languageCount || stats.languages || 0, icon: icons[1] },
    { label: "Religion", value: stats.religionCount || stats.religions || 0, icon: icons[2] },
    { label: "Relation Goal", value: stats.relationGoalCount || stats.relationGoals || 0, icon: icons[3] },
    { label: "FAQ", value: stats.faqCount || stats.faqs || 0, icon: icons[0] },
    { label: "Plan", value: stats.planCount || stats.plans || 0, icon: icons[1] },
    { label: "Total Users", value: stats.totalUsers || stats.usersTotal || 0, icon: icons[2] },
    { label: "Total Pages", value: stats.pageCount || stats.pages || 0, icon: icons[3] },
    { label: "Total Gift", value: stats.giftCount || stats.gifts || 0, icon: icons[0] },
    { label: "Total Package", value: stats.packageCount || stats.packages || 0, icon: icons[1] },
    { label: "Total Male", value: stats.maleUsers || stats.maleCount || 0, icon: icons[2] },
    { label: "Total Female", value: stats.femaleUsers || stats.femaleCount || 0, icon: icons[3] },
    { label: "Total Fake User", value: stats.fakeUsers || stats.fakeCount || 0, icon: icons[0] },
    { label: "Total Earning", value: `${stats.totalEarning || stats.earning || 0}₹`, icon: icons[3] },
  ];
}

export default function useDashboardData(icons = []) {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  // Try to read cached cards from sessionStorage to show immediate UI
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.cards) {
          setCardsData(parsed.cards);
        }
      }
    } catch (e) {
      // ignore cache parse errors
    }
  }, []);

  useEffect(() => {
    // Avoid double-fetch during strict mode remounts
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fetchFresh = async () => {
      setLoading(true);
      setError(null);
      try {
        let stats = null;
        try {
          stats = await getDashboardStats();
        } catch (err) {
          // ignore — fallback to individual endpoints
        }

        if (stats && typeof stats === "object" && Object.keys(stats).length > 0) {
          const cards = buildCardsFromStats(stats, icons);
          setCardsData(cards);
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ cards, ts: Date.now() })); } catch(e) {}
        } else {
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
            userCounts,
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
            getUsersCount(),
          ]);

          const cards = [
            { label: "Interest", value: interests, icon: icons[0] },
            { label: "Language", value: languages, icon: icons[1] },
            { label: "Religion", value: religions, icon: icons[2] },
            { label: "Relation Goal", value: relationGoals, icon: icons[3] },
            { label: "FAQ", value: faqs, icon: icons[0] },
            { label: "Plan", value: plans, icon: icons[1] },
            { label: "Total Users", value: userCounts.total, icon: icons[2] },
            { label: "Total Pages", value: pages, icon: icons[3] },
            { label: "Total Gift", value: gifts, icon: icons[0] },
            { label: "Total Package", value: packages, icon: icons[1] },
            { label: "Total Male", value: userCounts.male, icon: icons[2] },
            { label: "Total Female", value: userCounts.female, icon: icons[3] },
            { label: "Total Fake User", value: 0, icon: icons[0] },
            { label: "Total Earning", value: "0₹", icon: icons[3] },
          ];
          setCardsData(cards);
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ cards, ts: Date.now() })); } catch(e) {}
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchFresh();
  }, [icons]);

  const refresh = async () => {
    // allow manual refresh (same logic as fetchFresh but simpler)
    setLoading(true);
    setError(null);
    try {
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
        userCounts,
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
        getUsersCount(),
      ]);

      const cards = [
        { label: "Interest", value: interests, icon: icons[0] },
        { label: "Language", value: languages, icon: icons[1] },
        { label: "Religion", value: religions, icon: icons[2] },
        { label: "Relation Goal", value: relationGoals, icon: icons[3] },
        { label: "FAQ", value: faqs, icon: icons[0] },
        { label: "Plan", value: plans, icon: icons[1] },
        { label: "Total Users", value: userCounts.total, icon: icons[2] },
        { label: "Total Pages", value: pages, icon: icons[3] },
        { label: "Total Gift", value: gifts, icon: icons[0] },
        { label: "Total Package", value: packages, icon: icons[1] },
        { label: "Total Male", value: userCounts.male, icon: icons[2] },
        { label: "Total Female", value: userCounts.female, icon: icons[3] },
        { label: "Total Fake User", value: 0, icon: icons[0] },
        { label: "Total Earning", value: "0₹", icon: icons[3] },
      ];
      setCardsData(cards);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ cards, ts: Date.now() })); } catch(e) {}
    } catch (err) {
      setError(err?.message || "Failed to refresh dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return { cardsData, loading, error, refresh };
}
