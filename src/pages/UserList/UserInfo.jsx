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
            data.fullName?.trim() ||
            `${data.firstName || data.first_name || ""} ${data.lastName || data.last_name || ""}`.trim() ||
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
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
          return;
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

      <div className={styles.columnLayout}>
        <div className={styles.leftColumn}>
          <div className={`${styles.card} ${styles.profileCard}`}>
            <h4 className={styles.cardTitle}>My Profile</h4>
            <div className={styles.profileBox}>
              <img
                src={userInfo.profileImage || "https://via.placeholder.com/150"}
                alt="profile"
              />
              <span>{userInfo.displayName}</span>
            </div>

            <p>
              <b>Email:</b> {userInfo.email}
            </p>
            <p>
              <b>Mobile:</b> {userInfo.mobileNumber}
            </p>
            <p>
              <b>Gender:</b> {userInfo.gender}
            </p>
            <p>
              <b>Status:</b> {userInfo.status}
            </p>
            <p>
              <b>Verified:</b> {userInfo.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <b>Profile Completed:</b>{" "}
              {userInfo.profileCompleted ? "Yes" : "No"}
            </p>
            <p>
              <b>Password:</b> ••••••••
            </p>
            <p>
              <b>Referral Code:</b> {userInfo.referralCode}
            </p>
            <p>
              <b>Wallet Balance:</b> ₹{userInfo.walletBalance}
            </p>
            <p>
              <b>Coin Balance:</b> {userInfo.coinBalance}
            </p>
          </div>

          <div className={`${styles.card} ${styles.locationCard}`}>
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

          <div className={`${styles.card} ${styles.interestsCard}`}>
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

          <div className={`${styles.card} ${styles.hobbiesCard}`}>
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

          <div className={`${styles.card} ${styles.filmCard}`}>
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

          <div className={`${styles.card} ${styles.travelCard}`}>
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

        <div className={styles.rightColumn}>
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

          <div className={`${styles.card} ${styles.otherInfoCard}`}>
            <h4 className={styles.cardTitle}>Other Information</h4>
            <p>
              <b>Profile Bio:</b> {userInfo.bio}
            </p>
            <p>
              <b>Birth Date:</b>{" "}
              {userInfo.dateOfBirth
                ? new Date(userInfo.dateOfBirth).toDateString()
                : "N/A"}
            </p>
            <p>
              <b>Height:</b> {userInfo.height}
            </p>
            <p>
              <b>Gender:</b> {userInfo.gender}
            </p>
            <p>
              <b>Mobile Number:</b> {userInfo.mobileNumber}
            </p>
            <p>
              <b>Search Preference:</b> {userInfo.searchPreferences}
            </p>
            <p>
              <b>Relation Goal:</b>{" "}
              {userInfo.relationshipGoals?.[0]?.title || "N/A"}
            </p>
            <p>
              <b>Religion:</b> {userInfo.religion?.title || "N/A"}
            </p>

            <p>
              <b>Is Verified:</b> {userInfo.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <b>Is Active:</b> {userInfo.isActive ? "Yes" : "No"}
            </p>
            <p>
              <b>Profile Completed:</b>{" "}
              {userInfo.profileCompleted ? "Yes" : "No"}
            </p>
            <p>
              <b>Review Status:</b> {userInfo.reviewStatus}
            </p>
            <p>
              <b>Referral Code:</b> {userInfo.referralCode}
            </p>
            <p>
              <b>Favourites:</b> {userInfo.favourites?.length || 0}
            </p>
            <p>
              <b>Following:</b> {userInfo.malefollowing?.length || 0}
            </p>
            <p>
              <b>Followers:</b> {userInfo.malefollowers?.length || 0}
            </p>
            <p>
              <b>Referred By:</b>{" "}
              {userInfo.referredBy && userInfo.referredBy.length > 0
                ? userInfo.referredBy
                  .map(
                    (ref) =>
                      ref.name ||
                      ref.displayName ||
                      ref.firstName ||
                      ref.email ||
                      "User"
                  )
                  .join(", ")
                : "N/A"}
            </p>
          </div>

          <div className={`${styles.card} ${styles.languagesCard}`}>
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

          <div className={`${styles.card} ${styles.sportsCard}`}>
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

          <div className={`${styles.card} ${styles.musicCard}`}>
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
      </div>
    </div>
  );
};

export default UserInfo;
