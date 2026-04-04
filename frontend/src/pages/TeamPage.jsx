import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getTeamStats,
    getMembers,
    getPermissions,
    updatePermissions,
} from '../services/teamService';
import TeamStatCard from '../components/team/TeamStatCard';
import MemberTable from '../components/team/MemberTable';
import PermissionsMatrix from '../components/team/PermissionsMatrix';
import InviteMemberModal from '../components/team/InviteMemberModal';
import EditMemberModal from '../components/team/EditMemberModal';
import DeleteConfirmModal from '../components/team/DeleteConfirmModal';

const TeamPage = () => {
    const queryClient = useQueryClient();

    // ── Modal states ──────────────────────────────────────────────────────────
    const [inviteOpen, setInviteOpen] = useState(false);
    const [editMember, setEditMember] = useState(null);   // member object or null
    const [deleteMember, setDeleteMember] = useState(null); // member object or null

    // ── Data queries ──────────────────────────────────────────────────────────
    const {
        data: stats,
        isLoading: statsLoading,
    } = useQuery({
        queryKey: ['team-stats'],
        queryFn: getTeamStats,
    });

    const {
        data: members,
        isLoading: membersLoading,
    } = useQuery({
        queryKey: ['team-members'],
        queryFn: getMembers,
    });

    const {
        data: permissions,
        isLoading: permsLoading,
    } = useQuery({
        queryKey: ['team-permissions'],
        queryFn: getPermissions,
    });

    // ── Save permissions mutation ─────────────────────────────────────────────
    const { mutate: savePerms, isPending: isSavingPerms } = useMutation({
        mutationFn: updatePermissions,
        onSuccess: () => {
            toast.success('Đã cập nhật phân quyền!');
            queryClient.invalidateQueries({ queryKey: ['team-permissions'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Lưu phân quyền thất bại!');
        },
    });

    // ── Stat card config ──────────────────────────────────────────────────────
    const statCards = [
        { label: 'Tổng thành viên', value: stats?.totalMembers },
        { label: 'Quản lý', value: stats?.managers },
        { label: 'Thành viên', value: stats?.members },
        { label: 'Lời mời đang chờ', value: stats?.pendingInvites },
    ];

    return (
        <div className="min-h-screen bg-slate-100/20 px-8 py-6 flex flex-col gap-6">
            {/* Page heading */}
            <h1 className="text-gray-700 text-3xl font-bold font-['Segoe_UI']">Quản lý team</h1>

            {/* Stat cards */}
            <div className="flex flex-wrap gap-6">
                {statCards.map((card) => (
                    <TeamStatCard
                        key={card.label}
                        value={card.value}
                        label={card.label}
                        isLoading={statsLoading}
                    />
                ))}
            </div>

            {/* Member table */}
            <MemberTable
                members={members ?? []}
                isLoading={membersLoading}
                onInvite={() => setInviteOpen(true)}
                onEdit={(m) => setEditMember(m)}
                onDelete={(m) => setDeleteMember(m)}
            />

            {/* Permissions matrix */}
            <PermissionsMatrix
                permissions={permissions}
                isLoading={permsLoading}
                onSave={(perms) => savePerms(perms)}
                isSaving={isSavingPerms}
            />

            {/* ── Modals ─────────────────────────────────────────────────────── */}
            <InviteMemberModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
            />
            <EditMemberModal
                member={editMember}
                onClose={() => setEditMember(null)}
            />
            <DeleteConfirmModal
                member={deleteMember}
                onClose={() => setDeleteMember(null)}
            />
        </div>
    );
};

export default TeamPage;
