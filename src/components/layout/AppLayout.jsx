import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SessionTimeoutModal from "../security/SessionTimeoutModal";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <SessionTimeoutModal />
    </div>
  );
}