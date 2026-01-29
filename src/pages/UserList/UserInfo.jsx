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
//       /* BASIC INFO */
//       id: "69565c6f5c62df453d46c215",
//       name: "John Doe",
//       firstName: "John",
//       lastName: "Doe",
//       email: "ravi12@gmail.com",
//       mobileNumber: "9999999999",

//       /* PROFILE */
//       profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
//       profile_bio: "Hello I am interested",
//       gender: "MALE",
//       birth_date: "01 Jan 1995",
//       height: "180 cm",

//       /* SEARCH & RELATION */
//       search_preference: "BOTH",
//       relationGoal: "LIFE PARTNER",
//       religionTitle: "HINDU",

//       /* STATUS */
//       status: "ACTIVE",
//       isVerified: true,
//       profileCompleted: false,

//       /* WALLET */
//       wallet: 0,
//       walletBalance: 0,
//       coinBalance: 0,

//       /* REFERRAL */
//       referralCode: "2DB3C72B",

//       /* DATES */
//       createdAt: "01 Jan 2026",
//       updatedAt: "01 Jan 2026",

//       /* IMAGES */
//       otherPictures: [
//         "https://randomuser.me/api/portraits/men/33.jpg",
//         "https://randomuser.me/api/portraits/men/34.jpg",
//         "https://randomuser.me/api/portraits/men/35.jpg",
//       ],

//       /* LOCATION */
//       lats: 22.3039,
//       longs: 70.8022,

//       /* INTERESTS */
//       interests: [
//         {
//           id: 1,
//           title: "Photography",
//           img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
//         },
//         {
//           id: 2,
//           title: "Music",
//           img: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
//         },
//       ],

//       /* LANGUAGES */
//       languages: [
//         {
//           id: 1,
//           title: "English",
//           img: "https://cdn-icons-png.flaticon.com/512/197/197374.png",
//         },
//         {
//           id: 2,
//           title: "Hindi",
//           img: "https://cdn-icons-png.flaticon.com/512/197/197426.png",
//         },
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

//           <p><b>Email:</b> {userInfo.email}</p>
//           <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
//           <p><b>Height:</b> {userInfo.height}</p>
//           <p><b>Status:</b> {userInfo.status}</p>
//           <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
//           <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
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
//             {/* Alternative buttons if userType is known (commented for now, can be used if needed)
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/male/${user_id}`)}
//             >
//               Wallet Operation (Male)
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/male/${user_id}`)}
//             >
//               Coin Operation (Male)
//             </button>
//             */}
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
//     </div>
//   );
// };

// export default UserInfo;

























// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import OtherInformation from "../../components/OtherInformation/OtherInformation";
// import { getUserByIdFromList } from "../../services/usersService";

// const UserInfo = () => {
//   const { type: userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserByIdFromList(
//           { userType, userId },
//           { signal: controller.signal }
//         );

//         setUserInfo(data);
//       } catch (err) {
//         if (err.name !== "CanceledError") {
//           setError(err.message || "Failed to load user");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => controller.abort();
//   }, [userType, userId]);

//   if (loading) return <div className={styles.loading}>Loading…</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!userInfo) return null;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Manager</h2>

//       {/* ROW 1 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.images?.[0] || "https://via.placeholder.com/150"}
//               alt="profile"
//             />
//             <span>{userInfo.name}</span>
//           </div>

//           <p><b>Email:</b> {userInfo.email || "N/A"}</p>
//           <p><b>Status:</b> {userInfo.status}</p>
//           <p><b>User Type:</b> {userInfo.userType}</p>
//         </div>

//         <div className={styles.card}>
//           <button
//             className={styles.walletBtn}
//             onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//           >
//             Wallet Operation
//           </button>

//           <button
//             className={styles.coinBtn}
//             onClick={() => navigate(`/coin/${userType}/${userId}`)}
//           >
//             Coin Operation
//           </button>
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















// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import OtherInformation from "../../components/OtherInformation/OtherInformation";
// import { getUserDetails } from "../../services/usersService";

// const UserInfo = () => {
//   const { userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserDetails(
//           userType,
//           userId,
//           { signal: controller.signal }
//         );

