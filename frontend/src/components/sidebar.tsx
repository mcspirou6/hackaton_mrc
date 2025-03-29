import React from "react";
import { LayoutDashboard, Bell, LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <main className="pt-14 flex flex-col pl-5 w-[300px] h-screen bg-[#fffddd] fixed">
      <div className="flex">
        <img src="" alt="Profile" className="border-2 rounded-full w-8 h-8" />
        <span className="ml-5 text-xl font-semibold">John Doe</span>
      </div>
      <hr className="mt-8 mb-14" />
      <div className="flex flex-col gap-3 pl-5">
        <a href="#" className="flex text-center">
          <LayoutDashboard className="border-2 rounded-lg w-8 h-8" />
          <span className="ml-2 text-xl">Dashboard</span>
        </a>
        <a href="#" className="flex text-center">
          <Bell className="border-2 rounded-lg w-8 h-8" />
          <span className="ml-2 text-xl">Notification</span>
        </a>
      </div>
      <div className="flex mt-60">
        <LogOut className="border-2 rounded-lg w-8 h-8" />
        <span className="ml-2 text-xl">Déconnexion</span>
      </div>
    </main>
  );
};

export default Sidebar;
