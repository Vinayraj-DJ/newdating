// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import OtherInformation from "../../components/OtherInformation/OtherInformation";

// const UserInfo = () => {
//   const { user_id } = useParams();
//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     setUserInfo({
//       name: "Jaysan",
//       profileImage: "https://randomuser.me/api/portraits/men/32.jpg",

//       /* 🔹 REQUIRED FOR OtherInformation */
//       profile_bio: "Love photography and traveling",
//       birth_date: "31st Aug 2001",
//       search_preference: "FEMALE",
//       relationGoal: "WIFE / LIFE PARTNER",
//       gender: "MALE",
//       religionTitle: "HINDU",
//       radius_search: "15.98 KM",
//       wallet: 0,

//       otherPictures: [
//         "https://randomuser.me/api/portraits/men/33.jpg",
//         "https://randomuser.me/api/portraits/men/34.jpg",
//         "https://randomuser.me/api/portraits/men/35.jpg",
//       ],

//       lats: 22.3039,
//       longs: 70.8022,

//       interests: [
//         { id: 1, title: "Photography", img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png" },
//         { id: 2, title: "Drawing", img: "https://cdn-icons-png.flaticon.com/512/3655/3655581.png" },
//         { id: 3, title: "Writing", img: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png" },
//         { id: 4, title: "Live Music", img: "https://cdn-icons-png.flaticon.com/512/727/727245.png" },
//       ],

//       languages: [
//         { id: 1, title: "English", img: "https://cdn-icons-png.flaticon.com/512/197/197374.png" },
//         { id: 2, title: "Hindi", img: "https://cdn-icons-png.flaticon.com/512/197/197426.png" },
//         { id: 3, title: "Gujarati", img: "https://cdn-icons-png.flaticon.com/512/197/197565.png" },
//       ],
//     });
//   }, []);

//   if (!userInfo) return null;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Manager</h2>

//       {/* ROW 1 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>
//           <div className={styles.profileBox}>
//             <img src={userInfo.profileImage} alt="profile" />
//             <span>{userInfo.name}</span>
//           </div>
//         </div>

//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${user_id}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${user_id}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Picture</h4>

//           <div className={styles.otherPics}>
//             <img src={userInfo.profileImage} alt="main" />
//             {userInfo.otherPictures.map((img, i) => (
//               <img key={i} src={img} alt={`other-${i}`} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ROW 2 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Location</h4>
//           <div id="map" className={styles.map}></div>
//         </div>

//         <OtherInformation userInfo={userInfo} />
//       </div>

//       {/* ROW 3 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Interest</h4>
//           <div className={styles.iconList}>
//             {userInfo.interests.map((i) => (
//               <div key={i.id} className={styles.iconItem}>
//                 <img src={i.img} alt={i.title} />
//                 <span>{i.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Languages Known</h4>
//           <div className={styles.iconList}>
//             {userInfo.languages.map((l) => (
//               <div key={l.id} className={styles.iconItem}>
//                 <img src={l.img} alt={l.title} />
//                 <span>{l.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* GOOGLE MAP */}
//       <script
//         async
//         defer
//         src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`}
//       ></script>
//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//           function initMap() {
//             const pos = { lat: ${userInfo.lats}, lng: ${userInfo.longs} };
//             const map = new google.maps.Map(document.getElementById("map"), {
//               zoom: 10,
//               center: pos,
//             });
//             new google.maps.Marker({ position: pos, map });
//           }
//         `,
//         }}
//       />
//     </div>
//   );
// };

// export default UserInfo;










import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import { useNavigate, useParams } from "react-router-dom";
import OtherInformation from "../../components/OtherInformation/OtherInformation";

