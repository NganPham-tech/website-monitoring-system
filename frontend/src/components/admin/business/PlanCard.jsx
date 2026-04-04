import React from 'react';
import { cn } from '../../../lib/utils';
import { Check, X } from 'lucide-react';

export default function PlanCard({ plan, onEdit }) {
  return (
    <div className={cn(
      "bg-white rounded-xl p-8 relative transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 flex flex-col",
      plan.popular ? "border-2 border-teal-400 shadow-[0_4px_20px_rgba(79,209,197,0.15)]" : "border border-slate-200"
    )}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm">
          PHỔ BIẾN NHẤT
        </div>
      )}
      
      <div className="text-center mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
        <div className="flex items-end justify-center gap-1 text-teal-600">
          <span className="text-4xl font-extrabold">${plan.price}</span>
          <span className="text-slate-500 font-normal mb-1">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-600">
            {feature.included ? (
              <Check size={20} className="text-teal-500 shrink-0 mt-0.5" />
            ) : (
              <X size={20} className="text-slate-300 shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
              {feature.text.split(':').map((part, index, array) => (
                <React.Fragment key={index}>
                  {index === 0 && array.length > 1 ? <strong>{part}:</strong> : part}
                </React.Fragment>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onEdit(plan)}
        className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg font-semibold text-slate-700 transition-colors"
      >
        {plan.name === 'Gói Free' ? 'Chỉnh sửa giới hạn' : 'Chỉnh sửa giới hạn & Giá'}
      </button>
    </div>
  );
}
