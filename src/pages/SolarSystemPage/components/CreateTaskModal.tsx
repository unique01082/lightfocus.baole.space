import { useEffect } from 'react';
import TaskForm from '../../../components/TaskForm';
import type { Complexity, Priority } from '../../../types/task';

interface CreateTaskModalProps {
  onClose: () => void;
  formTitle: string;
  formDesc: string;
  formPriority: Priority;
  formComplexity: Complexity;
  formDueDate: string;
  formColor: string;
  setFormTitle: (value: string) => void;
  setFormDesc: (value: string) => void;
  setFormPriority: (value: Priority) => void;
  setFormComplexity: (value: Complexity) => void;
  setFormDueDate: (value: string) => void;
  setFormColor: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function CreateTaskModal({
  onClose,
  formTitle,
  formDesc,
  formPriority,
  formComplexity,
  formDueDate,
  formColor,
  setFormTitle,
  setFormDesc,
  setFormPriority,
  setFormComplexity,
  setFormDueDate,
  setFormColor,
  onSubmit,
  loading = false,
}: CreateTaskModalProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{
        backdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.3)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {/* Minimal header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300
            bg-clip-text text-transparent tracking-wide">
            🪐 CREATE NEW PLANET
          </div>
          <button
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20
              backdrop-blur-sm transition-all flex items-center justify-center text-white text-xl
              hover:scale-110 hover:border-white/40"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form with minimal background */}
        <div className="rounded-2xl p-6 shadow-lg">
          <TaskForm
            title={formTitle}
            desc={formDesc}
            priority={formPriority}
            complexity={formComplexity}
            dueDate={formDueDate}
            color={formColor}
            onTitleChange={setFormTitle}
            onDescChange={setFormDesc}
            onPriorityChange={setFormPriority}
            onComplexityChange={setFormComplexity}
            onDueDateChange={setFormDueDate}
            onColorChange={setFormColor}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitLabel="🚀 CREATE PLANET"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
