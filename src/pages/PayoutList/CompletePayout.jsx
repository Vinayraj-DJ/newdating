// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { payoutService } from "../../services/payoutService";
// import { toast } from "react-toastify";
// import InterestUpload from "../../components/InterestUpload/InterestUpload";
// import Button from "../../components/Button/Button";
// import styles from "./CompletePayout.module.css";

// const CompletePayout = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [payoutDetails, setPayoutDetails] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPayoutDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await payoutService.getAllPayouts();
//         if (response && Array.isArray(response.data)) {
//           const payout = response.data.find(item => item._id === id);
//           if (payout) {
//             setPayoutDetails(payout);
//           } else {
//             toast.error('Payout not found');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching payout details:', error);
//         toast.error(error.response?.data?.message || 'Failed to load payout details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayoutDetails();
//   }, [id]);

//   const handleComplete = async () => {
//     if (!uploadedImage) {
//       toast.error("Please upload proof of payment before completing.");
//       return;
//     }

//     if (!window.confirm('Are you sure you want to mark this payout as completed? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       // Show loading state
//       setLoading(true);
//       await payoutService.completePayout(id);
//       setIsCompleted(true);
//       toast.success("Payout completed successfully!");
//       // Optionally redirect after a delay
//       setTimeout(() => {
//         navigate("/payoutlist");
//       }, 2000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to complete payout");
//       console.error("Error completing payout:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoBack = () => {
//     navigate("/payoutlist");
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Complete Payout Request #{id}</h2>

//       <div className={styles.card}>
//         {loading ? (
//           <div className={styles.loadingState}>
//             <div className={styles.spinner}></div>
//             <p>Loading payout details...</p>
//           </div>
//         ) : payoutDetails ? (
//           <>
//             <div className={styles.payoutInfo}>
//               <h3>Payout Details</h3>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>User Type:</span>
//                 <span className={styles.value}>{payoutDetails.userType || '-'}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>User Email:</span>
//                 <span className={styles.value}>{payoutDetails.userDetails?.email || '-'}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Coins Requested:</span>
//                 <span className={styles.value}>{payoutDetails.coinsRequested || '-'}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Amount (₹):</span>
//                 <span className={styles.value}>₹{payoutDetails.amountInRupees || 0}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Status:</span>
//                 <span className={`${styles.value} ${styles[`status-${payoutDetails.status}`]}`}>
//                   {payoutDetails.status || '-'}
//                 </span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Payout Method:</span>
//                 <span className={styles.value}>{payoutDetails.payoutMethod || '-'}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Account Holder:</span>
//                 <span className={styles.value}>{payoutDetails.payoutDetails?.accountHolderName || '-'}</span>
//               </div>
//               <div className={styles.infoRow}>
//                 <span className={styles.label}>Account Number:</span>
//                 <span className={styles.value}>{payoutDetails.payoutDetails?.accountNumber || '-'}</span>
//               </div>
//             </div>
            
//             <p>Please upload proof of payment to complete this payout request.</p>
            
//             <InterestUpload
//               label="Payout Proof"
//               id="payout-upload"
//               onChange={(file) => setUploadedImage(file)}
//             />

//             <div className={styles.buttonWrapper}>
//               <Button 
//                 onClick={handleComplete} 
//                 disabled={loading}
//               >
//                 {loading ? 'Completing...' : 'Complete Payout'}
//               </Button>
//               <Button variant="secondary" onClick={handleGoBack}>
//                 Go Back
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className={styles.errorState}>
//             <p>Payout details not found.</p>
//             <Button variant="secondary" onClick={handleGoBack}>
//               Go Back
//             </Button>
//           </div>
//         )}

//         {isCompleted && (
//           <div className={styles.successMessage}>
//             ✅ Payout completed successfully!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompletePayout;










import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { payoutService } from "../../services/payoutService";
import { toast } from "react-toastify";
import InterestUpload from "../../components/InterestUpload/InterestUpload";
import Button from "../../components/Button/Button";
import styles from "./CompletePayout.module.css";

const CompletePayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayoutDetails = async () => {
      setLoading(true);
      try {
        const response = await payoutService.getAllPayouts();

        // ✅ FIX: correct API response handling
        const payoutList = response?.data?.data;

        if (Array.isArray(payoutList)) {
          const payout = payoutList.find(item => item._id === id);
          if (payout) {
            setPayoutDetails(payout);
          } else {
            toast.error("Payout not found");
          }
        } else {
          toast.error("Invalid payout data");
        }
      } catch (error) {
        console.error("Error fetching payout details:", error);
        toast.error(
          error.response?.data?.message || "Failed to load payout details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutDetails();
  }, [id]);

  const handleComplete = async () => {
    if (!uploadedImage) {
      toast.error("Please upload proof of payment before completing.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to mark this payout as completed? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await payoutService.completePayout(id);
      setIsCompleted(true);
      toast.success("Payout completed successfully!");

      setTimeout(() => {
        navigate("/payoutlist");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete payout"
      );
      console.error("Error completing payout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/payoutlist");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Complete Payout Request #{id}</h2>

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading payout details...</p>
          </div>
        ) : payoutDetails ? (
          <>
            <div className={styles.payoutInfo}>
              <h3>Payout Details</h3>

              <div className={styles.infoRow}>
                <span className={styles.label}>User Type:</span>
                <span className={styles.value}>
                  {payoutDetails.userType || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>User Email:</span>
                <span className={styles.value}>
                  {payoutDetails.userDetails?.email || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Coins Requested:</span>
                <span className={styles.value}>
                  {payoutDetails.coinsRequested || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Amount (₹):</span>
                <span className={styles.value}>
                  ₹{payoutDetails.amountInRupees || 0}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Status:</span>
                <span
                  className={`${styles.value} ${
                    styles[`status-${payoutDetails.status}`]
                  }`}
                >
                  {payoutDetails.status || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Payout Method:</span>
                <span className={styles.value}>
                  {payoutDetails.payoutMethod || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Account Holder:</span>
                <span className={styles.value}>
                  {payoutDetails.payoutDetails?.accountHolderName || "-"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Account Number:</span>
                <span className={styles.value}>
                  {payoutDetails.payoutDetails?.accountNumber || "-"}
                </span>
              </div>
            </div>

            <p>Please upload proof of payment to complete this payout request.</p>

            <InterestUpload
              label="Payout Proof"
              id="payout-upload"
              onChange={(file) => setUploadedImage(file)}
            />

            <div className={styles.buttonWrapper}>
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Completing..." : "Complete Payout"}
              </Button>

              <Button variant="secondary" onClick={handleGoBack}>
                Go Back
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.errorState}>
            <p>Payout details not found.</p>
            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className={styles.successMessage}>
            ✅ Payout completed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletePayout;
