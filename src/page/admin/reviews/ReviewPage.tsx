import { useState } from "react"
import { 
  ReviewTable, 
  useReviews, 
  type Review 
} from "@/features/admin/reviews"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { CustomSelect as Select } from "@/components/ui/CustomSelect"
import { Card } from "@/components/ui/Card"
import { PageHeader, StatCard, StatGrid, ErrorBanner } from "@/components/ui/PageComponents"
import { Star, MessageSquare, CheckCircle, EyeOff, RefreshCcw, Calendar } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"

export default function ReviewPage() {
  const { 
    report, 
    loading, 
    error, 
    params,
    updateParams,
    refetch, 
    togglePublishReview,
    deleteReview
  } = useReviews()

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [reviewToAction, setReviewToAction] = useState<Review | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const runAction = async (fn: () => Promise<void>, closeDialog: () => void) => {
    setActionLoading(true)
    try { await fn(); closeDialog() }
    finally { setActionLoading(false) }
  }

  const handleTogglePublish = async (review: Review) => {
    try {
      await togglePublishReview(review.id)
    } catch (err) {
      console.error("Failed to toggle publish status:", err)
    }
  }

  const statistics = report?.statistics
  const reviews = report?.reviews.data || []
  const meta = report?.reviews

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ulasan Pelanggan"
        subtitle="Monitor dan kelola masukan dari pelanggan"
        badge="Feedback"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={RefreshCcw} size="sm" onClick={refetch} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card padding="sm" className="mb-2">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-48">
            <Input 
              label="Dari Tanggal" 
              type="date" 
              value={params.start_date || ''} 
              onChange={e => updateParams({ start_date: e.target.value })}
              icon={Calendar}
            />
          </div>
          <div className="w-full sm:w-48">
            <Input 
              label="Sampai Tanggal" 
              type="date" 
              value={params.end_date || ''} 
              onChange={e => updateParams({ end_date: e.target.value })}
              icon={Calendar}
            />
          </div>
          <div className="w-full sm:w-40">
            <Select 
              label="Rating"
              placeholder="Semua Rating"
              value={params.rating?.toString() || ''}
              onChange={val => updateParams({ rating: val ? parseInt(val) : undefined })}
              options={[
                { label: '5 Bintang', value: '5' },
                { label: '4 Bintang', value: '4' },
                { label: '3 Bintang', value: '3' },
                { label: '2 Bintang', value: '2' },
                { label: '1 Bintang', value: '1' },
              ]}
              icon={Star}
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => updateParams({ start_date: undefined, end_date: undefined, rating: undefined })}
            className="mb-1"
          >
            Reset Filter
          </Button>
        </div>
      </Card>

      {statistics && (
        <StatGrid columns={4}>
          <StatCard label="Rating Rata-rata" value={`${statistics.average_rating} / 5.0`} icon={Star} color="amber" loading={loading} />
          <StatCard label="Total Ulasan" value={statistics.total_count} icon={MessageSquare} color="blue" loading={loading} />
          <StatCard label="Dipublikasi" value={statistics.published_count} icon={CheckCircle} color="emerald" loading={loading} />
          <StatCard label="Disembunyikan" value={statistics.unpublished_count} icon={EyeOff} color="rose" loading={loading} />
        </StatGrid>
      )}

      {/* Report Tables (Averages) */}
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Monthly Averages */}
         <Card padding="md">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Rata-rata Bulanan</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-xs whitespace-nowrap">
                    <th className="py-3 px-4 text-left">Bulan/Tahun</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-right">Rata-rata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report?.monthly_averages.map((m, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{m.month}/{m.year}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
                          {m.count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-bold text-amber-500">
                           <Star size={12} fill="currentColor" />
                           {m.avg_rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!report?.monthly_averages || report.monthly_averages.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">Tidak ada data bulanan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
         </Card>

         {/* Activity Type Averages */}
         <Card padding="md">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Rata-rata per Jenis Kegiatan</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-xs whitespace-nowrap">
                    <th className="py-3 px-4 text-left">Jenis Kegiatan</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-right">Rata-rata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report?.activity_type_averages.map((a, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{a.activity_type}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
                          {a.count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-bold text-amber-500">
                           <Star size={12} fill="currentColor" />
                           {a.avg_rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!report?.activity_type_averages || report.activity_type_averages.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">Tidak ada data jenis kegiatan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
         </Card>
      </div>

      {/* Bus Averages */}
      <Card padding="md">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Rata-rata per Unit Bus</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-xs whitespace-nowrap">
                  <th className="py-3 px-4 text-left">Nama Bus</th>
                  <th className="py-3 px-4 text-left">Plat Nomor</th>
                  <th className="py-3 px-4 text-center">Jumlah Ulasan</th>
                  <th className="py-3 px-4 text-right">Rata-rata Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report?.bus_averages.map((b, i) => (
                  <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">{b.bus_name}</td>
                    <td className="py-3 px-4 text-slate-500">{b.plat_number}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
                        {b.count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-bold text-amber-500">
                         <Star size={12} fill="currentColor" />
                         {b.avg_rating}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!report?.bus_averages || report.bus_averages.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">Tidak ada data bus</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </Card>

      {error ? (
        <ErrorBanner error={error} onRetry={refetch} />
      ) : (
        <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Daftar Ulasan Terkini</h3>
              <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">{meta?.total || 0} Total Ulasan</span>
            </div>
            <div className="p-0 border-b-0 border-t-0 [&>div]:border-0 [&>div]:rounded-none [&>div]:shadow-none">
              <ReviewTable 
                data={reviews} 
                loading={loading}
                onTogglePublish={handleTogglePublish}
                onDelete={r => { setReviewToAction(r); setIsDeleteConfirmOpen(true) }}
              />
            </div>
            {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 p-4 bg-slate-50/50">
                <Button size="sm" variant="outline" disabled={params.page === 1} onClick={() => updateParams({ page: (params.page || 1) - 1 })}>Sebelumnya</Button>
                <span className="text-sm font-medium text-slate-500">Halaman <span className="text-slate-900 font-semibold">{params.page}</span> dari {meta.last_page}</span>
                <Button size="sm" variant="outline" disabled={params.page === meta.last_page} onClick={() => updateParams({ page: (params.page || 1) + 1 })}>Berikutnya</Button>
            </div>
            )}
        </Card>
      )}

      <Confirmation 
        open={isDeleteConfirmOpen} 
        onClose={() => setIsDeleteConfirmOpen(false)} 
        onConfirm={() => runAction(async () => { await deleteReview(reviewToAction!.id) }, () => setIsDeleteConfirmOpen(false))} 
        loading={actionLoading} 
        title="Hapus Ulasan?" 
        message="Ulasan akan dihapus secara permanen (soft delete)." 
        variant="warning" 
        confirmText="Ya, Hapus" 
      />
    </div>
  )
}
