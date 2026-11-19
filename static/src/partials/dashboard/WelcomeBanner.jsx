import React from "react";

function WelcomeBanner() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 p-4 sm:p-6 rounded-sm overflow-hidden mb-6 text-white shadow-md">
      {/* Background illustration */}
      <div
        className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block opacity-20"
        aria-hidden="true"
      >
        <svg width="319" height="198" xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="welcome-a" d="M64 0l64 128-64-20-64 20z" />
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="rotate(64 36.592 105.604)">
              <use fill="#FFFFFF" xlinkHref="#welcome-a" />
            </g>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🐳</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              DockerTool: Kernel Cgroup Telemetry & Provisioning Engine
            </h1>
          </div>
          <p className="text-indigo-100 text-sm max-w-3xl">
            Real-time observability engine isolating kernel vs. user-space CPU across 12 vCPUs,
            tracking memory high-watermarks, network I/O, and Linux CFS CPU quota enforcement (≥ 1000µs).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-indigo-900/60 backdrop-blur-xs px-3 py-1.5 rounded text-xs font-mono border border-indigo-400/30">
            <span className="text-emerald-300 font-bold">●</span> Polling Loop: 2s (Mutex Locked)
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
