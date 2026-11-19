import React from "react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function DashboardCardNetworkIO({ container }) {
  const net = container?.network_stats || {};
  const rxBytes = net.rx_bytes || 0;
  const txBytes = net.tx_bytes || 0;
  const rxPackets = net.rx_packets || 0;
  const txPackets = net.tx_packets || 0;

  const totalBytes = rxBytes + txBytes || 1;
  const rxPct = Math.round((rxBytes / totalBytes) * 100);
  const txPct = 100 - rxPct;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            Network I/O Telemetry
          </h2>
          <div className="text-xs text-slate-500">
            Container network namespace throughput & packet flow
          </div>
        </div>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">
          eth0 (Virtual veth)
        </span>
      </header>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Rx vs Tx Big Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Rx (Received) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded border-l-4 border-emerald-500">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>RX (Received)</span>
              <span className="text-emerald-500 font-bold">↓</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
              {formatBytes(rxBytes)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {rxPackets.toLocaleString()} packets
            </div>
          </div>

          {/* Tx (Transmitted) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded border-l-4 border-indigo-500">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>TX (Transmitted)</span>
              <span className="text-indigo-500 font-bold">↑</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
              {formatBytes(txBytes)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {txPackets.toLocaleString()} packets
            </div>
          </div>
        </div>

        {/* Traffic Proportion Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Traffic Balance</span>
            <span>
              RX: <strong>{rxPct}%</strong> / TX: <strong>{txPct}%</strong>
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${rxPct}%` }}
              title={`RX: ${rxPct}%`}
            ></div>
            <div
              className="bg-indigo-500 h-full transition-all duration-500"
              style={{ width: `${txPct}%` }}
              title={`TX: ${txPct}%`}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Incoming Ingress
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span> Outgoing Egress
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Docker bridge virtual ethernet device telemetry
        </div>
      </div>
    </div>
  );
}

export default DashboardCardNetworkIO;

