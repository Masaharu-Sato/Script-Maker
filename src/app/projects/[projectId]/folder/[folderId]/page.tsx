'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, FileText, Folder as FolderIcon } from 'lucide-react';
import { useFolderStore } from '@/stores/useFolderStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { ScriptCard } from '@/components/projects/ScriptCard';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedList } from '@/components/ui/AnimatedList';

export default function FolderPage() {
  const { projectId, folderId } = useParams<{ projectId: string; folderId: string }>();
  const hydrated = useHydration();
  const { folders, getFolder } = useFolderStore();
  const { scripts, createScript, deleteScript, moveScript } = useScriptStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [moveScriptId, setMoveScriptId] = useState<string | null>(null);

  const otherFolders = folders.filter((f) => f.projectId === projectId && f.id !== folderId);

  const folder = getFolder(folderId);
  const folderScripts = scripts.filter((s) => s.folderId === folderId);

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    createScript(projectId, trimmed, folderId);
    setNewTitle('');
    setShowCreate(false);
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title={folder?.name ?? 'フォルダ'}
        showBack
        rightAction={
          <button
            onClick={() => setShowCreate(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-accent-light transition-colors"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={20} className="text-black" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {folderScripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <FileText size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">脚本がありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンで新しい脚本を作成</p>
          </div>
        ) : (
          <AnimatedList>
            {folderScripts.map((script) => (
              <ScriptCard
                key={script.id}
                id={script.id}
                projectId={projectId}
                title={script.title}
                blockCount={script.blocks.length}
                updatedAt={script.updatedAt}
                onDelete={() => setDeleteTarget(script.id)}
                onMove={() => setMoveScriptId(script.id)}
              />
            ))}
          </AnimatedList>
        )}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setNewTitle(''); }}
        title="新しい脚本"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="脚本のタイトルを入力..."
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        <button
          onClick={handleCreate}
          disabled={!newTitle.trim()}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          作成
        </button>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteScript(deleteTarget)}
        title="脚本を削除"
        message="この脚本を削除しますか？この操作は取り消せません。"
      />

      {/* Move script modal */}
      <Modal
        isOpen={!!moveScriptId}
        onClose={() => setMoveScriptId(null)}
        title="脚本を移動"
      >
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          <button
            onClick={() => {
              moveScript(moveScriptId!, null);
              setMoveScriptId(null);
            }}
            className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3 text-left hover:bg-bg-elevated transition-colors"
          >
            <FileText size={18} className="text-text-secondary" />
            <span className="text-text-primary text-sm">ルート（フォルダなし）</span>
          </button>
          {otherFolders.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                moveScript(moveScriptId!, f.id);
                setMoveScriptId(null);
              }}
              className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3 text-left hover:bg-bg-elevated transition-colors"
            >
              <FolderIcon size={18} className="text-accent" />
              <span className="text-text-primary text-sm">{f.name}</span>
            </button>
          ))}
        </div>
      </Modal>

      <TabBar />
    </div>
  );
}