//         // Process the user data to match the expected format
//         const processedData = {
//           id: data._id || data.id,
//           name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name || 'N/A',
//           firstName: data.firstName || '',
//           lastName: data.lastName || '',
//           email: data.email || 'N/A',
//           mobileNumber: data.mobileNumber || data.mobile || 'N/A',
//           // Handle images - can be an array of IDs or URLs
//           profileImage: Array.isArray(data.images) && data.images.length > 0 ? 
//             (typeof data.images[0] === 'string' ? data.images[0] : data.images[0]?._id || data.images[0]?.url || data.images[0]) : null,
//           profile_bio: data.bio || 'No bio provided',
//           gender: data.gender || 'N/A',
//           birth_date: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A',
//           height: data.height ? `${data.height}${data.height.includes('cm') ? '' : ' cm'}` : 'N/A',
//           search_preference: data.searchPreferences || 'N/A',
//           // Handle relationshipGoals - can be array of IDs or objects
//           relationGoal: Array.isArray(data.relationshipGoals) && data.relationshipGoals.length > 0 ? 
//             (typeof data.relationshipGoals[0] === 'object' ? data.relationshipGoals[0].name || data.relationshipGoals[0].title || 'N/A' : data.relationshipGoals[0]) : 'N/A',
//           // Handle religion - can be ID or object
//           religionTitle: typeof data.religion === 'object' ? data.religion.name || data.religion.title || 'N/A' : data.religion || 'N/A',
//           status: data.status || 'N/A',
//           isVerified: data.isVerified || false,
//           profileCompleted: data.profileCompleted || false,
//           wallet: data.walletBalance || 0,
//           walletBalance: data.walletBalance || 0,
//           coinBalance: data.coinBalance || 0,
//           balance: data.balance || 0,
//           referralCode: data.referralCode || 'N/A',
//           createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
//           updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A',
//           // Handle images array properly
//           otherPictures: Array.isArray(data.images) ? 
//             data.images.map(img => typeof img === 'string' ? img : (img?.url || img?._id || img)) : [],
//           lats: data.location?.lat || 0,
//           longs: data.location?.lng || 0,
//           // Handle interests - can be array of IDs or objects
//           interests: Array.isArray(data.interests) ? data.interests.map((interest, index) => ({
//             id: index,
//             title: typeof interest === 'object' ? interest.name || interest.title || 'N/A' : interest || 'N/A',
//             img: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png' // default icon
//           })) : [],
//           // Handle languages - can be array of IDs or objects
//           languages: Array.isArray(data.languages) ? data.languages.map((language, index) => ({
//             id: index,
//             title: typeof language === 'object' ? language.name || language.title || 'N/A' : language || 'N/A',
//             img: 'https://cdn-icons-png.flaticon.com/512/197/197374.png' // default icon
//           })) : [],
//           // Handle hobbies array
//           hobbies: Array.isArray(data.hobbies) ? data.hobbies.map(hobby => 
//             typeof hobby === 'object' ? hobby.name || hobby.title || hobby : hobby) : [],
//           // Handle sports array
//           sports: Array.isArray(data.sports) ? data.sports.map(sport => 
//             typeof sport === 'object' ? sport.name || sport.title || sport : sport) : [],
//           // Handle film array
//           film: Array.isArray(data.film) ? data.film.map(film => 
//             typeof film === 'object' ? film.name || film.title || film : film) : [],
//           // Handle music array
//           music: Array.isArray(data.music) ? data.music.map(music => 
//             typeof music === 'object' ? music.name || music.title || music : music) : [],
//           // Handle travel array
//           travel: Array.isArray(data.travel) ? data.travel.map(travel => 
//             typeof travel === 'object' ? travel.name || travel.title || travel : travel) : [],
//           // Additional fields from API
//           isActive: data.isActive,
//           favourites: data.favourites || [],
//           following: data.malefollowing || data.femalefollowing || [],
//           followers: data.malefollowers || data.femalefollowers || [],
//         };

//         setUserInfo(processedData);
//       } catch (err) {
//         // ✅ Ignore React 18 dev-mode cancel
//         if (
//           err?.name === "CanceledError" ||
//           err?.code === "ERR_CANCELED"
//         ) {
//           return;
//         }

//         console.error("USER INFO ERROR:", err);
//         setError("Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();

//     return () => {
//       controller.abort(); // ✅ correct cleanup
//     };
//   }, [userType, userId]);

//   /* ================= UI STATES ================= */

//   if (loading) {
//     return <div className={styles.loading}>Loading user information…</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   if (!userInfo) {
//     return <div className={styles.error}>No user data found</div>;
//   }

//   /* ================= RENDER ================= */

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Manager</h2>

//       {/* ROW 1 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>
//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.profileImage || "https://via.placeholder.com/150"}
//               alt="profile"
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/150";
//               }}
//             />
//             <span>{userInfo.name}</span>
//           </div>

//           <p><b>First Name:</b> {userInfo.firstName}</p>
//           <p><b>Last Name:</b> {userInfo.lastName}</p>
//           <p><b>Email:</b> {userInfo.email}</p>
//           <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
//           <p><b>Gender:</b> {userInfo.gender}</p>
//           <p><b>Date of Birth:</b> {userInfo.birth_date}</p>
//           <p><b>Height:</b> {userInfo.height}</p>
//           <p><b>Status:</b> {userInfo.status}</p>
//           <p><b>Active:</b> {userInfo.isActive ? "Yes" : "No"}</p>
//           <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
//           <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
//           <p><b>Referral Code:</b> {userInfo.referralCode}</p>
//           <p><b>Balance:</b> {userInfo.balance}</p>
//           <p><b>Wallet Balance:</b> {userInfo.walletBalance}</p>
//           <p><b>Coin Balance:</b> {userInfo.coinBalance}</p>
//           <p><b>Created:</b> {userInfo.createdAt}</p>
//           <p><b>Updated:</b> {userInfo.updatedAt}</p>
//         </div>

