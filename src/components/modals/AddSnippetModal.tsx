import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Code2, Plus } from 'lucide-react';
import { CodeLanguage } from '../../types';

export const AddSnippetModal: React.FC = () => {
  const { addSnippetModalOpen, setAddSnippetModalOpen, addSnippet } = useApp();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('bash');
  const [category, setCategory] = useState('DevOps Operations');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!addSnippetModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => Boolean(t));

    addSnippet({
      title,
      language,
      category,
      description,
      code,
      tags: tags.length ? tags : [language, 'CLI']
    });

    setAddSnippetModalOpen(false);
    setTitle('');
    setCode('');
    setDescription('');
    setTagsInput('');
  };

  const languages: CodeLanguage[] = ['sql', 'docker', 'bash', 'python', 'javascript', 'k8s'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-xl bg-[#0D111D] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070F]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Add Snippet to Developer Vault</h2>
              <p className="text-[11px] text-slate-400 font-mono">Store curated terminal & script shortcuts</p>
            </div>
          </div>
          <button
            onClick={() => setAddSnippetModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Snippet Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., PostgreSQL Deadlock Tracer with Process ID"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
                className="w-full px-3 py-2 bg-[#05070F] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 uppercase font-mono"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Cluster Debugging"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Description & Purpose</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What problem does this command solve and how should it be executed?"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span>Code / Command Script</span>
              <span className="text-[10px] text-cyan-400 font-mono">Format: Syntax Ready</span>
            </label>
            <textarea
              rows={5}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Enter command or script here..."
              className="w-full font-mono text-[11px] px-3 py-2 bg-[#05070F] border border-white/10 rounded-xl text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Postgres, Locks, Troubleshooting, SQL"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAddSnippetModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save to Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
