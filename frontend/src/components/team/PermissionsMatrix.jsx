import React, { useState, useEffect } from 'react';

// ─── Feature rows ─────────────────────────────────────────────────────────────
const FEATURES = [
    { key: 'monitor', label: 'Monitor' },
    { key: 'reports', label: 'Báo cáo' },
    { key: 'team', label: 'Team' },
    { key: 'admin', label: 'Admin' },
];

const ROLES = [
    { key: 'owner', label: 'Owner' },
    { key: 'admin', label: 'Admin' },
    { key: 'member', label: 'Member' },
];

// ─── Checkbox cell ────────────────────────────────────────────────────────────
/**
 * Teal square = checked, white square with black outline = unchecked.
 * Owner's checkboxes are always disabled (full permission).
 */
const PermCheckbox = ({ checked, disabled, onChange }) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors ${checked
                    ? 'bg-teal-500'
                    : 'bg-white outline outline-[0.20px] outline-black'
                } ${disabled ? 'cursor-not-allowed opacity-100' : 'cursor-pointer hover:opacity-80'}`}
        >
            {checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </button>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonMatrix = () => (
    <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-6 py-4 border-b border-black">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="flex-1 flex justify-around">
                    {[1, 2, 3].map((j) => (
                        <div key={j} className="w-5 h-5 bg-gray-200 rounded-sm" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
/**
 * PermissionsMatrix
 * Ma trận phân quyền với các hàng = tính năng, cột = role.
 * Owner: luôn checked + disabled. Admin/Member: editable checkbox.
 */
const PermissionsMatrix = ({ permissions, isLoading, onSave, isSaving }) => {
    // Local editable copy
    const [local, setLocal] = useState(permissions || {});

    useEffect(() => {
        if (permissions) setLocal(permissions);
    }, [permissions]);

    const handleChange = (role, feature, value) => {
        setLocal((prev) => ({
            ...prev,
            [role]: { ...prev[role], [feature]: value },
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-black text-4xl font-bold font-['Segoe_UI']">Phân quyền</h2>
                <button
                    onClick={() => onSave(local)}
                    disabled={isSaving || isLoading}
                    className="h-11 px-6 bg-teal-500 text-white rounded-md shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] text-base font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>

            {isLoading ? (
                <SkeletonMatrix />
            ) : (
                <div className="w-full">
                    {/* Column headers */}
                    <div className="flex items-center border-b border-black pb-3 mb-2">
                        <div className="w-40 shrink-0">
                            <span className="text-black text-xl font-bold font-['Segoe_UI']">Quyền</span>
                        </div>
                        {ROLES.map((role) => (
                            <div key={role.key} className="flex-1 flex justify-center">
                                <span className="text-black text-xl font-normal font-['Inter'] capitalize">
                                    {role.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Feature rows */}
                    {FEATURES.map((feat, idx) => (
                        <div
                            key={feat.key}
                            className={`flex items-center py-4 ${idx < FEATURES.length - 1 ? 'border-b border-black' : ''}`}
                        >
                            <div className="w-40 shrink-0">
                                <span className="text-black text-xl font-bold font-['Segoe_UI'] capitalize">
                                    {feat.label}
                                </span>
                            </div>
                            {ROLES.map((role) => {
                                const isOwner = role.key === 'owner';
                                const checked = isOwner ? true : (local[role.key]?.[feat.key] ?? false);
                                return (
                                    <div key={role.key} className="flex-1 flex justify-center">
                                        <PermCheckbox
                                            checked={checked}
                                            disabled={isOwner}
                                            onChange={(val) => handleChange(role.key, feat.key, val)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PermissionsMatrix;
