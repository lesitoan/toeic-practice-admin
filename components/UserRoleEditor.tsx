import React, { useState } from "react";

type User = { id: string; name?: string; email?: string; role: string };

export default function UserRoleEditor({
  user,
  onUpdated,
  apiBase,
}: {
  user: User;
  onUpdated?: (u: User) => void;
  apiBase?: string;
}) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const base = apiBase || (typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_API_BASE as string) : "") || "";

  async function save() {
    if (role === user.role) return;
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
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
      onUpdated?.(updated);
    } catch (e: any) {
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