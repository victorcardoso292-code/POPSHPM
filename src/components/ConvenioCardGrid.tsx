import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface ConvenioGridItem {
  id: string;
  name: string;
  category: string;
  badge: string;
}

interface ConvenioCardGridProps {
  plans: ConvenioGridItem[];
  selectedPlanId?: string;
  onSelectPlan: (planId: string) => void;
  accentColor?: 'teal' | 'indigo' | 'emerald';
}

export const ConvenioCardGrid: React.FC<ConvenioCardGridProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  accentColor = 'teal'
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan.id)}
            className={`w-full text-left bg-white border ${
              isSelected 
                ? 'border-[#0a483e] ring-2 ring-[#0a483e]/20 shadow-md bg-emerald-50/20' 
                : 'border-slate-200/90 hover:border-[#0a483e] hover:shadow-md'
            } rounded-2xl p-4 sm:p-4.5 flex items-center justify-between transition-all duration-150 cursor-pointer group`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Dark teal square badge with white initials */}
              <div className="w-12 h-12 rounded-2xl bg-[#09473d] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs tracking-wider">
                {plan.badge}
              </div>
              
              {/* Plan name and category */}
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 text-sm tracking-tight truncate uppercase group-hover:text-[#09473d] transition-colors m-0 leading-snug">
                  {plan.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium capitalize mt-0.5 block truncate">
                  {plan.category || 'Convênio'}
                </span>
              </div>
            </div>

            {/* Right chevron arrow */}
            <div className="flex items-center text-slate-300 group-hover:text-[#09473d] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2">
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
