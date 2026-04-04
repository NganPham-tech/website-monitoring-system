import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { businessService } from '../../../api/businessService';
import PlanCard from './PlanCard';
import { Skeleton } from '../../ui/Skeleton';
import { Modal } from '../../ui/Modal';
import { Plus } from 'lucide-react';

export default function PlanConfigTab() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['adminPlans'],
    queryFn: () => businessService.fetchPlans(),
  });

  const [editModal, setEditModal] = useState({ isOpen: false, plan: null });

  return (
    <div className="bg-transparent border-none">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors shadow-sm shadow-teal-500/20">
          <Plus size={18} />
          <span>Tạo Gói cước Mới</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
             <Skeleton key={i} className="h-[500px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans?.map(plan => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onEdit={(p) => setEditModal({ isOpen: true, plan: p })} 
            />
          ))}
        </div>
      )}

      {/* Edit Modal Prototype */}
      <Modal 
        isOpen={editModal.isOpen} 
        onClose={() => setEditModal({ isOpen: false, plan: null })}
        title="Chỉnh sửa thông số Gói cước"
      >
        {editModal.plan && (
          <div className="mt-4 space-y-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên gói cước</label>
              <input type="text" defaultValue={editModal.plan.name} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
             </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giá ($/tháng)</label>
              <input type="number" defaultValue={editModal.plan.price} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
             </div>
             <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  onClick={() => setEditModal({ isOpen: false, plan: null })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setEditModal({ isOpen: false, plan: null })}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                >
                  Lưu thay đổi
                </button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
