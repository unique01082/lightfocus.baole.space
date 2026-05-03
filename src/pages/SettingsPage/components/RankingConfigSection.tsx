import { useMemoizedFn, useSetState } from 'ahooks';
import { useEffect } from 'react';
import type { LF } from '../../../services/lf';
import { useUserConfig } from '../hooks/useUserConfig';

type RankingAlgorithm = LF.UserConfigEntity['rankingAlgorithm'];

const ALGORITHMS: { value: RankingAlgorithm; label: string; emoji: string; description: string }[] = [
  { value: 'BALANCED', label: 'Balanced', emoji: '⚖️', description: 'Equal weight across all factors' },
  { value: 'PRIORITY_FOCUSED', label: 'Priority Focused', emoji: '🔴', description: 'Task priority drives ranking' },
  { value: 'DEADLINE_FOCUSED', label: 'Deadline Focused', emoji: '⏰', description: 'Urgency and due dates drive ranking' },
  { value: 'COMPLEXITY_FOCUSED', label: 'Complexity Focused', emoji: '🧩', description: 'Harder tasks rank higher' },
  { value: 'CUSTOM', label: 'Custom', emoji: '🎛️', description: 'Set your own weight distribution' },
];

interface FormState {
  rankingAlgorithm: RankingAlgorithm;
  priorityWeight: number;
  complexityWeight: number;
  urgencyWeight: number;
  enableTimeBoosting: boolean;
}

export default function RankingConfigSection() {
  const { config, loading, updateConfig, resetConfig } = useUserConfig();

  const [form, setForm] = useSetState<FormState>({
    rankingAlgorithm: 'BALANCED',
    priorityWeight: 0.4,
    complexityWeight: 0.3,
    urgencyWeight: 0.3,
    enableTimeBoosting: true,
  });

  useEffect(() => {
    if (config) {
      setForm({
        rankingAlgorithm: config.rankingAlgorithm,
        priorityWeight: config.priorityWeight,
        complexityWeight: config.complexityWeight,
        urgencyWeight: config.urgencyWeight,
        enableTimeBoosting: config.enableTimeBoosting,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleSave = useMemoizedFn(async () => {
    await updateConfig({
      rankingAlgorithm: form.rankingAlgorithm,
      priorityWeight: form.priorityWeight,
      complexityWeight: form.complexityWeight,
      urgencyWeight: form.urgencyWeight,
      enableTimeBoosting: form.enableTimeBoosting,
    });
  });

  const handleReset = useMemoizedFn(async () => {
    await resetConfig();
  });

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        🏆 Ranking Algorithm
      </h2>

      {loading && !config ? (
        <div className="text-sm text-indigo-300/60 font-mono animate-pulse">Loading config...</div>
      ) : (
        <>
          {/* Algorithm selector */}
          <div className="space-y-3">
            <label className="text-sm text-purple-300/80 font-medium">Algorithm</label>
            <div className="grid grid-cols-1 gap-2">
              {ALGORITHMS.map((algo) => (
                <button
                  key={algo.value}
                  onClick={() => setForm({ rankingAlgorithm: algo.value })}
                  className={`flex items-center gap-3 text-left p-3 rounded-xl border-2 transition-all duration-200
                    ${form.rankingAlgorithm === algo.value
                      ? 'border-indigo-400 bg-indigo-900/50 shadow-lg shadow-indigo-500/20'
                      : 'border-white/10 hover:border-purple-400/40 bg-black/20'
                    }`}
                >
                  <span className="text-xl flex-shrink-0">{algo.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-bold font-mono">{algo.label}</div>
                    <div className="text-indigo-300/60 text-xs mt-0.5">{algo.description}</div>
                  </div>
                  {form.rankingAlgorithm === algo.value && (
                    <div className="ml-auto w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom weights — only shown for CUSTOM */}
          {form.rankingAlgorithm === 'CUSTOM' && (
            <div className="space-y-4 p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/20">
              <div className="text-sm text-purple-300/80 font-medium">Custom Weights</div>
              {(
                [
                  { key: 'priorityWeight', label: 'Priority' },
                  { key: 'complexityWeight', label: 'Complexity' },
                  { key: 'urgencyWeight', label: 'Urgency' },
                ] as { key: keyof Pick<FormState, 'priorityWeight' | 'complexityWeight' | 'urgencyWeight'>; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs text-indigo-300/70">
                    <span>{label}</span>
                    <span className="font-mono font-bold text-white">{Math.round(form[key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={form[key]}
                    onChange={(e) => setForm({ [key]: parseFloat(e.target.value) } as Partial<FormState>)}
                    className="w-full accent-indigo-400"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Time boosting toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">Time Boosting</div>
              <div className="text-xs text-indigo-300/60 mt-0.5">Boost old tasks approaching deadline</div>
            </div>
            <button
              onClick={() => setForm({ enableTimeBoosting: !form.enableTimeBoosting })}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 border-2
                ${form.enableTimeBoosting
                  ? 'bg-indigo-500 border-indigo-400'
                  : 'bg-white/10 border-white/20'
                }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow
                  ${form.enableTimeBoosting ? 'left-6' : 'left-0.5'}`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-purple-500/20">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold
                rounded-xl transition-all border border-indigo-400/30"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-indigo-300 text-sm font-bold
                rounded-xl transition-all border border-white/10 hover:border-white/20"
            >
              Reset to default
            </button>
          </div>
        </>
      )}
    </div>
  );
}
