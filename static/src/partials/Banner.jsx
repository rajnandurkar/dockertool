import React, { useState } from 'react';

function Banner() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <>
      {bannerOpen && (
        <div className="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50">
          <div className="bg-slate-800 border border-slate-700 text-slate-50 text-sm p-3 md:rounded shadow-lg flex items-center justify-between gap-3">
            <div className="text-slate-300 inline-flex items-center gap-1.5">
              <span>🐳</span>
              <a
                className="font-medium hover:underline text-indigo-400"
                href="https://github.com/rajnandurkar/dockertool"
                target="_blank"
                rel="noreferrer"
              >
                DockerTool
              </a>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-xs">Kernel Cgroup Provisioning Engine</span>
            </div>
            <button
              className="text-slate-500 hover:text-slate-400 pl-2 border-l border-slate-700"
              onClick={() => setBannerOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
                <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Banner;
