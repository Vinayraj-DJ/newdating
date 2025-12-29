import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import { useParams, useNavigate } from "react-router-dom";
import OtherInformation from "../../components/OtherInformation/OtherInformation";
import { getUserById } from "../../services/api";
import CustomToast from "../../components/CustomToast/CustomToast";

const UserInfo = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = await getUserById(user_id);
        
        if (!user) {
          throw new Error("User not found");
        }

        // Normalize user data from API response
        const normalizedUser = {
          id: user._id || user.id,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || "Unknown",
          profile_bio: user.bio || user.profileBio || "",
          birth_date: user.dob || user.birthDate || "",
          search_preference: user.searchPreference || user.preferredGender || "",
          relationGoal: {
            title: user.relationGoalTitle || "Not specified",
            subtitle: user.relationGoalSubtitle || "",
          },
          gender: user.userType || user.gender || "",
          religionTitle: user.religionTitle || user.religion || "",
          radius_search: user.radiusSearch || 0,
          wallet: user.walletBalance || user.coins || 0,
          is_subscribe: user.isPremium || user.isSubscribed || false,
          plan_title: user.planTitle || user.planName || "Free",
          plan_start_date: user.planStartDate || "",
          plan_end_date: user.planEndDate || "",
          interests: Array.isArray(user.interests) ? user.interests : [],
          languages: Array.isArray(user.languages) ? user.languages : [],
          otherPictures: Array.isArray(user.images) ? user.images : [user.profileImage || user.image || ""],
          lats: user.latitude || 0,
          longs: user.longitude || 0,
        };

        setUserInfo(normalizedUser);
      } catch (err) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to load user data";
        setError(errorMessage);
        setToast({
          type: "error",
          message: errorMessage,
        });
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchUserData();
    }
  }, [user_id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>User Info Management</h2>
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          ⏳ Loading user data...
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className={styles.container}>
        <h2>User Info Management</h2>
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          color: "#d32f2f",
          backgroundColor: "#ffebee",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          ⚠️ {error || "User not found"}
        </div>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Go Back
        </button>
        {toast && (
          <CustomToast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  const interests = userInfo.interests || [];
  const languages = userInfo.languages || [];
  const pictures = userInfo.otherPictures || [];

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className={styles.container}>
      <h2>User Info Management</h2>

      <div className={styles.header}>
        <div className={styles.profileCard}>
          <h5>My Profile</h5>
          <img src={pictures[0]} alt="profile" className={styles.profileImg} />
          <h4>{userInfo.name}</h4>
        </div>

        <div className={styles.mapCard}>
          <h5>Location</h5>
          <div id="map" className={styles.map}></div>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button
          onClick={() => navigate(`/wallet/${user_id}`)}
          className={styles.walletBtn}
        >
          Wallet Operation
        </button>
        <button
          onClick={() => navigate(`/coin/${user_id}`)}
          className={styles.coinBtn}
        >
          Coin Operation
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h5>Other Pictures</h5>
          <div className={styles.picList}>
            {pictures.map((img, i) => (
              <img key={i} src={img} alt={`user-pic-${i}`} />
            ))}
          </div>
        </div>

        {/* ✅ Using dynamic OtherInformation component */}
        <OtherInformation userInfo={userInfo} />

        {userInfo.is_subscribe && (
          <div className={styles.card}>
            <h5>
              Plan Information{" "}
              <span className={styles.planBadge}>
                {userInfo.plan_title} Membership
              </span>
            </h5>
            <p>
              <b>Start Date:</b> {formatDate(userInfo.plan_start_date)}
            </p>
            <p>
              <b>End Date:</b> {formatDate(userInfo.plan_end_date)}
            </p>
          </div>
        )}

        <div className={styles.card}>
          <h5>Interest</h5>
          <div className={styles.iconList}>
            {interests.map((int) => (
              <div key={int.id} className={styles.iconItem}>
                <img src={int.img} alt={int.title} />
                <span>{int.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h5>Languages Known</h5>
          <div className={styles.iconList}>
            {languages.map((lang) => (
              <div key={lang.id} className={styles.iconItem}>
                <img src={lang.img} alt={lang.title} />
                <span>{lang.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Map Script */}
      <script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          function initMap() {
            const userLatLng = { lat: ${userInfo.lats}, lng: ${userInfo.longs} };
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 8,
              center: userLatLng
            });
            new google.maps.Marker({
              position: userLatLng,
              map: map,
              title: '${userInfo.name} Location'
            });
          }
        `,
        }}
      />
      
      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UserInfo;



// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useParams, useNavigate } from "react-router-dom";
// import { getUserById } from "../../services/usersService";
// import OtherInformation from "../../components/OtherInformation/OtherInformation";
// import { showCustomToast } from "../../components/CustomToast/CustomToast";


// const UserInfo = () => {
//   const { user_id } = useParams();
//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch user info from API
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         setLoading(true);
//         const response = await getUserById(user_id);
//         const user = response?.data ?? response;

//         if (!user || !user._id) throw new Error("User not found");

//         // ✅ Normalize fields (backend may differ)
//         const normalizedUser = {
//           id: user._id,
//           name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "—",
//           profile_bio: user.bio || "No bio available",
//           birth_date: user.dateOfBirth || "—",
//           search_preference: user.searchPreferences || "—",
//           relationGoal: {
//             title: user.relationshipGoals?.[0]?.title || "—",
//             subtitle: user.relationshipGoals?.[0]?.subtitle || "",
//           },
//           gender: user.gender || "—",
//           religionTitle: user.religionTitle || "—",
//           radius_search: user.radius_search || 0,
//           wallet: user.walletBalance ?? 0,
//           is_subscribe: !!user.subscribed,
//           plan_title: user.plan || "Not Subscribe",
//           plan_start_date: user.startDate || null,
//           plan_end_date: user.expiryDate || null,
//           interests: Array.isArray(user.interests)
//             ? user.interests.map((i) => ({
//                 id: i._id || i.id,
//                 title: i.title || i.name || "—",
//                 img: i.icon || "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
//               }))
//             : [],
//           languages: Array.isArray(user.languages)
//             ? user.languages.map((l) => ({
//                 id: l._id || l.id,
//                 title: l.title || l.name || "—",
//                 img: l.icon || "https://cdn-icons-png.flaticon.com/512/197/197374.png",
//               }))
//             : [],
//           otherPictures: Array.isArray(user.images)
//             ? user.images
//             : [user.image || "https://via.placeholder.com/60x60"],
//           lats: user.latitude || 17.385,
//           longs: user.longitude || 78.4867,
//         };

//         setUserInfo(normalizedUser);
//       } catch (err) {
//         console.error("Failed to fetch user info:", err);
//         showCustomToast(err?.message || "Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//   }, [user_id]);

//   if (loading) return <div className={styles.loading}>Loading user info...</div>;
//   if (!userInfo) return <div className={styles.error}>User not found</div>;

//   const formatDate = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleDateString("en-US", {
//           day: "numeric",
//           month: "short",
//           year: "numeric",
//         })
//       : "—";

//   return (
//     <div className={styles.container}>
//       <h2>User Info Management</h2>

//       <div className={styles.header}>
//         <div className={styles.profileCard}>
//           <h5>My Profile</h5>
//           <img
//             src={userInfo.otherPictures[0]}
//             alt="profile"
//             className={styles.profileImg}
//           />
//           <h4>{userInfo.name}</h4>
//           <p>{userInfo.profile_bio}</p>
//         </div>

//         <div className={styles.mapCard}>
//           <h5>Location</h5>
//           <div id="map" className={styles.map}></div>
//         </div>
//       </div>

//       <div className={styles.buttonRow}>
//         <button
//           onClick={() => navigate(`/wallet/${user_id}`)}
//           className={styles.walletBtn}
//         >
//           Wallet Operation
//         </button>
//         <button
//           onClick={() => navigate(`/coin/${user_id}`)}
//           className={styles.coinBtn}
//         >
//           Coin Operation
//         </button>
//       </div>

//       <div className={styles.grid}>
//         <div className={styles.card}>
//           <h5>Other Pictures</h5>
//           <div className={styles.picList}>
//             {userInfo.otherPictures.map((img, i) => (
//               <img key={i} src={img} alt={`user-pic-${i}`} />
//             ))}
//           </div>
//         </div>

//         {/* ✅ Dynamic Other Information Section */}
//         <OtherInformation userInfo={userInfo} />

//         {userInfo.is_subscribe && (
//           <div className={styles.card}>
//             <h5>
//               Plan Information{" "}
//               <span className={styles.planBadge}>
//                 {userInfo.plan_title} Membership
//               </span>
//             </h5>
//             <p>
//               <b>Start Date:</b> {formatDate(userInfo.plan_start_date)}
//             </p>
//             <p>
//               <b>End Date:</b> {formatDate(userInfo.plan_end_date)}
//             </p>
//           </div>
//         )}

//         <div className={styles.card}>
//           <h5>Interests</h5>
//           <div className={styles.iconList}>
//             {userInfo.interests.map((int) => (
//               <div key={int.id} className={styles.iconItem}>
//                 <img src={int.img} alt={int.title} />
//                 <span>{int.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h5>Languages Known</h5>
//           <div className={styles.iconList}>
//             {userInfo.languages.map((lang) => (
//               <div key={lang.id} className={styles.iconItem}>
//                 <img src={lang.img} alt={lang.title} />
//                 <span>{lang.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Google Maps Integration */}
//       <script
//         async
//         defer
//         src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`}
//       ></script>
//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//           function initMap() {
//             const userLatLng = { lat: ${userInfo.lats}, lng: ${userInfo.longs} };
//             const map = new google.maps.Map(document.getElementById('map'), {
//               zoom: 10,
//               center: userLatLng
//             });
//             new google.maps.Marker({
//               position: userLatLng,
//               map: map,
//               title: '${userInfo.name}'
//             });
//           }
//         `,
//         }}
//       />
//     </div>
//   );
// };

// export default UserInfo;
