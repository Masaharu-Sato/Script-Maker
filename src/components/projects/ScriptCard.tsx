'use client';

import Link from 'next/link';
import { FileText, Trash2, FolderInput, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ScriptCardProps {
  id: string;
  projectId: string;
  title: string;
  blockCount: number;
  updatedAt: string;
  onDelete: () => void;
  onMove?: () => void;
}

export function ScriptCard({ id, projectId, title, blockCount, updatedAt, onDelete, onMove }: ScriptCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const date = new Date(updatedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  return (
    <div
      className="group relative rounded-lg bg-bg-secondary p-4 transition-all hover:bg-bg-tertiary active:scale-[0.98]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <Link href={`/projects/${projectId}/script/${id}`} className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-muted">
          <FileText size={24} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{title}</p>
          <p className="text-sm text-text-muted mt-0.5">
            {blockCount}ブロック・{dateStr}
          </p>
        </div>
      </Link>

      {/* Action menu button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-elevated transition-all"
        >
          <MoreVertical size={16} className="text-text-muted" />
        </button>

        {showMenu && (
          <div
            className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg bg-bg-elevated border border-border overflow-hidden"
            style={{ boxShadow: 'var(--shadow-modal)' }}
          >
            {onMove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onMove();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <FolderInput size={16} className="text-text-secondary" />
                移動
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-bg-tertiary transition-colors"
            >
              <Trash2 size={16} />
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
