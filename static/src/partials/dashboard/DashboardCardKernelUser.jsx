import React from "react";
import DoughnutChart from "../../charts/DoughnutChart";
import { tailwindConfig } from "../../utils/Utils";

function DashboardCardKernelUser({ container }) {
  const cpuStats = container?.cpu_stats || {};
  const kernelNs = cpuStats.usage_in_kernelmode || 0;
  const userNs = cpuStats.usage_in_usermode || 0;

  // Convert nanoseconds to milliseconds
  const kernelMs = Math.round(kernelNs / 1000000);
  const userMs = Math.round(userNs / 1000000);
  const totalMs = kernelMs + userMs || 1;

  const kernelPct = ((kernelMs / totalMs) * 100).toFixed(1);
  const userPct = ((userMs / totalMs) * 100).toFixed(1);

  const chartData = {
    labels: [
      `User Space (${userPct}%)`,
      `Kernel Space (${kernelPct}%)`,
    ],
    datasets: [
      {
        label: "CPU Runtime Isolation",
        data: [userMs || 1, kernelMs || 1],
        backgroundColor: [
          tailwindConfig().theme.colors.indigo[500],
          tailwindConfig().theme.colors.amber[500],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.indigo[600],
          tailwindConfig().theme.colors.amber[600],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Kernel vs. User Space Runtime</span>
        </h2>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-medium">
          Cgroup Isolation
        </span>
      </header>

      {/* Breakdown stat pills */}
      <div className="px-5 pt-3 grid grid-cols-2 gap-2 text-center">
        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
          <div className="text-xs text-slate-500 dark:text-slate-400">User Space</div>
          <div className="text-lg font-bold text-indigo-500">{userMs.toLocaleString()} ms</div>
          <div className="text-[11px] text-slate-400">{userPct}% of runtime</div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
          <div className="text-xs text-slate-500 dark:text-slate-400">Kernel Space</div>
          <div className="text-lg font-bold text-amber-500">{kernelMs.toLocaleString()} ms</div>
          <div className="text-[11px] text-slate-400">{kernelPct}% syscall overhead</div>
        </div>
      </div>

      <div className="grow flex flex-col justify-center">
        <div>
          <DoughnutChart data={chartData} width={389} height={200} />
        </div>
      </div>
      <div className="px-5 pb-3 text-xs text-slate-400 text-center">
        Isolated runtime via Docker SDK cgroup telemetry
      </div>
    </div>
  );
}

export default DashboardCardKernelUser;

