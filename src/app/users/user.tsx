// ...existing code...
import React, { useEffect, useState } from "react";
import UserRoleEditor from "../../components/UserRoleEditor";

type User = { id: string; name?: string; email?: string; role: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // const res = await fetch(`${apiBase}/users`, {
        //   credentials: "include",
        //   headers,
        // });
        const params = new URLSearchParams({
  page: "1",
  limit: "20",
  no_pagination: "false",
  sort_type: "-1",
  is_fetch_all: "false",
});

const res = await fetch(`${apiBase}/users/information?${params.toString()}`, {
  credentials: "include",
  headers,
});
/////doan trên mới được sửa
        if (!res.ok) throw new Error(`Fetch users failed: ${res.status}`);
        const data = await res.json();
        const roleLabel = (role_id?: number) => {
          if (role_id === 1) return "Admin";
          if (role_id === 2) return "Staff";
          if (role_id === 3) return "Student";
          return "User";
        };
        const items: User[] = Array.isArray(data?.items)
          ? data.items.map((u: any) => ({
              id: String(u.id),
              name: u.name,
              email: u.email,
              role: roleLabel(u.role_id),
            }))
          : [];
        if (mounted) setUsers(items);
      } catch (e: any) {
        setError(e?.message || "Lỗi khi tải danh sách người dùng");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  function handleUpdated(updated: User) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản trị người dùng</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Tên</th>
              <th style={{ textAlign: "left", padding: 8 }}>Email</th>
              <th style={{ textAlign: "left", padding: 8 }}>Role</th>
              <th style={{ padding: 8 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 8 }}>{u.name || "-"}</td>
                <td style={{ padding: 8 }}>{u.email || "-"}</td>
                <td style={{ padding: 8 }}>{u.role}</td>
                <td style={{ padding: 8 }}>
                  <UserRoleEditor user={u} onUpdated={handleUpdated} apiBase={apiBase} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
// ...existing code...