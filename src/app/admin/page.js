"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, fmtCurrency } from "./lib/api";
import { useAuth } from "./lib/AdminAuthContext";
import { Spinner, ErrorBanner, Badge, EmptyState, PageHeader, TableShell, Thead, rowCls, AccentCell } from "./components/ui";

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#ede4d8] flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] font-bold">{label}</p>
        <p className="text-[22px] font-semibold font-display text-[#1a1008] leading-tight mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[11px] text-[#b0a090] mt-0.5 font-poppins">{sub}</p>}
      </div>
    </div>
  );
}

function MiniChart({ data }) {
  if (!data || data.length === 0) return <p className="text-[13px] text-[#b0a090] py-8 text-center">No sales data yet</p>;
  const max = Math.max(...data.map(d => d.revenue), 1);
  const W = 500, H = 120, PAD = 10;
  const xs = data.map((_, i) => PAD + (i / (data.length - 1 || 1)) * (W - PAD * 2));
  const ys = data.map(d => H - PAD - ((d.revenue / max) * (H - PAD * 2)));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = path + ` L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={path} fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r="3" fill="#c9a84c" />
          <text x={x} y={H - 1} textAnchor="middle" fontSize="9" fill="#9c8a78">{data[i].name?.split(" ")[0]}</text>
        </g>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiFetch("/dashboard", token);
        setData(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const pct = (cur, prev) => {
    if (!prev) return "+∞";
    const p = (((cur - prev) / prev) * 100).toFixed(1);
    return `${p > 0 ? "+" : ""}${p}% vs last month`;
  };

  if (loading) return <Spinner label="Loading dashboard…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!data) return null;

  return (
    <>
      <PageHeader eyebrow={`Welcome back, ${user?.name}`} title="Dashboard" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={fmtCurrency(data.stats.totalRevenue)} sub={fmtCurrency(data.stats.monthRevenue) + " this month"} icon="₹" accent="bg-amber-50 text-amber-700" />
        <StatCard label="Orders" value={data.stats.totalOrders} sub={pct(data.stats.monthOrders, data.stats.lastMonthOrders)} icon="📦" accent="bg-blue-50 text-blue-700" />
        <StatCard label="Customers" value={data.stats.totalCustomers} sub={`+${data.stats.newCustomers} this month`} icon="👤" accent="bg-purple-50 text-purple-700" />
        <StatCard label="Products" value={data.stats.totalProducts} sub={`${data.stats.lowStockProducts} low stock`} icon="💎" accent="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl p-5 border border-[#ede4d8]">
          <h2 className="text-[13px] font-semibold text-[#1a1008] mb-4">Revenue — Last 6 Months</h2>
          <MiniChart data={data.monthlySales} />
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#ede4d8]">
          <h2 className="text-[13px] font-semibold text-[#1a1008] mb-4">Top Products</h2>
          {data.topProducts.length === 0 && <EmptyState message="No products yet" />}
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-[11px] text-[#b0a090] w-4">{i + 1}</span>
                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover border border-[#ede4d8]" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1a1008] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#9c8a78]">{p.soldCount || 0} sold</p>
                </div>
                <p className="text-[12px] font-medium font-poppins text-[#1a1008]">{fmtCurrency(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TableShell>
        <div className="px-5 py-4 border-b border-[#ede4d8] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#1a1008]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[11px] uppercase tracking-widest text-[#c9a84c] hover:text-[#8b6914]">View all →</Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <EmptyState message="No orders yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order #", "Customer", "Amount", "Status", "Date"]} />
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className={rowCls}>
                    <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber || o._id?.slice(-8).toUpperCase()}</AccentCell>
                    <td className="px-4 py-3 text-[#1a1008]">{o.user?.name || "—"}</td>
                    <td className="px-4 py-3 font-semibold font-poppins text-[#1a1008]">{fmtCurrency(o.total)}</td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>
    </>
  );
}
