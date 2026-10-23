'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, FileText, Send, Loader2, CheckCircle } from 'lucide-react';

export default function InsightAIHome() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'summary' | 'key_points' | 'question'>('summary');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/analyze', {
        text,
        mode,
        question: mode === 'question' ? question : undefined,
      });
      setResponse(res.data);
    } catch (err) {
      console.error('Error analyzing text:', err);
      alert('Failed to connect to InsightAI engine backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles size={14} /> Powered by FastAPI & Next.js
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          InsightAI Analyzer
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Summarize documents, extract key insights, or ask targeted questions instantly.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <FileText size={16} className="text-cyan-400" /> Input Document / Text
          </h2>
          
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4 flex-1">
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text or article here..."
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Analysis Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="summary">Summary</option>
                <option value="key_points">Key Points</option>
                <option value="question">Ask a Question</option>
              </select>
            </div>

            {mode === 'question' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Your Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is the main goal?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2.5 rounded-xl text-xs transition shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'Analyzing...' : 'Generate Insight'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-xl min-h-[400px]">
          <h2 className="font-bold text-slate-200 text-sm mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
            <span>AI Response Output</span>
            {response && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Words: {response.word_count}
              </span>
            )}
          </h2>

          <div className="flex-1 flex flex-col justify-center items-center">
            {!response && !loading && (
              <div className="text-center text-slate-500 text-xs">
                <Sparkles size={32} className="mx-auto mb-2 opacity-30 text-cyan-400" />
                Provide text and select a mode to view intelligent insights here.
              </div>
            )}

            {loading && (
              <div className="text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
                Processing semantic context...
              </div>
            )}

            {response && !loading && (
              <div className="w-full text-left space-y-3">
                <div className="text-xs uppercase tracking-wider font-bold text-cyan-400 mb-1">
                  Mode: {response.mode}
                </div>

                {Array.isArray(response.result) ? (
                  <ul className="space-y-2">
                    {response.result.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-200">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-200 leading-relaxed font-mono">
                    {response.result}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