const UserInfo = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo({
      /* BASIC INFO */
      id: "69565c6f5c62df453d46c215",
      name: "John Doe",
      firstName: "John",
      lastName: "Doe",
      email: "ravi12@gmail.com",
      mobileNumber: "9999999999",

      /* PROFILE */
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      profile_bio: "Hello I am interested",
      gender: "MALE",
      birth_date: "01 Jan 1995",
      height: "180 cm",

      /* SEARCH & RELATION */
      search_preference: "BOTH",
      relationGoal: "LIFE PARTNER",
      religionTitle: "HINDU",

      /* STATUS */
      status: "ACTIVE",
      isVerified: true,
      profileCompleted: false,

      /* WALLET */
      wallet: 0,
      walletBalance: 0,
      coinBalance: 0,

      /* REFERRAL */
      referralCode: "2DB3C72B",

      /* DATES */
      createdAt: "01 Jan 2026",
      updatedAt: "01 Jan 2026",

      /* IMAGES */
      otherPictures: [
        "https://randomuser.me/api/portraits/men/33.jpg",
        "https://randomuser.me/api/portraits/men/34.jpg",
        "https://randomuser.me/api/portraits/men/35.jpg",
      ],

      /* LOCATION */
      lats: 22.3039,
      longs: 70.8022,

      /* INTERESTS */
      interests: [
        {
          id: 1,
          title: "Photography",
          img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
        },
        {
          id: 2,
          title: "Music",
          img: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
        },
      ],

      /* LANGUAGES */
      languages: [
        {
          id: 1,
          title: "English",
          img: "https://cdn-icons-png.flaticon.com/512/197/197374.png",
        },
        {
          id: 2,
          title: "Hindi",
          img: "https://cdn-icons-png.flaticon.com/512/197/197426.png",
        },
      ],
    });
  }, []);

  if (!userInfo) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>User Info Manager</h2>

      {/* ROW 1 */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>My Profile</h4>
          <div className={styles.profileBox}>
            <img src={userInfo.profileImage} alt="profile" />
            <span>{userInfo.name}</span>
          </div>

          <p><b>Email:</b> {userInfo.email}</p>
          <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
          <p><b>Height:</b> {userInfo.height}</p>
          <p><b>Status:</b> {userInfo.status}</p>
          <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
          <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
        </div>

        <div className={`${styles.card} ${styles.otherPictureCard}`}>
          <div className={styles.floatingActions}>
            <button
              className={styles.walletBtn}
              onClick={() => navigate(`/wallet/${user_id}`)}
            >
              Wallet Operation
            </button>
            <button
              className={styles.coinBtn}
              onClick={() => navigate(`/coin/${user_id}`)}
            >
              Coin Operation
            </button>
            {/* Alternative buttons if userType is known (commented for now, can be used if needed)
            <button
              className={styles.walletBtn}
              onClick={() => navigate(`/wallet/male/${user_id}`)}
            >
              Wallet Operation (Male)
            </button>
            <button
              className={styles.coinBtn}
              onClick={() => navigate(`/coin/male/${user_id}`)}
            >
              Coin Operation (Male)
            </button>
            */}
          </div>

          <h4 className={styles.cardTitle}>Other Picture</h4>

          <div className={styles.otherPics}>
            <img src={userInfo.profileImage} alt="main" />
            {userInfo.otherPictures.map((img, i) => (
              <img key={i} src={img} alt={`other-${i}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Location</h4>
          <div id="map" className={styles.map}></div>
        </div>

        <OtherInformation userInfo={userInfo} />
      </div>

      {/* ROW 3 */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Interest</h4>
          <div className={styles.iconList}>
            {userInfo.interests.map((i) => (
              <div key={i.id} className={styles.iconItem}>
                <img src={i.img} alt={i.title} />
                <span>{i.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Languages Known</h4>
          <div className={styles.iconList}>
            {userInfo.languages.map((l) => (
              <div key={l.id} className={styles.iconItem}>
                <img src={l.img} alt={l.title} />
                <span>{l.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;












// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import OtherInformation from "../../components/OtherInformation/OtherInformation";
// import { getUserDetails } from "../../services/adminUserService";

// const UserInfo = () => {
//   const { type: userType, id: userId } = useParams(); // matches route :type/:id
//   console.log("PARAMS 👉", { userType, userId });

//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const controller = new AbortController();

//     async function loadUser() {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log("USER TYPE 👉", userType);
//         console.log("USER ID 👉", userId);

//         const data = await getUserDetails(userType, userId, {
//           signal: controller.signal,
//         });

//         console.log("USER DETAILS RESPONSE:", data);

//         if (!data) {
//           throw new Error("User not found");
//         }

//         setUserInfo(data);
//       } catch (err) {
//         console.error("❌ USER INFO ERROR:", err);
//         console.error("Error response:", err.response);
        
//         // Show a more descriptive error message
//         let errorMessage = "Failed to load user information";
//         if (err.response?.status === 404) {
//           errorMessage = "User not found";
//         } else if (err.response?.status === 401) {
//           errorMessage = "Unauthorized access. Please login again.";
//         } else if (err.response?.status === 500) {
//           errorMessage = "Server error. Please try again later.";
//         } else if (err.message.includes("Network Error")) {
//           errorMessage = "Network error. Please check your connection.";
//         }
        
//         setError(errorMessage);
//         setUserInfo(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (userId) loadUser();
//     return () => controller.abort();
//   }, [userId, userType]);

//   /* ---------- UI STATES ---------- */
//   if (loading) {
//     return <div className={styles.loading}>Loading user information…</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   if (!userInfo) {
//     return <div className={styles.error}>No user information found</div>;
//   }

//   /* ---------- RENDER ---------- */
//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Manager</h2>

//       {/* ROW 1 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.images?.[0] || ""}
//               alt="profile"
//             />
//             <span>
//               {userInfo.firstName} {userInfo.lastName}
//             </span>
//           </div>

//           <p><b>Email:</b> {userInfo.email || 'N/A'}</p>
//           <p><b>Mobile:</b> {userInfo.mobileNumber || 'N/A'}</p>
//           <p><b>Gender:</b> {userInfo.gender || 'N/A'}</p>
//           <p><b>Status:</b> {userInfo.status || 'N/A'}</p>
//           <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
//           <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
//         </div>

//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Pictures</h4>
//           <div className={styles.otherPics}>
//             {(userInfo.images || []).map((img, i) => (
//               <img key={i} src={img} alt={`img-${i}`} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ROW 2 */}
//       <div className={styles.row}>
//         <OtherInformation userInfo={userInfo} />
//       </div>
//     </div>
//   );
// };

// export default UserInfo;
