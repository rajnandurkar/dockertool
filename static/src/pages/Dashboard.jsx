import React, { useState, useEffect } from "react";
import initialData from "../../../container_stats.json";
import Sidebar from "../partials/Sidebar";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardSummary from "../partials/dashboard/DashboardSummary";
import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import DashboardCardKernelUser from "../partials/dashboard/DashboardCardKernelUser";
import DashboardCard12Cores from "../partials/dashboard/DashboardCard12Cores";
import DashboardCardMemoryWatermark from "../partials/dashboard/DashboardCardMemoryWatermark";
import DashboardCardThrottling from "../partials/dashboard/DashboardCardThrottling";
import DashboardCardNetworkIO from "../partials/dashboard/DashboardCardNetworkIO";
import DashboardCard06 from "../partials/dashboard/DashboardCard06";
import Banner from "../partials/Banner";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [containers, setContainers] = useState(initialData || {});

  // Default to throttled worker if present, otherwise first container
  const containerIds = Object.keys(containers);
  const throttledId = containerIds.find(
    (id) => (containers[id]?.cpu_stats?.throttling_data?.throttled_periods || 0) > 0
  );
  const [selectedId, setSelectedId] = useState(throttledId || containerIds[0] || "");

  // Active container object
  const activeContainer = containers[selectedId] || Object.values(containers)[0] || {};

  // Poll Flask /stats endpoint every 2s for live telemetry (gracefully fallback if not running)
  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats");
        if (res.ok) {
          const liveData = await res.json();
          if (isMounted && liveData && Object.keys(liveData).length > 0) {
            setContainers(liveData);
          }
        }
      } catch (err) {
        // Flask daemon not currently reachable, keeping static snapshot
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div
            className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"
            style={{ marginBottom: "1rem" }}
          >
            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Top Multi-Container Selector & Engine Overview */}
            <DashboardSummary
              containers={containers}
              selectedId={selectedId}
              onSelectContainer={(id) => setSelectedId(id)}
            />

            {/* Main Telemetry Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Row 1: Real-Time CPU Sliding Window (8 cols) + Kernel vs User Isolation (4 cols) */}
              <DashboardCard05 container={activeContainer} />
              <DashboardCardKernelUser container={activeContainer} />

              {/* Row 2: 12 vCPUs Core Telemetry (8 cols) + CFS Quota Throttling Engine (4 cols) */}
              <DashboardCard12Cores container={activeContainer} />
              <DashboardCardThrottling container={activeContainer} />

              {/* Row 3: Memory High-Watermarks (4 cols) + Network I/O (4 cols) + Storage (4 cols) */}
              <DashboardCardMemoryWatermark container={activeContainer} />
              <DashboardCardNetworkIO container={activeContainer} />
              <DashboardCard06 />
            </div>
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
}

export default Dashboard;
