import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const ConnectionModal = ({ isOpen, onClose, integration, onSave, isSaving }) => {
    const [formData, setFormData] = useState({});

    if (!integration) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(integration.type, formData);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-3xl font-bold text-gray-800">Kết nối {integration.name}</Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {integration.type === 'email' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">SMTP Host</label>
                                    <input required name="host" placeholder="smtp.example.com" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Port</label>
                                    <input required name="port" type="number" placeholder="587" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Username</label>
                                    <input required name="user" placeholder="user@example.com" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Password</label>
                                    <input required name="pass" type="password" placeholder="********" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Gửi đến địa chỉ (Ngăn cách dấu phẩy)</label>
                                    <input required name="addresses" placeholder="admin@example.com" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                            </>
                        )}

                        {integration.type === 'telegram' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Bot Token</label>
                                    <input required name="botToken" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Chat ID</label>
                                    <input required name="chatId" placeholder="-100123456789" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                            </>
                        )}

                        {(integration.type === 'discord' || integration.type === 'slack' || integration.type === 'webhook') && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Webhook URL</label>
                                    <input required type="url" name="webhookUrl" placeholder="https://..." onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" title="Phải là URL Webhook hợp lệ" />
                                </div>
                            </>
                        )}

                        {integration.type === 'sms' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">SMS Gateway API Key</label>
                                    <input required name="apiKey" placeholder="Nhập API Key" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium">Phone Number</label>
                                    <input required name="phoneNumber" placeholder="+84 987 654 321" onChange={handleChange} className="w-full border border-gray-300 p-4 text-lg rounded-md" />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 font-bold text-gray-700 rounded hover:bg-gray-50 text-lg">Hủy</button>
                            <button disabled={isSaving} type="submit" className="px-8 py-3 bg-[#0F6EC0] hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg min-w-[160px]">
                                {isSaving ? (
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Lưu & Kết nối'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ConnectionModal;
