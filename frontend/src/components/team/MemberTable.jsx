import React from 'react';
import { format } from 'date-fns';

// ─── Role badge config ────────────────────────────────────────────────────────
const ROLE_BADGE = {
    owner: { bg: 'bg-amber-100', text: 'text-amber-500', label: 'Owner' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-500', label: 'Admin' },
    member: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Member' },
};

// ─── Avatar color pool ────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    'bg-indigo-500', 'bg-teal-500', 'bg-purple-500',
    'bg-rose-500', 'bg-orange-500', 'bg-cyan-500',
];

const getAvatarColor = (id) =>
    AVATAR_COLORS[parseInt(id, 16) % AVATAR_COLORS.length] || 'bg-indigo-500';

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0].toUpperCase())
        .join('');

const formatJoinDate = (dateStr) => {
    try {
        return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch {
        return dateStr;
    }
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-white p-6 flex items-center gap-6 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
            <div className="h-11 w-28 bg-gray-200 rounded-md" />
            <div className="h-11 w-28 bg-gray-200 rounded-md" />
            <div className="h-11 w-28 bg-gray-200 rounded-md" />
        </div>
    </div>
);

// ─── Single member row ────────────────────────────────────────────────────────
const MemberRow = ({ member, onEdit, onDelete, onDetail }) => {
    const badge = ROLE_BADGE[member.role] || ROLE_BADGE.member;
    const initials = getInitials(member.name);
    const avatarBg = getAvatarColor(member.id.toString());

    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-white px-6 py-4 flex items-center gap-6">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-full border border-black ${avatarBg} flex items-center justify-center shrink-0`}>
                <span className="text-white text-2xl font-bold font-['Segoe_UI']">{initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 text-xl font-bold font-['Segoe_UI'] truncate">
                        {member.name}
                    </span>
                    <span className={`inline-flex items-center px-3 h-6 rounded-2xl text-sm font-bold font-['Segoe_UI'] shrink-0 ${badge.bg} ${badge.text}`}>
                        {badge.label}
                    </span>
                </div>
                <span className="text-indigo-500 text-sm font-normal font-['Segoe_UI'] truncate">
                    {member.email}
                </span>
                <div className="flex items-center gap-6 flex-wrap">
                    <span className="text-slate-500 text-sm font-['Segoe_UI']">
                        📅 Tham gia: {formatJoinDate(member.joinedAt)}
                    </span>
                    <span className="text-slate-500 text-sm font-['Segoe_UI']">
                        🔔 Nhận {member.alertCount} cảnh báo
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={() => onDetail(member)}
                    className="w-28 h-11 bg-white rounded-md shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] border border-slate-200/40 text-black text-base font-normal font-['Segoe_UI'] hover:bg-gray-50 transition-colors"
                >
                    Chi tiết
                </button>
                <button
                    onClick={() => onEdit(member)}
                    className="w-28 h-11 bg-white rounded-md shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] border border-slate-200/40 text-black text-base font-normal font-['Segoe_UI'] hover:bg-gray-50 transition-colors"
                >
                    Chỉnh sửa
                </button>
                <button
                    onClick={() => onDelete(member)}
                    disabled={member.role === 'owner'}
                    className="w-28 h-11 bg-white rounded-md shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] border border-slate-200/40 text-black text-base font-normal font-['Segoe_UI'] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

// ─── Main MemberTable ─────────────────────────────────────────────────────────
/**
 * MemberTable
 * Renders the Thành viên section card: header + member rows + empty state.
 */
const MemberTable = ({ members = [], isLoading, onInvite, onEdit, onDelete, onDetail }) => {
    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white px-6 py-6 flex flex-col gap-4">
            {/* Section header */}
            <div className="flex items-center justify-between">
                <h2 className="text-black text-4xl font-bold font-['Segoe_UI']">Thành viên</h2>
                <button
                    onClick={onInvite}
                    className="h-11 px-5 bg-teal-500 text-white rounded-md shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] text-base font-semibold hover:bg-teal-600 transition-colors"
                >
                    Mời thành viên +
                </button>
            </div>

            {/* Rows */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                </div>
            ) : members.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-lg">
                    Chưa có thành viên nào. Hãy mời người đầu tiên!
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {members.map((member) => (
                        <MemberRow
                            key={member.id}
                            member={member}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDetail={onDetail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemberTable;
