import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import incidentService from '../../services/incidentService';

// --- Simple Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Actions Component ---
const IncidentActions = ({ incident, isLoading, onResolve, onAddNote, onAssign }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'resolve' | 'note' | 'assign' | null
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch team members for Assignment Modal
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: incidentService.getTeamMembers,
    enabled: activeModal === 'assign', // Only fetch when modal opens
  });

  if (isLoading || !incident) return null;

  const isResolved = incident.status === 'resolved';

  const handleResolve = async () => {
    setIsSubmitting(true);
    await onResolve();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setIsSubmitting(true);
    await onAddNote(noteContent);
    setNoteContent('');
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAssign = async (userId) => {
    setIsSubmitting(true);
    await onAssign(userId);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
      <h2 className="text-gray-800 text-xl font-bold font-['Inter'] mb-6">
        Hành động bảo trì
      </h2>
      
      <div className="flex flex-wrap gap-4">
        {/* Resolve Button */}
        {!isResolved && (
          <button
            onClick={() => setActiveModal('resolve')}
            disabled={isSubmitting}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && activeModal === 'resolve' ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : '✅'} 
            Đánh dấu đã giải quyết
          </button>
        )}

        {/* Add Note Button */}
        <button
          onClick={() => setActiveModal('note')}
          disabled={isSubmitting}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          📝 Thêm ghi chú
        </button>

        {/* Assign Button */}
        {!isResolved && (
          <button
            onClick={() => setActiveModal('assign')}
            disabled={isSubmitting}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            👤 Gán người xử lý
          </button>
        )}

        {/* Navigate to Post Mortem */}
        {isResolved && (
          <button
            onClick={() => navigate(`/incidents/${incident.id}/post-mortem`)}
            className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2 ml-auto"
          >
            📄 Tạo Post-mortem
          </button>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* Resolve Modal */}
      <Modal isOpen={activeModal === 'resolve'} onClose={() => !isSubmitting && setActiveModal(null)} title="Xác nhận giải quyết">
        <p className="text-slate-600 mb-6 text-sm">
          Bạn có chắc chắn đánh dấu sự cố này là <strong>Đã giải quyết</strong> không? 
          Hành động này sẽ cập nhật trạng thái và chốt thời gian downtime.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setActiveModal(null)} disabled={isSubmitting} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
            Hủy
          </button>
          <button onClick={handleResolve} disabled={isSubmitting} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
            Xác nhận
          </button>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={activeModal === 'note'} onClose={() => !isSubmitting && setActiveModal(null)} title="Thêm ghi chú timeline">
        <form onSubmit={handleAddNote}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="Nhập nội dung cập nhật tiến độ..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[120px] resize-y text-sm mb-6"
            required
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} disabled={isSubmitting} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting || !noteContent.trim()} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
              {isSubmitting && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
              Thêm ghi chú
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={activeModal === 'assign'} onClose={() => !isSubmitting && setActiveModal(null)} title="Gán người xử lý">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {!teamMembers ? (
            <div className="py-4 text-center text-slate-400">Đang tải danh sách...</div>
          ) : (
            teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleAssign(member.id)}
                disabled={isSubmitting || member.id === incident.assignee?.id}
                className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all ${
                  member.id === incident.assignee?.id 
                    ? 'bg-teal-50 border-teal-200 cursor-default' 
                    : 'bg-white border-gray-200 hover:border-teal-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {member.initials}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-800">{member.name}</div>
                    <div className="text-xs text-slate-500">{member.role}</div>
                  </div>
                </div>
                {member.id === incident.assignee?.id && (
                  <span className="text-teal-600 border border-teal-200 bg-white px-2 py-0.5 rounded text-xs font-semibold shadow-sm">
                    Hiện tại
                  </span>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex justify-end">
          <button onClick={() => setActiveModal(null)} disabled={isSubmitting} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default IncidentActions;
