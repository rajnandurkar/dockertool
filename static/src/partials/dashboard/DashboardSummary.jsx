import React from "react";

function DashboardSummary({ containers, selectedId, onSelectContainer }) {
  const containerList = Object.values(containers || {});
  const activeCount = containerList.length;
  const throttledCount = containerList.filter(
    (c) => c?.cpu_stats?.throttling_data?.throttled_periods > 0
  ).length;

  return (
    <div className="mb-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Active Containers */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-sm border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
            Active Containers
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {activeCount}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              Cgroup v2 Active
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Multi-threaded polling daemon (2s)</div>
        </div>

        {/* CFS Throttled Containers */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-sm border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
            CFS Throttled Containers
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-amber-500">
              {throttledCount} / {activeCount}
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              throttledCount > 0
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                : "bg-slate-100 text-slate-600"
            }`}>
              {throttledCount > 0 ? "CFS Quota Hit" : "No Throttling"}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Linux CFS Quota (≥ 1000µs)</div>
        </div>

        {/* Monitored vCPUs */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-sm border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
            Telemetry Cores
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-indigo-500">12 vCPUs</div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              Per-core Isolation
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Kernel vs. User Isolation</div>
        </div>

        {/* Diagnostics & Alerting */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-sm border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
            Diagnostics Engine
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-emerald-500">TLS Active</div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              SMTP SSL / 587
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Automated JSON logging active</div>
        </div>
      </div>

      {/* Container Selector Tabs */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Target Container:</span>
          <div className="flex flex-wrap gap-2">
            {containerList.map((c) => {
              const isSelected = c.id === selectedId;
              const isThrottled = (c?.cpu_stats?.throttling_data?.throttled_periods || 0) > 0;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectContainer(c.id)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-indigo-500 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isThrottled ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  ></span>
                  <span>{c.name}</span>
                  {isThrottled && (
                    <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">
                      THROTTLED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Showing telemetry for: <strong className="text-slate-700 dark:text-slate-200">{containers[selectedId]?.name || "N/A"}</strong>
        </div>
      </div>
    </div>
  );
}

export default DashboardSummary;