//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userType}/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Pictures</h4>
//           <div className={styles.otherPics}>
//             {userInfo.otherPictures && userInfo.otherPictures.length > 0 ? (
//               userInfo.otherPictures.map((img, i) => (
//                 <img 
//                   key={i} 
//                   src={img} 
//                   alt={`img-${i}`} 
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                   }}
//                 />
//               ))
//             ) : (
//               <p>No additional pictures</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROW 2 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Location</h4>
//           <div id="map" className={styles.map}></div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Other Information</h4>
//           <p><b>Bio:</b> {userInfo.profile_bio}</p>
//           <p><b>Search Preference:</b> {userInfo.search_preference}</p>
//           <p><b>Relationship Goal:</b> {userInfo.relationGoal}</p>
//           <p><b>Religion:</b> {userInfo.religionTitle}</p>
//           <p><b>Favourites:</b> {userInfo.favourites?.length || 0}</p>
//           <p><b>Following:</b> {userInfo.following?.length || 0}</p>
//           <p><b>Followers:</b> {userInfo.followers?.length || 0}</p>
//         </div>
//       </div>

//       {/* ROW 3 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Interests</h4>
//           <div className={styles.iconList}>
//             {userInfo.interests && userInfo.interests.length > 0 ? (
//               userInfo.interests.map((i) => (
//                 <div key={i.id} className={styles.iconItem}>
//                   <img src={i.img} alt={i.title} />
//                   <span>{i.title}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No interests listed</p>
//             )}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Languages Known</h4>
//           <div className={styles.iconList}>
//             {userInfo.languages && userInfo.languages.length > 0 ? (
//               userInfo.languages.map((l) => (
//                 <div key={l.id} className={styles.iconItem}>
//                   <img src={l.img} alt={l.title} />
//                   <span>{l.title}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No languages listed</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROW 4 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Hobbies</h4>
//           <div className={styles.iconList}>
//             {userInfo.hobbies && userInfo.hobbies.length > 0 ? (
//               userInfo.hobbies.map((hobby, index) => (
//                 <div key={index} className={styles.iconItem}>
//                   <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={hobby} />
//                   <span>{hobby}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No hobbies listed</p>
//             )}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Sports</h4>
//           <div className={styles.iconList}>
//             {userInfo.sports && userInfo.sports.length > 0 ? (
//               userInfo.sports.map((sport, index) => (
//                 <div key={index} className={styles.iconItem}>
//                   <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={sport} />
//                   <span>{sport}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No sports listed</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROW 5 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Film</h4>
//           <div className={styles.iconList}>
//             {userInfo.film && userInfo.film.length > 0 ? (
//               userInfo.film.map((film, index) => (
//                 <div key={index} className={styles.iconItem}>
//                   <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={film} />
//                   <span>{film}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No films listed</p>
//             )}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Music</h4>
//           <div className={styles.iconList}>
//             {userInfo.music && userInfo.music.length > 0 ? (
//               userInfo.music.map((music, index) => (
//                 <div key={index} className={styles.iconItem}>
//                   <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={music} />
//                   <span>{music}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No music listed</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROW 6 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Travel</h4>
//           <div className={styles.iconList}>
//             {userInfo.travel && userInfo.travel.length > 0 ? (
//               userInfo.travel.map((travel, index) => (
//                 <div key={index} className={styles.iconItem}>
//                   <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={travel} />
//                   <span>{travel}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No travel destinations listed</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;












// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserDetails } from "../../services/usersService";

// const UserInfo = () => {
//   const { userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserDetails(userType, userId, {
//           signal: controller.signal,
//         });

//         /* ✅ IMAGE FIX ONLY (ALL OTHER DATA SAME) */
//         const processedData = {
//           ...data,

//           profileImage:
//             Array.isArray(data.images) && data.images.length > 0
//               ? data.images[0]?.imageUrl
//               : data.image || null,

//           otherPictures:
//             Array.isArray(data.images)
//               ? data.images.map((img) => img?.imageUrl).filter(Boolean)
//               : [],
//         };

//         setUserInfo(processedData);
//       } catch (err) {
//         if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
//         console.error(err);
//         setError("Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => controller.abort();
//   }, [userType, userId]);

//   if (loading) return <div className={styles.loading}>Loading user information…</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!userInfo) return <div className={styles.error}>No user data found</div>;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Manager</h2>

//       {/* ROW 1 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.profileImage || "https://via.placeholder.com/150"}
//               alt="profile"
//               onError={(e) =>
//                 (e.target.src = "https://via.placeholder.com/150")
//               }
//             />
//             <span>{userInfo.name || `${userInfo.firstName || ""} ${userInfo.lastName || ""}`}</span>
//           </div>

