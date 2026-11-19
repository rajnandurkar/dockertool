import React from "react";

function DashboardCard12Cores({ container }) {
  const perProcess = container?.cpu_stats?.per_process || {};
  const coreEntries = Object.entries(perProcess);

  // Find max usage across cores for proportional bar calculation
  const maxCoreUsage = Math.max(
    ...coreEntries.map(([_, data]) => data.total_usage || 0),
    1
  );

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            12 vCPUs Core Runtime Telemetry
          </h2>
          <div className="text-xs text-slate-500">
            Per-vCPU execution load isolation across host logical cores
          </div>
        </div>
        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
          {coreEntries.length} Cores Tracked
        </span>
      </header>

      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {coreEntries.map(([coreName, stats], index) => {
            const usageMs = Math.round((stats.total_usage || 0) / 1000000);
            const percentageOfMax = Math.min(
              100,
              Math.round(((stats.total_usage || 0) / maxCoreUsage) * 100)
            );
            const isActive = stats.total_usage > 0;

            return (
              <div
                key={coreName}
                className={`p-3 rounded border transition-all ${
                  isActive
                    ? "bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
                    {coreName}
                  </span>
                  <span
                    className={`text-[11px] font-semibold font-mono ${
                      isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400"
                    }`}
                  >
                    {usageMs.toLocaleString()} ms
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-600 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      percentageOfMax > 70
                        ? "bg-amber-500"
                        : percentageOfMax > 30
                        ? "bg-indigo-500"
                        : "bg-blue-400"
                    }`}
                    style={{ width: `${Math.max(percentageOfMax, isActive ? 5 : 0)}%` }}
                  ></div>
                </div>

                <div className="mt-1 text-[10px] text-slate-400 flex justify-between">
                  <span>Usage share</span>
                  <span>{percentageOfMax}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard12Cores;

