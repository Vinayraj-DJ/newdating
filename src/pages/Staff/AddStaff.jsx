import React, { useEffect, useState } from "react";
import styles from "./AddStaff.module.css";
import HeadingAndData from "../../components/HeadingAndData/HeadingAndData";
import HeadingAndDropDown from "../../components/HeadingAndDropdown/HeadingAndDropdown";
import Button from "../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { createStaff, updateStaffPartial, getAllStaff } from "../../services/staffService";
import { showCustomToast } from "../../components/CustomToast/CustomToast";

export default function AddStaff() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    status: "publish",
    permissions: {
      interest: { read: true, write: false, update: true },
      language: { read: true, write: false, update: false },
      religion: { read: true, write: true, update: true },
      relationGoals: { read: true, write: true, update: true },
      plan: { read: true, write: true, update: true },
      package: { read: true, write: true, update: true },
      page: { read: true, write: true, update: true },
      faq: { read: true, write: true, update: true },
      gift: { read: true, write: true, update: true },
      users: { read: true, write: false, update: true },
    },
  });
  // Preload existing when editing
  useEffect(() => {
    if (!isEdit) return;
    const ctrl = new AbortController();
    getAllStaff({ signal: ctrl.signal })
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        const found = list.find((x) => (x._id || x.id) === id);
        if (found) {
          // Merge existing permissions with default structure to ensure all fields are present
          const mergedPermissions = { ...form.permissions };
          Object.keys(mergedPermissions).forEach(moduleKey => {
            if (found.permissions && found.permissions[moduleKey]) {
              mergedPermissions[moduleKey] = {
                read: !!found.permissions[moduleKey].read,
                write: !!found.permissions[moduleKey].write,
                update: !!found.permissions[moduleKey].update
              };
            }
          });
          
          setForm({
            email: found.email || "",
            status: (found.status || "publish").toLowerCase(),
            permissions: mergedPermissions,
            password: "",
          });
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [id, isEdit]);

  const togglePerm = (moduleKey, permKey) => {
    setForm((p) => ({
      ...p,
      permissions: {
        ...p.permissions,
        [moduleKey]: { ...p.permissions[moduleKey], [permKey]: !p.permissions[moduleKey][permKey] },
      },
    }));
  };
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (saving) return;
    try {
      setSaving(true);
      if (isEdit) {
        const payload = { 
          id, 
          permissions: form.permissions 
        };
        if (form.password) payload.password = form.password;
        if (form.status) payload.status = form.status;
        await updateStaffPartial(payload);
        showCustomToast("Staff updated successfully!");
      } else {
        if (!form.email || !form.password) {
          setErr("Email and password are required");
          return;
        }
        await createStaff({ email: form.email, password: form.password, status: form.status, permissions: form.permissions });
        showCustomToast("Staff created successfully!");
      }
      // Pass updated data for optimistic update in the list
      if (isEdit) {
        navigate("/staff/liststaff", { 
          state: { 
            updated: { 
              id: id,
              email: form.email,
              status: form.status,
              // Note: password is not typically returned after update for security
            }
          }
        });
      } else {
        navigate("/staff/liststaff");
      }
    } catch (e2) {
      const errorMsg = e2?.response?.data?.message || e2?.message || "Save failed";
      setErr(errorMsg);
      showCustomToast(`Error: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{isEdit ? "Edit Staff" : "Add Staff"}</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        {!isEdit && (
          <HeadingAndData label="Email" name="email" value={form.email} onChange={onChange} placeholder="staff@example.com" required />
//          <HeadingAndData
//   label="Email"
//   name="email"
//   value={form.email}
//   onChange={onChange}
//   placeholder="staff@example.com"
//   required
//   disabled={isEdit}
// />


        )}
        <HeadingAndData label="Password" name="password" value={form.password} onChange={onChange} placeholder={isEdit ? "Leave blank to keep" : "Choose a password"} required={!isEdit} />
        <HeadingAndDropDown label="Status" name="status" value={form.status} onChange={onChange} options={[{ value: "publish", label: "Publish" }, { value: "unpublish", label: "Unpublish" }]} />

        <div className={styles.sectionTitle}>Permissions</div>
        <div className={styles.permGrid}>
          <div className={styles.permHead}>Module</div>
          <div className={styles.permHead}>Read</div>
          <div className={styles.permHead}>Write</div>
          <div className={styles.permHead}>Update</div>
          {Object.entries(form.permissions).map(([key, perms]) => (
            <React.Fragment key={key}>
              <div className={styles.permRowLabel}>{key}</div>
              <input className={styles.checkbox} type="checkbox" checked={!!perms.read} onChange={() => togglePerm(key, "read")} />
              <input className={styles.checkbox} type="checkbox" checked={!!perms.write} onChange={() => togglePerm(key, "write")} />
              <input className={styles.checkbox} type="checkbox" checked={!!perms.update} onChange={() => togglePerm(key, "update")} />
            </React.Fragment>
          ))}
        </div>
        {!!err && <div className={styles.error}>{err}</div>}
        <div className={styles.buttonContainer}>
          <Button backgroundColor="var(--Primary_Color)" textColor="#fff" disabled={saving}>{saving ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}


