'use client';

import React from 'react';
import { productionChecklist } from '../lib/productionChecklist';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Zap, 
  Lock,
  X
} from 'lucide-react';

interface ProductionChecklistModalProps {
  onClose: () => void;
}

export const ProductionChecklistModal: React.FC<ProductionChecklistModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-carbon-elevated max-w-3xl w-full p-6 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Production Hardware & SLA Readiness</h3>
              <p className="text-xs text-slate-400">Security audit verification from prototype to edge deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-tactile p-2 text-slate-400 hover:text-white bg-slate-900 border border-white/10 rounded-lg text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {productionChecklist.map((item) => {
            const isCompleted = item.status === 'Completed_In_Demo';
            const isCritical = item.priority === 'Critical';

            return (
              <div
                key={item.id}
                className="p-4 bg-slate-950/70 border border-white/5 rounded-xl space-y-2 hover:border-white/15 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                      isCritical ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  {item.description}
                </p>

                <div className="pl-6 pt-0.5">
                  <span className="text-xs font-mono text-slate-500">
                    CATEGORY: {item.category.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="btn-tactile px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            Close Telemetry Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