//           <p><b>Email:</b> {userInfo.email}</p>
//           <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
//           <p><b>Gender:</b> {userInfo.gender}</p>
//           <p><b>Status:</b> {userInfo.status}</p>
//           <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
//           <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
//           <p><b>Referral Code:</b> {userInfo.referralCode}</p>
//           <p><b>Wallet Balance:</b> {userInfo.walletBalance}</p>
//           <p><b>Coin Balance:</b> {userInfo.coinBalance}</p>
//         </div>

//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userType}/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Pictures</h4>

//           <div className={styles.otherPics}>
//             {userInfo.otherPictures.length > 0 ? (
//               userInfo.otherPictures.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   alt={`img-${i}`}
//                   onError={(e) => (e.target.style.display = "none")}
//                 />
//               ))
//             ) : (
//               <p>No additional pictures</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROW 2 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Other Information</h4>
//           <p><b>Bio:</b> {userInfo.bio}</p>
//           <p><b>Search Preference:</b> {userInfo.searchPreferences}</p>
//           <p><b>Religion:</b> {userInfo.religion?.title}</p>
//           <p><b>Followers:</b> {userInfo.followers?.length || 0}</p>
//           <p><b>Following:</b> {userInfo.malefollowing?.length || userInfo.femalefollowing?.length || 0}</p>
//         </div>
//       </div>

//       {/* ROW 3 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Interests</h4>
//           <div className={styles.iconList}>
//             {userInfo.interests?.map((i) => (
//               <div key={i._id} className={styles.iconItem}>
//                 <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={i.title} />
//                 <span>{i.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Languages</h4>
//           <div className={styles.iconList}>
//             {userInfo.languages?.map((l) => (
//               <div key={l._id} className={styles.iconItem}>
//                 <img src="https://cdn-icons-png.flaticon.com/512/197/197374.png" alt={l.title} />
//                 <span>{l.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ROW 4 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Hobbies</h4>
//           <div className={styles.iconList}>
//             {userInfo.hobbies?.map((h) => (
//               <div key={h._id} className={styles.iconItem}>
//                 <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={h.name} />
//                 <span>{h.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Sports</h4>
//           <div className={styles.iconList}>
//             {userInfo.sports?.map((s) => (
//               <div key={s._id} className={styles.iconItem}>
//                 <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt={s.name} />
//                 <span>{s.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ROW 5 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Film</h4>
//           <div className={styles.iconList}>
//             {userInfo.film?.map((f) => (
//               <div key={f._id} className={styles.iconItem}>
//                 <span>{f.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Music</h4>
//           <div className={styles.iconList}>
//             {userInfo.music?.map((m) => (
//               <div key={m._id} className={styles.iconItem}>
//                 <span>{m.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ROW 6 */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Travel</h4>
//           <div className={styles.iconList}>
//             {userInfo.travel?.map((t) => (
//               <div key={t._id} className={styles.iconItem}>
//                 <span>{t.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;














// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserDetails } from "../../services/usersService";

// const UserInfo = () => {
//   const { userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserDetails(userType, userId, {
//           signal: controller.signal,
//         });

//         /* ✅ IMAGE + NAME FIX ONLY */
//         const processedData = {
//           ...data,

//           profileImage:
//             Array.isArray(data.images) && data.images.length > 0
//               ? data.images[0]?.imageUrl
//               : data.image || null,

//           otherPictures:
//             Array.isArray(data.images)
//               ? data.images.map((img) => img?.imageUrl).filter(Boolean)
//               : [],

//           displayName:
//             data.name ||
//             `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
//             "—",
//         };

//         setUserInfo(processedData);
//       } catch (err) {
//         if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
//         console.error(err);
//         setError("Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => controller.abort();
//   }, [userType, userId]);

//   if (loading) return <div className={styles.loading}>Loading…</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!userInfo) return null;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Management</h2>

//       {/* ================= ROW 1 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.profileImage || "https://via.placeholder.com/150"}
//               alt="profile"
//               onError={(e) =>
//                 (e.target.src = "https://via.placeholder.com/150")
//               }
//             />
//             <span className={styles.profileName}>
//               {userInfo.displayName}
//             </span>
//           </div>

//           <p><b>Email:</b> {userInfo.email}</p>
//           <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
//           <p><b>Gender:</b> {userInfo.gender}</p>
//           <p><b>Status:</b> {userInfo.status}</p>
//           <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
//           <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
//           <p><b>KYC Status:</b> {userInfo.kycStatus || "N/A"}</p>
//           <p><b>Wallet Balance:</b> ₹{userInfo.walletBalance}</p>
//           <p><b>Coin Balance:</b> {userInfo.coinBalance}</p>
//         </div>

