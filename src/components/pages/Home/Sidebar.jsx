import React from 'react';

export default function Sidebar({ isSidebarOpen }) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-[200px] min-w-[200px] border-r min-h-screen p-4 bg-white`}
    >
      Sidebar
    </div>
  );
}
