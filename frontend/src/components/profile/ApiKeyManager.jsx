import React, { useState, useCallback, memo } from 'react';
import { toast } from 'react-toastify';
import { Key, Copy, Trash2, Plus, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import profileService from '../../services/profileService';

const ApiKeyManager = ({ apiKeys: initialKeys }) => {
  const [apiKeys, setApiKeys] = useState(initialKeys || []);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({});

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 12) + '••••••••••••••••' + key.substring(key.length - 6);
  };

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Đã copy API Key vào clipboard');
    } catch {
      toast.error('Không thể copy, vui lòng copy thủ công');
    }
  }, []);

  const handleCreateKey = useCallback(async () => {
    if (!newKeyName.trim()) {
      toast.error('Vui lòng nhập tên cho API Key');
      return;
    }
    setCreating(true);
    try {
      const response = await profileService.createApiKey(newKeyName.trim());
      const { key, ...keyInfo } = response.data;
      setNewlyCreatedKey(key);
      setApiKeys((prev) => [...prev, { ...keyInfo, key: maskKey(key) }]);
      setNewKeyName('');
      setShowCreateForm(false);
      toast.success('Tạo API Key mới thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo API Key');
    } finally {
      setCreating(false);
    }
  }, [newKeyName]);

  const handleDeleteKey = useCallback(async (keyId) => {
    setDeletingId(keyId);
    try {
      await profileService.deleteApiKey(keyId);
      setApiKeys((prev) => prev.filter((k) => k._id !== keyId));
      toast.success('Đã xóa API Key thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa API Key');
    } finally {
      setDeletingId(null);
    }
  }, []);

  const toggleRevealKey = (keyId) => {
    setRevealedKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm" id="api-key-section">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-2xl font-bold font-inter text-black">API Key</h2>
        <div className="h-0.5 bg-zinc-300" />
        <p className="text-base font-medium font-inter text-slate-500">
          Sử dụng API Key để tích hợp Uptime Monitors với ứng dụng của bạn
        </p>
      </div>

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-800 mb-1">
                API Key mới đã được tạo!
              </h4>
              <p className="text-xs text-green-700 mb-2">
                Hãy copy key này ngay. Bạn sẽ không thể xem lại key đầy đủ sau khi đóng thông báo này.
              </p>
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
                <code className="flex-1 text-sm text-green-900 font-mono break-all">
                  {newlyCreatedKey}
                </code>
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                  className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                  title="Copy key"
                >
                  <Copy className="w-4 h-4 text-green-700" />
                </button>
              </div>
            </div>
            <button
              onClick={() => setNewlyCreatedKey(null)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="flex flex-col gap-4 mb-6">
        {apiKeys.length === 0 && !showCreateForm ? (
          <div className="text-center py-8 text-slate-400 font-inter">
            Chưa có API Key nào. Bấm "Tạo API Key mới" để bắt đầu.
          </div>
        ) : (
          apiKeys.map((apiKey, index) => (
            <div
              key={apiKey._id || index}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-6 py-5 group hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Key className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  {apiKey.name && (
                    <span className="text-sm font-semibold text-black font-inter">
                      {apiKey.name}
                    </span>
                  )}
                  <code className="text-base font-normal text-slate-600 font-inter truncate">
                    {revealedKeys[apiKey._id] ? apiKey.fullKey || apiKey.key : maskKey(apiKey.key)}
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleRevealKey(apiKey._id)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title={revealedKeys[apiKey._id] ? 'Ẩn key' : 'Hiện key'}
                >
                  {revealedKeys[apiKey._id] ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Copy key"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => handleDeleteKey(apiKey._id)}
                  disabled={deletingId === apiKey._id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Xóa key"
                >
                  {deletingId === apiKey._id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-400" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create New Key */}
      {showCreateForm ? (
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Nhập tên API Key (VD: Production, Staging...)"
            className="flex-1 h-11 px-4 bg-white rounded-lg border-2 border-slate-200 text-base font-inter outline-none focus:border-indigo-400 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
            autoFocus
          />
          <button
            onClick={handleCreateKey}
            disabled={creating}
            className="h-11 px-6 bg-indigo-500 text-white text-base font-bold font-inter rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Tạo
          </button>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setNewKeyName('');
            }}
            className="h-11 px-4 bg-gray-100 text-gray-600 text-base font-inter rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2.5 px-8 py-3 bg-indigo-500 text-white text-base font-bold font-inter rounded-md hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md mb-6"
        >
          <Plus className="w-4 h-4" />
          Tạo API Key mới
        </button>
      )}

      {/* Security Warning */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-7 py-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span className="text-base font-bold font-inter text-black">Lưu ý bảo mật</span>
          <span className="text-base font-medium font-inter text-slate-600">
            Không chia sẻ API Keys với bất kì ai, nếu key bị lộ, hãy xóa và tạo key mới
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ApiKeyManager);
