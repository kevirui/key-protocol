"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import { Menu, Bell, Settings, Globe } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const { toggleSidebar, sidebarOpen, setLanguage, language } = useAppStore();
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("nav.dashboard")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Visión integral y en tiempo real del progreso y el impacto de
                los proyectos
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              {(["es", "en", "pt"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-1.5 text-xs rounded transition-colors ${
                    language === lang
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.organization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