//         {/* ================= OTHER PICTURES ================= */}
//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userType}/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Picture</h4>

//           <div className={styles.otherPics}>
//             {userInfo.otherPictures.length > 0 ? (
//               userInfo.otherPictures.map((img, i) => (
//                 <img key={i} src={img} alt={`img-${i}`} />
//               ))
//             ) : (
//               <p>No additional pictures</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= ROW 2 ================= */}
//       <div className={styles.row}>
//         {/* LOCATION (SEPARATE CARD) */}
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Location</h4>

//           {userInfo.latitude && userInfo.longitude ? (
//             <iframe
//               title="User Location"
//               width="100%"
//               height="260"
//               frameBorder="0"
//               style={{ borderRadius: "14px" }}
//               src={`https://www.google.com/maps?q=${userInfo.latitude},${userInfo.longitude}&z=14&output=embed`}
//             />
//           ) : (
//             <p>Location not available</p>
//           )}
//         </div>

//         {/* OTHER INFORMATION */}
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Other Information</h4>

//           <p><b>Profile Bio:</b> {userInfo.bio}</p>
//           <p><b>Birth Date:</b> {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toDateString() : "N/A"}</p>
//           <p><b>Search Preference:</b> {userInfo.searchPreferences}</p>
//           <p><b>Relation Goal:</b> {userInfo.relationshipGoals?.[0]?.title || "N/A"}</p>
//           <p><b>Religion:</b> {userInfo.religion?.title || "N/A"}</p>
//         </div>
//       </div>

//       {/* ================= ROW 3 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Interests</h4>
//           <div className={styles.iconList}>
//             {userInfo.interests?.map((i) => (
//               <div key={i._id} className={styles.iconItem}>
//                 <span>{i.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Languages</h4>
//           <div className={styles.iconList}>
//             {userInfo.languages?.map((l) => (
//               <div key={l._id} className={styles.iconItem}>
//                 <span>{l.title}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= ROW 4 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Hobbies</h4>
//           <div className={styles.iconList}>
//             {userInfo.hobbies?.map((h) => (
//               <div key={h._id} className={styles.iconItem}>
//                 <span>{h.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Sports</h4>
//           <div className={styles.iconList}>
//             {userInfo.sports?.map((s) => (
//               <div key={s._id} className={styles.iconItem}>
//                 <span>{s.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= ROW 5 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Film</h4>
//           {userInfo.film?.map((f) => (
//             <p key={f._id}>{f.name}</p>
//           ))}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Music</h4>
//           {userInfo.music?.map((m) => (
//             <p key={m._id}>{m.name}</p>
//           ))}
//         </div>
//       </div>

//       {/* ================= ROW 6 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Travel</h4>
//           {userInfo.travel?.map((t) => (
//             <p key={t._id}>{t.name}</p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;











// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserDetails } from "../../services/usersService";

// const UserInfo = () => {
//   const { userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserDetails(userType, userId, {
//           signal: controller.signal,
//         });

//         /* ✅ IMAGE + FEMALE NAME FIX (ONLY) */
//         const processedData = {
//           ...data,

//           profileImage:
//             Array.isArray(data.images) && data.images.length > 0
//               ? data.images[0]?.imageUrl
//               : data.image || null,

//           otherPictures: Array.isArray(data.images)
//             ? data.images.map((img) => img?.imageUrl).filter(Boolean)
//             : [],

//           displayName: (() => {
//             if (typeof data.name === "string" && data.name.trim()) {
//               return data.name.trim(); // ✅ female name
//             }

//             const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
//             if (fullName) {
//               return fullName; // ✅ male name
//             }

//             return "—";
//           })(),
//         };

//         setUserInfo(processedData);
//       } catch (err) {
//         if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
//         setError("Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => controller.abort();
//   }, [userType, userId]);

//   if (loading) return <div className={styles.loading}>Loading…</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!userInfo) return null;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Management</h2>

//       {/* ================= ROW 1 ================= */}
//       <div className={styles.row}>
//         {/* ===== MY PROFILE (IMAGE + NAME ONLY) ===== */}
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.profileImage || "https://via.placeholder.com/150"}
//               alt="profile"
//               onError={(e) =>
//                 (e.target.src = "https://via.placeholder.com/150")
//               }
//             />
//             <span className={styles.profileName}>
//               {userInfo.displayName}
//             </span>
//           </div>
//         </div>

//         {/* ===== OTHER PICTURES ===== */}
//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userType}/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Picture</h4>

