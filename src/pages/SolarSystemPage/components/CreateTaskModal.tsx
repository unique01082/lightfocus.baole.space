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
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: 30,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            marginBottom: 20,
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--accent-1)',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          🪐 CREATE NEW PLANET
        </div>
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
  );
}
