"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls,
} from "../components/ui";
import OrderDetailModal from "../components/OrderDetailModal";

export default function RefundsPage() {
  const { token } = useAuth();
  const [refunds, setRefunds] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchRefunds = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const res = await apiFetch(`/orders/refunds/list?${params.toString()}`, token);
      setRefunds(res.data.refunds || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setTotalAmount(res.data.totalRefundedAmount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, startDate, endDate]);

  useEffect(() => { fetchRefunds(); }, [fetchRefunds]);

  const resetFilters = () => { setSearchInput(""); setSearch(""); setStartDate(""); setEndDate(""); setPage(1); };

  return (
    <>
      <PageHeader eyebrow="Payments" title="Refunds" />

      <StatStrip stats={[
        { label: "Total Refunds", value: total },
        { label: "This Page", value: refunds.length },
        { label: "Amount Refunded", value: fmtCurrency(totalAmount) },
        { label: "Avg per Refund", value: fmtCurrency(total ? totalAmount / total : 0) },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search Order #</FilterLabel>
          <input className={filterInputCls} placeholder="AMM-00001" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>From</FilterLabel>
          <input type="date" className={filterSelectCls + " min-w-[130px]"} value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
        </div>
        <div>
          <FilterLabel>To</FilterLabel>
          <input type="date" className={filterSelectCls + " min-w-[130px]"} value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : refunds.length === 0 ? <EmptyState message="No refunds yet — process one from an order's detail view" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order #", "Customer", "Order Total", "Refunded", "Reason", "Status", "Refunded On", ""]} />
              <tbody>
                {refunds.map((o) => (
                  <tr key={o._id} className={rowCls}>
                    <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber}</AccentCell>
                    <td className="px-4 py-3">
                      <p className="text-[#1a1008] font-medium">{o.user?.name || "—"}</p>
                      <p className="text-[10px] text-[#9c8a78]">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#5c4f42] font-poppins">{fmtCurrency(o.total)}</td>
                    <td className="px-4 py-3 font-semibold font-poppins text-[#1a1008]">{fmtCurrency(o.refundAmount ?? o.total)}</td>
                    <td className="px-4 py-3 text-[#5c4f42] max-w-[160px] truncate">{o.refundReason || "—"}</td>
                    <td className="px-4 py-3"><Badge status={o.paymentStatus} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{o.refundedAt ? fmtDate(o.refundedAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(o._id)} className={editBtnCls}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <OrderDetailModal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        orderId={selectedOrder}
        onSaved={fetchRefunds}
        showToast={showToast}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