//           <div className={styles.otherPics}>
//             {userInfo.otherPictures.length > 0 ? (
//               userInfo.otherPictures.map((img, i) => (
//                 <img key={i} src={img} alt={`img-${i}`} />
//               ))
//             ) : (
//               <p>No additional pictures</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= ROW 2 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Location</h4>
//           {userInfo.latitude && userInfo.longitude ? (
//             <iframe
//               title="User Location"
//               width="100%"
//               height="260"
//               frameBorder="0"
//               style={{ borderRadius: "14px" }}
//               src={`https://www.google.com/maps?q=${userInfo.latitude},${userInfo.longitude}&z=14&output=embed`}
//             />
//           ) : (
//             <p>Location not available</p>
//           )}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Other Information</h4>
//           <p><b>Profile Bio:</b> {userInfo.bio}</p>
//           <p><b>Birth Date:</b> {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toDateString() : "N/A"}</p>
//           <p><b>Search Preference:</b> {userInfo.searchPreferences}</p>
//           <p><b>Relation Goal:</b> {userInfo.relationshipGoals?.[0]?.title || "N/A"}</p>
//           <p><b>Religion:</b> {userInfo.religion?.title || "N/A"}</p>
//         </div>
//       </div>

//       {/* ================= ROW 3 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Interests</h4>
//           {userInfo.interests?.map((i) => (
//             <p key={i._id}>{i.title}</p>
//           ))}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Languages</h4>
//           {userInfo.languages?.map((l) => (
//             <p key={l._id}>{l.title}</p>
//           ))}
//         </div>
//       </div>

//       {/* ================= ROW 4 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Hobbies</h4>
//           {userInfo.hobbies?.map((h) => (
//             <p key={h._id}>{h.name}</p>
//           ))}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Sports</h4>
//           {userInfo.sports?.map((s) => (
//             <p key={s._id}>{s.name}</p>
//           ))}
//         </div>
//       </div>

//       {/* ================= ROW 5 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Film</h4>
//           {userInfo.film?.map((f) => (
//             <p key={f._id}>{f.name}</p>
//           ))}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Music</h4>
//           {userInfo.music?.map((m) => (
//             <p key={m._id}>{m.name}</p>
//           ))}
//         </div>
//       </div>

//       {/* ================= ROW 6 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Travel</h4>
//           {userInfo.travel?.map((t) => (
//             <p key={t._id}>{t.name}</p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;






// import React, { useEffect, useState } from "react";
// import styles from "./UserInfo.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserDetails } from "../../services/usersService";
// import { getIconByName } from "../../utils/iconMapper";

