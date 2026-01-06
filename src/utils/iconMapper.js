// /* ================= ICON MAPPER ================= */

// /* DEFAULT ICON (fallback) */
// export const DEFAULT_ICON =
//   "https://cdn-icons-png.flaticon.com/512/565/565547.png";

// /* INTEREST / HOBBY / SPORT ICONS */
// export const ICON_MAP = {
//   // Interests
//   Drawing: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
//   Crafting: "https://cdn-icons-png.flaticon.com/512/1048/1048940.png",

//   // Hobbies
//   Singing: "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",
//   Chilling: "https://cdn-icons-png.flaticon.com/512/2942/2942838.png",

//   // Sports
//   Cricket: "https://cdn-icons-png.flaticon.com/512/502/502195.png",
//   Volleyball: "https://cdn-icons-png.flaticon.com/512/502/502223.png",

//   // Languages
//   English: "https://cdn-icons-png.flaticon.com/512/197/197374.png",
//   Telugu: "https://cdn-icons-png.flaticon.com/512/197/197419.png",
//   Hindi: "https://cdn-icons-png.flaticon.com/512/197/197571.png",
// };

// /* HELPER FUNCTION */
// export function getIconByName(name) {
//   if (!name) return DEFAULT_ICON;
//   return ICON_MAP[name] || DEFAULT_ICON;
// }





/* ================= ICON MAPPER ================= */

/* DEFAULT ICON (fallback) */
export const DEFAULT_ICON =
  "https://cdn-icons-png.flaticon.com/512/565/565547.png";

/* ICON MAP (KEYS MUST MATCH API TITLES EXACTLY) */
export const ICON_MAP = {
  /* ================= INTERESTS ================= */
  Drawing: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
  Crafting: "https://cdn-icons-png.flaticon.com/512/1048/1048940.png",

  /* ================= HOBBIES ================= */
  Singing: "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",
  Chilling: "https://cdn-icons-png.flaticon.com/512/2942/2942838.png",
  "Watching Series": "https://cdn-icons-png.flaticon.com/512/777/777242.png",
  Movies: "https://cdn-icons-png.flaticon.com/512/2798/2798007.png",

  /* ================= SPORTS ================= */
  Cricket: "https://cdn-icons-png.flaticon.com/512/502/502195.png",
  Football: "https://cdn-icons-png.flaticon.com/512/919/919475.png",
  Volleyball: "https://cdn-icons-png.flaticon.com/512/502/502223.png",

  /* ================= LANGUAGES ================= */
  English: "https://cdn-icons-png.flaticon.com/512/197/197374.png",
  Telugu: "https://cdn-icons-png.flaticon.com/512/197/197419.png",
  Hindi: "https://cdn-icons-png.flaticon.com/512/197/197571.png",

  /* ================= RELATIONSHIP GOALS ================= */
  BestFriends: "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",

  /* ================= FILMS ================= */
  Baahubali: "https://cdn-icons-png.flaticon.com/512/3163/3163508.png",
  "No Films": "https://cdn-icons-png.flaticon.com/512/4076/4076504.png",

  /* ================= MUSIC ================= */
  "2020s": "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",

  /* ================= TRAVEL ================= */
  Hyderabad: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  Mountains: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
};

/* ================= HELPER FUNCTION ================= */
export function getIconByName(name) {
  if (!name) return DEFAULT_ICON;

  // normalize spacing just in case
  const key = name.trim();
  return ICON_MAP[key] || DEFAULT_ICON;
}
