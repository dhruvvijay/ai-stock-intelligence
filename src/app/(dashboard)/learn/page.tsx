'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Loader2, CheckCircle, Play, Trophy, ArrowLeft, Check, X, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { learnAPI, type LearnModule, type LearnModuleResponse, type LearnLessonResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

// Simple markdown renderer for lessons
function LessonContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-invert prose-sm max-w-none space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-text-primary mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-text-primary mt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-text-primary mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-accent/30 pl-3 text-sm text-text-muted italic my-2">{line.slice(2)}</blockquote>;
        if (line.startsWith('```')) return null;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-text-secondary ml-4 list-disc leading-relaxed">{formatBold(line.slice(2))}</li>;
        if (/^\d+\.\s/.test(line)) return <li key={i} className="text-sm text-text-secondary ml-4 list-decimal leading-relaxed">{formatBold(line.replace(/^\d+\.\s/, ''))}</li>;
        if (line.startsWith('|') && !line.match(/^[\|\s-]+$/)) {
          const cells = line.split('|').filter(Boolean).map(c => c.trim());
          return (
            <div key={i} className="flex gap-3 py-1 text-xs border-b border-border-subtle">
              {cells.map((c, ci) => <span key={ci} className="flex-1 text-text-secondary">{c}</span>)}
            </div>
          );
        }
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-sm text-text-secondary leading-relaxed">{formatBold(line)}</p>;
      })}
    </div>
  );
}

function formatBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? <strong key={i} className="font-bold text-text-primary">{p.slice(2, -2)}</strong>
    : p);
}

export default function LearnPage() {
  const [view, setView] = useState<'modules' | 'module' | 'lesson'>('modules');
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [moduleDetail, setModuleDetail] = useState<LearnModuleResponse['module'] | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LearnLessonResponse['lesson'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    learnAPI.getModules().then(res => { setModules(res.modules); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const openModule = async (id: string) => {
    setLoading(true);
    const res = await learnAPI.getModule(id);
    setModuleDetail(res.module);
    setView('module');
    setLoading(false);
  };

  const openLesson = async (id: string) => {
    setLoading(true);
    const res = await learnAPI.getLesson(id);
    setLessonDetail(res.lesson);
    setView('lesson');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setLoading(false);
  };

  const submitQuiz = async () => {
    if (!lessonDetail) return;
    const questions = lessonDetail.quizQuestions;
    const correct = questions.filter(q => quizAnswers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    await learnAPI.completeLesson(lessonDetail.id, score);
    setQuizSubmitted(true);
  };

  const markComplete = async () => {
    if (!lessonDetail) return;
    await learnAPI.completeLesson(lessonDetail.id, 100);
    setLessonDetail({ ...lessonDetail, isCompleted: true });
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  // ─── Lesson View ───
  if (view === 'lesson' && lessonDetail) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 max-w-3xl mx-auto">
        <motion.div variants={item}>
          <button onClick={() => openModule(lessonDetail.module.id)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors mb-3">
            <ArrowLeft size={14} /> Back to {lessonDetail.module.title}
          </button>
          <h1 className="text-2xl font-bold text-text-primary">{lessonDetail.title}</h1>
          <p className="text-xs text-text-muted mt-1">{lessonDetail.estimatedTime} • {lessonDetail.type === 'quiz' ? 'Quiz' : 'Article'}</p>
        </motion.div>

        {lessonDetail.type === 'quiz' ? (
          <motion.div variants={item} className="space-y-6">
            {lessonDetail.quizQuestions.map((q, qi) => (
              <div key={q.id} className="card-static p-5">
                <p className="text-sm font-bold text-text-primary mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi}
                      onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                      className={cn(
                        'w-full rounded-xl border p-3 text-left text-sm transition-all',
                        quizSubmitted
                          ? oi === q.correctIndex ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : quizAnswers[q.id] === oi ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-border text-text-muted'
                          : quizAnswers[q.id] === oi ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-secondary hover:border-accent/30'
                      )}>
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {quizSubmitted && oi === q.correctIndex && <Check size={16} className="text-emerald-400" />}
                        {quizSubmitted && quizAnswers[q.id] === oi && oi !== q.correctIndex && <X size={16} className="text-red-400" />}
                      </div>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="text-xs text-text-muted mt-2 italic">{q.explanation}</p>
                )}
              </div>
            ))}
            {!quizSubmitted ? (
              <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < lessonDetail.quizQuestions.length}
                className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-30 transition-colors">
                Submit Answers
              </button>
            ) : (
              <div className="card-static p-5 text-center">
                <Trophy size={32} className="text-amber-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-text-primary">
                  Score: {lessonDetail.quizQuestions.filter(q => quizAnswers[q.id] === q.correctIndex).length}/{lessonDetail.quizQuestions.length}
                </p>
                <p className="text-xs text-text-muted mt-1">Quiz completed and progress saved!</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div variants={item} className="card-static p-6">
            <LessonContent content={lessonDetail.content} />
            {!lessonDetail.isCompleted && (
              <button onClick={markComplete}
                className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Mark as Complete
              </button>
            )}
            {lessonDetail.isCompleted && (
              <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-sm text-emerald-400 font-medium flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Completed
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // ─── Module View ───
  if (view === 'module' && moduleDetail) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 max-w-3xl mx-auto">
        <motion.div variants={item}>
          <button onClick={() => setView('modules')} className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors mb-3">
            <ArrowLeft size={14} /> All Modules
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{moduleDetail.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{moduleDetail.title}</h1>
              <p className="text-sm text-text-secondary mt-0.5">{moduleDetail.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
              moduleDetail.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
              moduleDetail.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
              'bg-red-500/10 text-red-400')}>
              {moduleDetail.difficulty}
            </span>
            <span className="text-xs text-text-muted">{moduleDetail.estimatedTime}</span>
            <span className="text-xs text-text-muted">{moduleDetail.progress?.completed || 0}/{moduleDetail.progress?.total || 0} completed</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all" style={{ width: `${moduleDetail.progress?.percentage || 0}%` }} />
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          {(moduleDetail.lessons || []).map((lesson, i) => (
            <button key={lesson.id} onClick={() => openLesson(lesson.id)}
              className="w-full card group p-4 flex items-center gap-4 hover:border-accent/20 transition-all text-left">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                lesson.isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-accent/10 text-accent')}>
                {lesson.isCompleted ? <CheckCircle size={16} /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{lesson.title}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{lesson.estimatedTime} • {lesson.type === 'quiz' ? `Quiz (${lesson.quizCount} questions)` : 'Article'}</p>
              </div>
              <ChevronRight size={16} className="text-text-muted group-hover:text-accent" />
            </button>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  // ─── Modules List ───
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <GraduationCap size={24} className="text-accent" /> Learning Center
        </h1>
        <p className="text-sm text-text-secondary mt-1">{modules.length} modules — Master stock market investing</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(mod => (
          <button key={mod.id} onClick={() => openModule(mod.id)}
            className="card group p-5 text-left hover:border-accent/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{mod.icon}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                mod.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                mod.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20')}>
                {mod.difficulty}
              </span>
            </div>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{mod.title}</h3>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{mod.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-text-muted">{mod.lessonsCount} lessons • {mod.estimatedTime}</span>
              <span className="text-[10px] font-bold text-accent">{mod.progress.percentage}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${mod.progress.percentage}%` }} />
            </div>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