// const UserInfo = () => {
//   const { userType, id: userId } = useParams();
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchUser() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getUserDetails(userType, userId, {
//           signal: controller.signal,
//         });

//         const processedData = {
//           ...data,

//           profileImage:
//             Array.isArray(data.images) && data.images.length > 0
//               ? data.images[0]?.imageUrl
//               : data.image || null,

//           otherPictures: Array.isArray(data.images)
//             ? data.images.map((img) => img?.imageUrl).filter(Boolean)
//             : [],

//           displayName: (() => {
//             if (typeof data.name === "string" && data.name.trim()) {
//               return data.name.trim();
//             }

//             const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
//             if (fullName) {
//               return fullName;
//             }

//             return "—";
//           })(),
//         };

//         setUserInfo(processedData);
//       } catch (err) {
//         if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
//         setError("Failed to load user information");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => controller.abort();
//   }, [userType, userId]);

//   if (loading) return <div className={styles.loading}>Loading…</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!userInfo) return null;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.pageTitle}>User Info Management</h2>

//       {/* ================= ROW 1 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>My Profile</h4>

//           <div className={styles.profileBox}>
//             <img
//               src={userInfo.profileImage || "https://via.placeholder.com/150"}
//               alt="profile"
//               onError={(e) =>
//                 (e.target.src = "https://via.placeholder.com/150")
//               }
//             />
//             <span className={styles.profileName}>
//               {userInfo.displayName}
//             </span>
//           </div>
//         </div>

//         <div className={`${styles.card} ${styles.otherPictureCard}`}>
//           <div className={styles.floatingActions}>
//             <button
//               className={styles.walletBtn}
//               onClick={() => navigate(`/wallet/${userType}/${userId}`)}
//             >
//               Wallet Operation
//             </button>
//             <button
//               className={styles.coinBtn}
//               onClick={() => navigate(`/coin/${userType}/${userId}`)}
//             >
//               Coin Operation
//             </button>
//           </div>

//           <h4 className={styles.cardTitle}>Other Picture</h4>

//           <div className={styles.otherPics}>
//             {userInfo.otherPictures.length > 0 ? (
//               userInfo.otherPictures.map((img, i) => (
//                 <img key={i} src={img} alt={`img-${i}`} />
//               ))
//             ) : (
//               <p>No additional pictures</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= ROW 2 ================= */}
//       <div className={styles.row}>
//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Location</h4>
//           {userInfo.latitude && userInfo.longitude ? (
//             <iframe
//               title="User Location"
//               width="100%"
//               height="260"
//               frameBorder="0"
//               style={{ borderRadius: "14px" }}
//               src={`https://www.google.com/maps?q=${userInfo.latitude},${userInfo.longitude}&z=14&output=embed`}
//             />
//           ) : (
//             <p>Location not available</p>
//           )}
//         </div>

//         <div className={styles.card}>
//           <h4 className={styles.cardTitle}>Other Information</h4>
//           <p><b>Profile Bio:</b> {userInfo.bio}</p>
//           <p><b>Birth Date:</b> {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toDateString() : "N/A"}</p>
//           <p><b>Search Preference:</b> {userInfo.searchPreferences}</p>
//           <p><b>Relation Goal:</b> {userInfo.relationshipGoals?.[0]?.title || "N/A"}</p>
//           <p><b>Religion:</b> {userInfo.religion?.title || "N/A"}</p>
//         </div>
//       </div>

//        {/* ================= INTERESTS ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Interests</h4>
//         <div className={styles.iconList}>
//           {userInfo.interests?.map((i) => (
//             <div key={i._id} className={styles.iconItem}>
//               <img src={getIconByName(i.title)} alt={i.title} />
//               <span>{i.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= LANGUAGES ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Languages</h4>
//         <div className={styles.iconList}>
//           {userInfo.languages?.map((l) => (
//             <div key={l._id} className={styles.iconItem}>
//               <img src={getIconByName(l.title)} alt={l.title} />
//               <span>{l.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= HOBBIES ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Hobbies</h4>
//         <div className={styles.iconList}>
//           {userInfo.hobbies?.map((h) => (
//             <div key={h._id} className={styles.iconItem}>
//               <img src={getIconByName(h.name)} alt={h.name} />
//               <span>{h.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= SPORTS ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Sports</h4>
//         <div className={styles.iconList}>
//           {userInfo.sports?.map((s) => (
//             <div key={s._id} className={styles.iconItem}>
//               <img src={getIconByName(s.name)} alt={s.name} />
//               <span>{s.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= FILM ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Film</h4>
//         <div className={styles.iconList}>
//           {userInfo.film?.map((f) => (
//             <div key={f._id} className={styles.iconItem}>
//               <img src={getIconByName(f.name)} alt={f.name} />
//               <span>{f.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= MUSIC ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Music</h4>
//         <div className={styles.iconList}>
//           {userInfo.music?.map((m) => (
//             <div key={m._id} className={styles.iconItem}>
//               <img src={getIconByName(m.name)} alt={m.name} />
//               <span>{m.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= TRAVEL ================= */}
//       <div className={styles.card}>
//         <h4 className={styles.cardTitle}>Travel</h4>
//         <div className={styles.iconList}>
//           {userInfo.travel?.map((t) => (
//             <div key={t._id} className={styles.iconItem}>
//               <img src={getIconByName(t.name)} alt={t.name} />
//               <span>{t.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;
























import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetails } from "../../services/usersService";
import { getIconByName } from "../../utils/iconMapper";

const UserInfo = () => {
  const { userType, id: userId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        setLoading(true);
        setError("");

        const data = await getUserDetails(userType, userId, {
          signal: controller.signal,
        });

        const processedData = {
          ...data,
          profileImage:
            Array.isArray(data.images) && data.images.length > 0
              ? data.images[0]?.imageUrl
              : data.image || null,
          otherPictures: Array.isArray(data.images)
            ? data.images.map((img) => img?.imageUrl).filter(Boolean)
            : [],
          displayName:
            data.name?.trim() ||
            `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
            "—",
          // Additional fields that might not be in the original data
          password: data.password || "Hidden",
          favourites: data.favourites || [],
          malefollowing: data.malefollowing || [],
          malefollowers: data.malefollowers || [],
          balance: data.balance || 0,
          walletBalance: data.walletBalance || 0,
          coinBalance: data.coinBalance || 0,
          isVerified: data.isVerified || false,
          isActive: data.isActive || false,
          profileCompleted: data.profileCompleted || false,
          reviewStatus: data.reviewStatus || "pending",
          referralCode: data.referralCode || "N/A",
          referredBy: data.referredBy || [],
          gender: data.gender || "N/A",
          height: data.height || "N/A",
          mobileNumber: data.mobileNumber || data.mobile || "N/A",
        };

        setUserInfo(processedData);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort();
  }, [userType, userId]);

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!userInfo) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>User Info Management</h2>

      {/* ================= ROW 1 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>My Profile</h4>
          <div className={styles.profileBox}>
            <img
              src={userInfo.profileImage || "https://via.placeholder.com/150"}
              alt="profile"
            />
            <span>{userInfo.displayName}</span>
          </div>

          <p><b>Email:</b> {userInfo.email}</p>
          <p><b>Mobile:</b> {userInfo.mobileNumber}</p>
          <p><b>Gender:</b> {userInfo.gender}</p>
          <p><b>Status:</b> {userInfo.status}</p>
          <p><b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
          <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
          <p><b>Password:</b> ••••••••</p>
          <p><b>Referral Code:</b> {userInfo.referralCode}</p>
          <p><b>Wallet Balance:</b> ₹{userInfo.walletBalance}</p>
          <p><b>Coin Balance:</b> {userInfo.coinBalance}</p>
        </div>

        <div className={`${styles.card} ${styles.otherPictureCard}`}>
          <div className={styles.floatingActions}>
            <button
              className={styles.walletBtn}
              onClick={() => navigate(`/wallet/${userType}/${userId}`)}
            >
              Wallet Operation
            </button>
            <button
              className={styles.coinBtn}
              onClick={() => navigate(`/coin/${userType}/${userId}`)}
            >
              Coin Operation
            </button>
          </div>

          <h4 className={styles.cardTitle}>Other Picture</h4>
          <div className={styles.otherPics}>
            {userInfo.otherPictures.length > 0 ? (
              userInfo.otherPictures.map((img, i) => (
                <img key={i} src={img} alt={`img-${i}`} />
              ))
            ) : (
              <p>No additional pictures</p>
            )}
          </div>
        </div>
      </div>

      {/* ================= ROW 2 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Location</h4>
          {userInfo.latitude && userInfo.longitude ? (
            <iframe
              title="User Location"
              width="100%"
              height="260"
              frameBorder="0"
              style={{ borderRadius: "14px" }}
              src={`https://www.google.com/maps?q=${userInfo.latitude},${userInfo.longitude}&z=14&output=embed`}
            />
          ) : (
            <p>Location not available</p>
          )}
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Other Information</h4>
          <p><b>Profile Bio:</b> {userInfo.bio}</p>
          <p><b>Birth Date:</b> {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toDateString() : "N/A"}</p>
          <p><b>Height:</b> {userInfo.height}</p>
          <p><b>Gender:</b> {userInfo.gender}</p>
          <p><b>Mobile Number:</b> {userInfo.mobileNumber}</p>
          <p><b>Search Preference:</b> {userInfo.searchPreferences}</p>
          <p><b>Relation Goal:</b> {userInfo.relationshipGoals?.[0]?.title || "N/A"}</p>
          <p><b>Religion:</b> {userInfo.religion?.title || "N/A"}</p>
          <p><b>Balance:</b> {userInfo.balance}</p>
          <p><b>Wallet Balance:</b> {userInfo.walletBalance}</p>
          <p><b>Coin Balance:</b> {userInfo.coinBalance}</p>
          <p><b>Is Verified:</b> {userInfo.isVerified ? "Yes" : "No"}</p>
          <p><b>Is Active:</b> {userInfo.isActive ? "Yes" : "No"}</p>
          <p><b>Profile Completed:</b> {userInfo.profileCompleted ? "Yes" : "No"}</p>
          <p><b>Review Status:</b> {userInfo.reviewStatus}</p>
          <p><b>Referral Code:</b> {userInfo.referralCode}</p>
          <p><b>Favourites:</b> {userInfo.favourites?.length || 0}</p>
          <p><b>Following:</b> {userInfo.malefollowing?.length || 0}</p>
          <p><b>Followers:</b> {userInfo.malefollowers?.length || 0}</p>
          <p><b>Referred By:</b> {userInfo.referredBy?.length || 0}</p>
        </div>
      </div>

      {/* ================= ROW 3 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Interests</h4>
          <div className={styles.iconList}>
            {userInfo.interests?.map((i) => (
              <div key={i._id} className={styles.iconItem}>
                <img src={getIconByName(i.title)} alt={i.title} />
                <span>{i.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Languages</h4>
          <div className={styles.iconList}>
            {userInfo.languages?.map((l) => (
              <div key={l._id} className={styles.iconItem}>
                <img src={getIconByName(l.title)} alt={l.title} />
                <span>{l.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ROW 4 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Hobbies</h4>
          <div className={styles.iconList}>
            {userInfo.hobbies?.map((h) => (
              <div key={h._id} className={styles.iconItem}>
                <img src={getIconByName(h.name)} alt={h.name} />
                <span>{h.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Sports</h4>
          <div className={styles.iconList}>
            {userInfo.sports?.map((s) => (
              <div key={s._id} className={styles.iconItem}>
                <img src={getIconByName(s.name)} alt={s.name} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ROW 5 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Film</h4>
          <div className={styles.iconList}>
            {userInfo.film?.map((f) => (
              <div key={f._id} className={styles.iconItem}>
                <img src={getIconByName(f.name)} alt={f.name} />
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Music</h4>
          <div className={styles.iconList}>
            {userInfo.music?.map((m) => (
              <div key={m._id} className={styles.iconItem}>
                <img src={getIconByName(m.name)} alt={m.name} />
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ROW 6 ================= */}
      <div className={styles.row}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Travel</h4>
          <div className={styles.iconList}>
            {userInfo.travel?.map((t) => (
              <div key={t._id} className={styles.iconItem}>
                <img src={getIconByName(t.name)} alt={t.name} />
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserInfo;
