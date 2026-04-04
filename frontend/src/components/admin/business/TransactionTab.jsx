import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '../../../api/businessService';
import { TableSkeleton } from '../../ui/Skeleton';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { Modal } from '../../ui/Modal';

export default function TransactionTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [refundModal, setRefundModal] = useState({ isOpen: false, transactionId: null });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['adminTransactions', searchTerm, statusFilter],
    queryFn: () => businessService.fetchTransactions({ search: searchTerm, status: statusFilter }),
  });

  const refundMutation = useMutation({
    mutationFn: (id) => businessService.refundTransaction(id),
    onSuccess: () => {
      toast.success('Hệ thống đang xử lý hoàn tiền qua Stripe!');
      queryClient.invalidateQueries(['adminTransactions']);
      setRefundModal({ isOpen: false, transactionId: null });
    },
    onError: () => toast.error('Không thể hoàn tiền. Vui lòng thử lại.')
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      {/* Toolbar */}
      <div className="p-5 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 bg-slate-50 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo Mã hóa đơn (Invoice) hoặc Email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto">
          <select 
            className="w-full md:w-auto px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm cursor-pointer outline-none focus:border-teal-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton cols={7} rows={4} />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-4 px-6">Mã Giao Dịch</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Số tiền</th>
                <th className="py-4 px-6">Nội dung</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions?.map(trx => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-blue-700">{trx.id}</div>
                    <div className="text-xs font-mono text-slate-400 mt-1">{trx.stripeId} (Stripe)</div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{trx.email}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">${trx.amount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-slate-600">{trx.content}</td>
                  <td className="py-4 px-6 text-slate-500">{trx.time}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                      ${trx.status === 'success' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${trx.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      ${trx.status === 'refunded' ? 'bg-slate-200 text-slate-700' : ''}
                    `}>
                      {trx.status === 'success' ? 'Thành công' : trx.status === 'failed' ? 'Thất bại' : 'Đã hoàn tiền'}
                    </span>
                    {trx.error && <div className="text-xs text-red-500 mt-1">Lỗi: {trx.error}</div>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                       {trx.status === 'success' ? (
                          <>
                            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 font-medium transition-colors">
                              Hóa đơn PDF
                            </button>
                            <button 
                              onClick={() => setRefundModal({ isOpen: true, transactionId: trx.id })}
                              className="px-3 py-1.5 border border-slate-200 rounded-md text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-colors"
                            >
                              Hoàn tiền
                            </button>
                          </>
                       ) : (
                          <button className="px-3 py-1.5 border border-slate-200 rounded-md text-blue-600 hover:bg-blue-50 font-medium transition-colors">
                            Thử lại
                          </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={refundModal.isOpen} 
        onClose={() => setRefundModal({ isOpen: false, transactionId: null })}
        title="Xác nhận hoàn tiền"
      >
        <div className="mt-2">
          <p className="text-sm text-slate-500">
            Bạn có chắc chắn muốn hoàn tiền toàn bộ số tiền của giao dịch <strong className="text-slate-800">{refundModal.transactionId}</strong> không? Quá trình này không thể hoàn tác và tiền sẽ được chuyển lại vào thẻ khách hàng trong 5-10 ngày làm việc.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            onClick={() => setRefundModal({ isOpen: false, transactionId: null })}
            disabled={refundMutation.isPending}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            onClick={() => refundMutation.mutate(refundModal.transactionId)}
            disabled={refundMutation.isPending}
          >
            {refundMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hoàn tiền'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
