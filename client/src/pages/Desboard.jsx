import React from "react";
import { NavLink } from "react-router-dom";

const Desboard = () => {
  return (
    <div className="w-full h-[92vh] p-5 flex items-center justify-center flex-col bg-black gap-5 overflow-hidden">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        welcome to admin panel
      </h1>
      <NavLink
        to="/create"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
      >
        create emplopy
      </NavLink>
    </div>
  );
};

export default Desboard;
