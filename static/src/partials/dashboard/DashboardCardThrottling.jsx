import React from "react";

function DashboardCardThrottling({ container }) {
  const throttling = container?.cpu_stats?.throttling_data || {};
  const periods = throttling.periods || 0;
  const throttledPeriods = throttling.throttled_periods || 0;
  const throttledNs = throttling.throttled_time || 0;
  const throttledSeconds = (throttledNs / 1000000000).toFixed(2);
  const throttledRate = throttling.throttled_rate !== undefined
    ? throttling.throttled_rate
    : periods > 0
    ? ((throttledPeriods / periods) * 100).toFixed(1)
    : 0;

  const isThrottled = throttledPeriods > 0;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            CFS CPU Quota & Throttling Engine
          </h2>
          <div className="text-xs text-slate-500">
            Linux Completely Fair Scheduler (CFS) Cgroup Telemetry
          </div>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded font-semibold ${
            isThrottled
              ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 animate-pulse"
              : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isThrottled ? "THROTTLED" : "UNCONSTRAINED"}
        </span>
      </header>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Status Callout */}
        <div
          className={`p-3 rounded mb-4 border ${
            isThrottled
              ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
              : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-200">
              CFS Throttle Ratio
            </span>
            <span
              className={`text-sm font-bold ${
                isThrottled ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"
              }`}
            >
              {throttledRate}%
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isThrottled
              ? `Kernel CFS quota constraint active: ${throttledPeriods.toLocaleString()} periods throttled.`
              : "No kernel throttling detected. Container operates within unconstrained CFS limits."}
          </p>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <div className="text-xs text-slate-500">Total Periods</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">
              {periods.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">CFS 100ms cycles</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <div className="text-xs text-slate-500">Throttled Periods</div>
            <div className={`text-xl font-bold font-mono ${isThrottled ? "text-amber-500" : "text-slate-700"}`}>
              {throttledPeriods.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Quota boundary hits</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <div className="text-xs text-slate-500">Throttled Duration</div>
            <div className="text-xl font-bold text-amber-500 font-mono">
              {throttledSeconds} <span className="text-xs">sec</span>
            </div>
            <div className="text-[10px] text-slate-400">Cumulative CPU holdback</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <div className="text-xs text-slate-500">CFS CPU Quota Rule</div>
            <div className="text-sm font-bold text-indigo-500 font-mono mt-1">
              {isThrottled ? "50,000 µs (0.5 vCPU)" : "Unconstrained"}
            </div>
            <div className="text-[10px] text-slate-400">Limit: ≥ 1000 µs enforced</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Live cgroup CPU bandwidth throttling telemetry via Docker Engine
        </div>
      </div>
    </div>
  );
}

export default DashboardCardThrottling;

