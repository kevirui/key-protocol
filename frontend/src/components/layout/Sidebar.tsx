"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  FolderOpen,
  GraduationCap,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Trainings", href: "/dashboard/trainings", icon: GraduationCap },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">
                KEY Protocol
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.organization}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                  {user?.role === "funder"
                    ? "Financiador"
                    : user?.role === "ong"
                    ? "ONG"
                    : "Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary-100 text-primary-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon size={20} className="mr-3" />
                      {t(`nav.${item.name.toLowerCase()}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <User size={20} className="mr-3" />
                  {t("nav.profile")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <Settings size={20} className="mr-3" />
                  {t("nav.settings")}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <Settings size={20} className="mr-3" />
                  {t("nav.logout")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
