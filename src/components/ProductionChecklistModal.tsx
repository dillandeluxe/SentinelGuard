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
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Production Readiness Roadmap & Checklist</h3>
              <p className="text-xs text-slate-400">Requirements for scaling from prototype to live commercial property deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition font-bold text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {productionChecklist.map((item) => {
            const isCompleted = item.status === 'Completed_In_Demo';
            const isCritical = item.priority === 'Critical';

            return (
              <div
                key={item.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isCritical ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? 'Demo Ready' : 'Production Action'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {item.description}
                </p>

                <div className="pl-7 pt-1">
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    Category: {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-sky-500/20"
          >
            Close Checklist & Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
