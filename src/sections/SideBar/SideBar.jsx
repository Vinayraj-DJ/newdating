import styles from "./SideBar.module.css";
import SchoolLogo from "../../assets/images/schoolLogo.png";
import { RxDashboard } from "react-icons/rx";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { FaUserCheck, FaHeart, FaGift, FaUsers, FaCreditCard, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";
import SideBarMainLink from "../../components/SideBarMainLink/SideBarMainLink";
import { useEffect, useState } from "react";
import { MdOutlineTextSnippet, MdLanguage, MdHelp, MdCardGiftcard, MdPeople, MdSettings, MdEmojiEvents } from "react-icons/md";
import { LuCalendarDays, LuMessagesSquare } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand, TbReportAnalytics } from "react-icons/tb";
import { useLocation } from "react-router";
import { HiMenuAlt2, HiUserGroup } from "react-icons/hi";
import { FiX, FiPackage } from "react-icons/fi";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { GiPrayer } from "react-icons/gi";

function SideBar({
  isMobile = false,
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}) {
  const [expandedLabel, setExpandedLabel] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const matchedItem = sideBarMenuItems.find((item) =>
      item.subLinks?.some((sub) => location.pathname.startsWith(sub.toRoute)),
    );

    if (matchedItem) {
      setExpandedLabel(matchedItem.label);
    }
  }, [location.pathname]);

  const sideBarMenuItems = [
    {
      label: "Dashboard",
      toRoute: "",
      icon: <RxDashboard size={20} />,
    },

    {
      label: "Interest",
      icon: <FaHeart size={20} />,
      subLinks: [
        { label: "Add Interest", toRoute: "/interest/addinterest" },
        { label: "List Interest", toRoute: "/interest/listinterest" },
      ],
    },

    {
      label: "Language",
      icon: <MdLanguage size={22} />,
      subLinks: [
        { label: "Add Language", toRoute: "/language/addlanguage" },
        { label: "List Language", toRoute: "/language/listlanguage" },
      ],
    },

    {
      label: "Religion",
      icon: <GiPrayer size={22} />,
      subLinks: [
        { label: "Add Religion", toRoute: "/religion/addreligion" },
        { label: "List Religion", toRoute: "/religion/listreligion" },
      ],
    },

    {
      label: "Gift",
      icon: <FaGift size={20} />,
      subLinks: [
        { label: "Add Gift", toRoute: "/gift/addgift" },
        { label: "List Gift", toRoute: "/gift/listgift" },
      ],
    },

    {
      label: "Relation Goal",
      icon: <FaHeart size={20} />,
      subLinks: [
        { label: "Add Relation Goal", toRoute: "/relation/addrelationgoal" },
        { label: "List Relation Goal", toRoute: "/relation/listrelationgoal" },
      ],
    },

    {
      label: "FAQ",
      icon: <MdHelp size={22} />,
      subLinks: [
        { label: "Add FAQ", toRoute: "/faq/addfaq" },
        { label: "List FAQ", toRoute: "/faq/listfaq" },
      ],
    },

    {
      label: "Plan",
      icon: <MdCardGiftcard size={22} />,
      subLinks: [
        { label: "Add Plan", toRoute: "/plan/addplan" },
        { label: "List Plan", toRoute: "/plan/listplan" },
      ],
    },

    {
      label: "Package",
      icon: <FiPackage size={20} />,
      subLinks: [
        { label: "Add Package", toRoute: "/package/addpackage" },
        { label: "List Package", toRoute: "/package/listpackage" },
      ],
    },

    {
      label: "Staff",
      icon: <BiSolidBriefcaseAlt size={20} />,
      subLinks: [
        { label: "Add Staff", toRoute: "/staff/addstaff" },
        { label: "List Staff", toRoute: "/staff/liststaff" },
      ],
    },

    {
      label: "Payment List",
      toRoute: "/paymentlist",
      icon: <FaCreditCard size={20} />,
    },

    {
      label: "Report List",
      toRoute: "/reportlist",
      icon: <TbReportAnalytics size={22} />,
    },

    {
      label: "Page",
      icon: <FaFileAlt size={20} />,
      subLinks: [
        { label: "Add Page", toRoute: "/page/addpage" },
        { label: "List Page", toRoute: "/page/listpage" },
      ],
    },

    {
      label: "Payoutlist",
      toRoute: "/payoutlist",
      icon: <FaMoneyBillWave size={20} />,
    },

    {
      label: "User List",
      icon: <HiUserGroup size={22} />,
      subLinks: [
        { label: "All User List", toRoute: "/userlist/alluserlist" },
        { label: "MALE User List", toRoute: "/userlist/maleuserlist" },
        { label: "FEMALE User List", toRoute: "/userlist/femaleuserlist" },
        { label: "AGENCY List", toRoute: "/userlist/AgencyList" },
        { label: "Pending KYCs", toRoute: "/kyc-approval" },
      ],
    },

    {
      label: "Admin Operation",
      icon: <MdSettings size={22} />,
      subLinks: [
        {
          label: "Admin Configuration",
          toRoute: "/admin-operation/configurations",
        },

        {
          label: "Coin to Rupees Conversion",
          toRoute: "/admin-operation/coin-to-rupees",
        },
        {
          label: "Minimum Call Coins",
          toRoute: "/admin-operation/min-call-coins",
        },
        {
          label: "Min Withdrawal",
          toRoute: "/admin-operation/min-withdrawal",
        },
        {
          label: "New User Duration",
          toRoute: "/admin-operation/new-user-duration",
        },
        {
          label: "All Admin Operations",
          toRoute: "/admin-operation/all-admin-operations",
        },
        {
          label: "Level Configuration",
          toRoute: "/admin-operation/level-configuration",
        },

        {
          label: "Referral Bonus",
          toRoute: "/admin-operation/referral-bonus",
        },
      ],
    },
    {
      label: "Admin Reward Access",
      icon: <MdEmojiEvents size={22} />,
      subLinks: [
        {
          label: "Weekly Rewards",
          toRoute: "/weekly-rewards",
        },
        {
          label: "Weekly Reward Slabs",
          toRoute: "/weekly-reward-slabs",
        },
        {
          label: "Daily Reward Slabs",
          toRoute: "/daily-rewards-slabs",
        },
        {
          label: "Daily Rewards",
          toRoute: "/daily-rewards-management",
        },
      ],
    },
  ];

  const handleToggleClick = () => {
    if (isMobile) {
      // On mobile, close the menu using the provided callback
      if (onCloseMobileMenu) {
        onCloseMobileMenu();
      }
      return;
    }
    setIsPinned(!isPinned);
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseEnter = () => {
    if (!isPinned && !isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned && !isMobile) setIsHovered(false);
  };

  // On mobile, always show expanded sidebar when menu is open
  const showExpanded = isMobile ? isMobileMenuOpen : !isCollapsed || isHovered;

  return (
    <div
      className={`${styles.SideBar} ${
        showExpanded ? "" : styles.collapsed
      } ${isMobile ? styles.mobile : ""} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.schoolInfoBox}>
        <img src={SchoolLogo} alt="School Logo" className={styles.logo} />
        {showExpanded && <h3>Dating</h3>}
        {showExpanded && (
          <>
            {/* Desktop toggle button */}
            {!isMobile && (
              <button
                className={styles.toggleButton}
                onClick={handleToggleClick}
              >
                <HiMenuAlt2 size={24} />
              </button>
            )}
            {/* Mobile close button */}
            {isMobile && (
              <button
                className={`${styles.toggleButton} ${styles.closeButton}`}
                onClick={handleToggleClick}
                title="Close Menu"
              >
                <FiX size={24} />
              </button>
            )}
          </>
        )}
      </div>

      <div className={styles.MenuItemsList}>
        {sideBarMenuItems.map((item) => (
          <SideBarMainLink
            key={item.label}
            data={item}
            expandedLabel={expandedLabel}
            setExpandedLabel={setExpandedLabel}
            isCollapsed={!showExpanded}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
