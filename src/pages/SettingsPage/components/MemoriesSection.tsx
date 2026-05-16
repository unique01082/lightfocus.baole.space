import { useRequest } from 'ahooks';
import { useState } from 'react';
import { memory } from '../../../services/lfai';

type MemoryEntry = { key: string; value: unknown; updatedAt: string };

function EntryRow({
  entry,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  saving,
}: {
  entry: MemoryEntry;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (parsed: Record<string, unknown>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [editJson, setEditJson] = useState(() => JSON.stringify(entry.value, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editJson);
      setError(null);
      onSave(parsed);
    } catch {
      setError('Invalid JSON — check your syntax');
    }
  };

  const raw = JSON.stringify(entry.value);
  const preview = raw.length > 72 ? raw.slice(0, 72) + '…' : raw;
  const date = new Date(entry.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-indigo-950/30 border border-indigo-500/15 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between px-4 py-3 gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-indigo-200/90 font-mono font-semibold">{entry.key}</p>
          {!isEditing && <p className="text-xs text-indigo-300/40 font-mono mt-1 truncate">{preview}</p>}
          <p className="text-xs text-indigo-300/25 mt-0.5 font-mono">{date}</p>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onEdit}
              className="text-xs text-indigo-300/60 hover:text-indigo-200 font-mono px-2 py-1 rounded-lg hover:bg-indigo-500/10 transition-all"
            >edit</button>
            <button
              onClick={onDelete}
              className="text-xs text-red-400/60 hover:text-red-300 font-mono px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all"
            >del</button>
          </div>
        )}
      </div>
      {isEditing && (
        <div className="px-4 pb-4 space-y-2 border-t border-indigo-500/15 pt-3">
          <textarea
            value={editJson}
            onChange={(e) => { setEditJson(e.target.value); setError(null); }}
            rows={7}
            spellCheck={false}
            className="w-full bg-black/50 border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs
              font-mono text-green-300/90 resize-y focus:outline-none focus:border-indigo-400/60
              focus:ring-1 focus:ring-indigo-400/20 leading-relaxed"
          />
          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={onCancel}
              className="px-3 py-1.5 text-xs font-mono bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemoriesSection() {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newJson, setNewJson] = useState('{\n  \n}');
  const [newError, setNewError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const { data = [], loading, refresh } = useRequest(memory.getAllMemories);
  const entries = data as MemoryEntry[];

  const { run: saveEntry, loading: saving } = useRequest(
    (key: string, val: Record<string, unknown>) => memory.upsertMemory(key, val),
    {
      manual: true,
      onSuccess: () => { setEditingKey(null); setCreating(false); setNewKey(''); setNewJson('{\n  \n}'); refresh(); },
    },
  );

  const { run: deleteOne } = useRequest(memory.deleteMemory, {
    manual: true,
    onSuccess: () => refresh(),
  });

  const { run: clearAll, loading: clearing } = useRequest(memory.clearAllMemories, {
    manual: true,
    onSuccess: () => { setConfirmClear(false); refresh(); },
  });

  const handleCreate = () => {
    if (!newKey.trim()) return;
    try {
      const val = JSON.parse(newJson);
      setNewError(null);
      saveEntry(newKey.trim(), val);
    } catch {
      setNewError('Invalid JSON — check your syntax');
    }
  };

  const inputCls = `w-full bg-black/50 border border-indigo-500/30 rounded-xl px-3 py-2.5 text-sm font-mono
    text-white focus:outline-none focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/20 placeholder-indigo-500/40`;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">🧠 Memory Management</h2>
        <span className="text-xs font-mono text-indigo-300/50 tabular-nums">
          {loading ? '…' : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`}
        </span>
      </div>
      <p className="text-sm text-purple-300/60">
        ARIA-7 builds contextual memory through your conversations. View, edit, or remove what she knows.
      </p>

      <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm text-green-300/80 font-mono font-bold">MEMORY ACTIVE</span>
      </div>

      {loading && (
        <p className="text-xs text-indigo-300/40 font-mono text-center py-6 animate-pulse">Loading memories…</p>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
          {entries.map((entry) => (
            <EntryRow
              key={entry.key}
              entry={entry}
              isEditing={editingKey === entry.key}
              onEdit={() => setEditingKey(entry.key)}
              onDelete={() => deleteOne(entry.key)}
              onSave={(val) => saveEntry(entry.key, val)}
              onCancel={() => setEditingKey(null)}
              saving={saving && editingKey === entry.key}
            />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-xs text-indigo-300/40 font-mono italic text-center py-6">
          No memories stored yet — start chatting with ARIA-7!
        </p>
      )}

      {/* Create new entry */}
      <div className="border border-indigo-500/20 rounded-xl p-4 space-y-3">
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="text-sm font-mono text-indigo-300/60 hover:text-indigo-200 flex items-center gap-2 transition-colors"
          >
            <span className="text-base leading-none">＋</span> Add memory entry
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-mono text-purple-300/60 uppercase tracking-wider">New memory entry</p>
            <input
              type="text"
              placeholder="key  (e.g. mood, goals, hobbies)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className={inputCls}
            />
            <textarea
              placeholder={'{\n  "field": "value"\n}'}
              value={newJson}
              onChange={(e) => { setNewJson(e.target.value); setNewError(null); }}
              rows={5}
              spellCheck={false}
              className={`${inputCls} text-xs text-green-300/90 resize-y`}
            />
            {newError && <p className="text-xs text-red-400 font-mono">{newError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={saving || !newKey.trim()}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500
                  text-white rounded-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create'}
              </button>
              <button
                onClick={() => { setCreating(false); setNewError(null); setNewKey(''); setNewJson('{\n  \n}'); }}
                className="px-3 py-1.5 text-xs font-mono bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clear all */}
      <div className="border-t border-red-500/20 pt-4 space-y-2">
        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            disabled={entries.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30
              bg-red-950/20 text-red-400/80 hover:text-red-300 hover:border-red-400/50 text-sm
              font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>🗑</span><span>Clear All Memories</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-red-300/80 font-mono">Are you sure? This cannot be undone.</span>
            <button
              onClick={() => clearAll()}
              disabled={clearing}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono
                font-bold rounded-lg transition-all border border-red-400/30 disabled:opacity-50"
            >
              {clearing ? 'Clearing…' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono
                rounded-lg transition-all border border-white/10"
            >
              Cancel
            </button>
          </div>
        )}
        <p className="text-xs text-red-300/30">Clearing memories will reset ARIA-7's context about you.</p>
      </div>
    </div>
  );
}

