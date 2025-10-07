"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { useAppStore } from "../../store/appStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();
  const { setLanguage, language } = useAppStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de KEY Protocol
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center space-x-2">
          {(["es", "en", "pt"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                language === lang
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label={t("auth.email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              required
            />

            <div className="relative">
              <Input
                label={t("auth.password")}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!formData.email || !formData.password}
          >
            {t("auth.login")}
          </Button>

          {/* Links */}
          <div className="text-center space-y-2">
            <Link
              href="/register"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              {t("auth.noAccount")} {t("auth.register")}
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Credenciales de prueba:
            </h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p>
                <strong>Financiador:</strong> funder@example.com / password123
              </p>
              <p>
                <strong>ONG:</strong> ong@example.com / password123
              </p>
              <p>
                <strong>Admin:</strong> admin@example.com / password123
              </p>
            </div>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} className="mr-1" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
