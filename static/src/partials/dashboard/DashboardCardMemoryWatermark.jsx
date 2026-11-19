import React from "react";

function DashboardCardMemoryWatermark({ container }) {
  const mem = container?.memory_stats || {};
  const usageMb = mem.usage_mb || Math.round((mem.total_usage || 0) / (1024 * 1024) * 100) / 100;
  const maxUsageMb = mem.max_usage_mb || Math.round((mem.max_usage || 0) / (1024 * 1024) * 100) / 100;
  const limitMb = mem.limit_mb || Math.round((mem.limit || 0) / (1024 * 1024) * 100) / 100;

  // Percentage calculations
  const usagePct = limitMb > 0 ? ((usageMb / limitMb) * 100).toFixed(2) : "0.00";
  const watermarkPct = limitMb > 0 ? ((maxUsageMb / limitMb) * 100).toFixed(2) : "0.00";
  const oomHeadroomMb = Math.max(0, limitMb - maxUsageMb).toFixed(1);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            Memory High-Watermark Telemetry
          </h2>
          <div className="text-xs text-slate-500">
            Cgroup memory enforcement & OOM kill prevention
          </div>
        </div>
        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-medium">
          OOM Safe
        </span>
      </header>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-100 dark:border-slate-600/50">
            <div className="text-[11px] text-slate-500 uppercase">Current RAM</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {usageMb} <span className="text-xs font-normal">MB</span>
            </div>
            <div className="text-[10px] text-slate-400">{usagePct}% limit</div>
          </div>

          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200/50 dark:border-amber-800/40">
            <div className="text-[11px] text-amber-700 dark:text-amber-400 uppercase font-semibold">
              High-Watermark
            </div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {maxUsageMb} <span className="text-xs font-normal">MB</span>
            </div>
            <div className="text-[10px] text-amber-600/70">{watermarkPct}% peak</div>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-100 dark:border-slate-600/50">
            <div className="text-[11px] text-slate-500 uppercase">CFS Mem Limit</div>
            <div className="text-lg font-bold text-indigo-500">
              {limitMb > 1024 ? `${(limitMb / 1024).toFixed(1)} GB` : `${limitMb} MB`}
            </div>
            <div className="text-[10px] text-slate-400">Hard boundary</div>
          </div>
        </div>

        {/* High-Watermark Visual Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>RAM Allocation Threshold</span>
            <span>
              Peak: <strong>{maxUsageMb} MB</strong> / Limit:{" "}
              <strong>{limitMb > 1024 ? `${(limitMb / 1024).toFixed(1)} GB` : `${limitMb} MB`}</strong>
            </span>
          </div>

          <div className="relative w-full bg-slate-100 dark:bg-slate-700 h-6 rounded-sm overflow-hidden flex items-center">
            {/* Current Usage Bar */}
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, parseFloat(usagePct) || 1))}%` }}
            ></div>

            {/* High-Watermark Peak Indicator */}
            <div
              className="absolute h-full w-1 bg-amber-500 z-10"
              style={{ left: `${Math.min(99, Math.max(3, parseFloat(watermarkPct) || 2))}%` }}
              title={`High-Watermark: ${maxUsageMb} MB`}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-500 inline-block rounded-xs"></span> Current Usage ({usageMb} MB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-3 bg-amber-500 inline-block"></span> High-Watermark ({maxUsageMb} MB)
            </span>
          </div>
        </div>

        {/* Headroom / OOM Shield Notice */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
          <span>OOM Kill Safety Headroom:</span>
          <span className="font-bold text-emerald-500 font-mono">+{oomHeadroomMb} MB available</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardCardMemoryWatermark;

