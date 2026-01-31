import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/InputField/InputField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdAdminPanelSettings } from "react-icons/md";
import SchoolLogo from "../../../assets/images/schoolLogo.webp";
import styles from "./Login.module.css";
import { adminLogin } from "../../../services/api";
import { setAuth } from "../../../utils/auth";

import {
  showCustomToast,
  ToastContainerCustom,
} from "../../../components/CustomToast/CustomToast";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrUser: "",
    password: "",
    userType: "admin",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState({});

  const ctrlRef = useRef(null);
  useEffect(() => () => ctrlRef.current?.abort(), []);

  const onChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErr({});
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;

    try {
      setBusy(true);

      const payload = {
        email: form.emailOrUser.trim(),
        password: form.password.trim(),
        userType: form.userType,
      };

      const token = await adminLogin(payload);
      setAuth(token);

      showCustomToast("Login successful!", () =>
        navigate("/dashboard", { replace: true })
      );
    } catch (e) {
      showCustomToast("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <ToastContainerCustom />

      {/* 🔝 TOP LOGO */}
      <div className={styles.logoContainer}>
        <img src={SchoolLogo} alt="Logo" className={styles.schoolLogo} />
      </div>

      {/* 🔐 LOGIN CARD */}
      <div className={styles.loginCard}>
        <form onSubmit={submit} noValidate>
          <div className={styles.headingContainer}>
            <h1 className={styles.mainHeading}>Sign in to account</h1>
            <p className={styles.subHeading}>
              Enter your email & password to login
            </p>
          </div>

          <div className={styles.inputWrapper}>
            <InputField
              name="emailOrUser"
              placeholder="Email Address"
              value={form.emailOrUser}
              onChange={onChange}
              icon={<MdEmail />}
            />
          </div>

          <div className={styles.inputWrapper}>
            <InputField
              name="password"
              placeholder="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              icon={
                showPwd ? (
                  <FaEyeSlash onClick={() => setShowPwd(false)} />
                ) : (
                  <FaEye onClick={() => setShowPwd(true)} />
                )
              }
            />
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.selectContainer}>
              <select
                name="userType"
                value={form.userType}
                onChange={onChange}
                className={styles.select}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              <MdAdminPanelSettings className={styles.selectIcon} />
            </div>
          </div>

          <button
            type="submit"
            className={styles.signInButton}
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
