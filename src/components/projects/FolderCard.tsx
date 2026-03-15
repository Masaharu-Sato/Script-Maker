'use client';

import Link from 'next/link';
import { Folder, Trash2, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FolderCardProps {
  id: string;
  projectId: string;
  name: string;
  scriptCount: number;
  onDelete: () => void;
}

export function FolderCard({ id, projectId, name, scriptCount, onDelete }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <Link href={`/projects/${projectId}/folder/${id}`} className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-muted">
          <Folder size={24} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{name}</p>
          <p className="text-sm text-text-muted mt-0.5">
            {scriptCount}本の脚本
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
