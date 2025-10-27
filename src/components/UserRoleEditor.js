// ...existing code...
import React, { useState } from "react";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} role
 */

/**
 * @param {{ 
 *   user: User, 
 *   onUpdated?: (u: User) => void, 
 *   apiBase?: string 
 * }} props
 */
export default function UserRoleEditor({ user, onUpdated, apiBase }) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const base = apiBase || process.env.NEXT_PUBLIC_API_BASE || "";

  async function save() {
    if (role === user.role) return;
    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${base}/users/${user.id}/role`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      if (onUpdated) onUpdated(updated);
    } catch (e) {
      setError(e?.message || "Lỗi khi cập nhật role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={loading}
        aria-label={`Chọn role cho ${user.email || user.name || user.id}`}
      >
        <option value="user">Người dùng</option>
        <option value="collaborator">Cộng tác viên</option>
      </select>

      <button onClick={save} disabled={loading || role === user.role}>
        {loading ? "Đang lưu..." : "Lưu"}
      </button>

      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
    </div>
  );
}
