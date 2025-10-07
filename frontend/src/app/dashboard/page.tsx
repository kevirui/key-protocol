"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { DollarSign, Award, Users, TrendingUp, Expand } from "lucide-react";
import DashboardCharts from "../../components/dashboard/DashboardCharts";

interface DashboardMetrics {
  fundsAssigned: number;
  skillCertificates: number;
  beneficiariesReached: number;
  sroiRatio: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    fundsAssigned: 0,
    skillCertificates: 0,
    beneficiariesReached: 0,
    sroiRatio: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMetrics = async () => {
      try {
        // Mock data - in real app this would come from API
        setTimeout(() => {
          setMetrics({
            fundsAssigned: 1500000,
            skillCertificates: 750,
            beneficiariesReached: 2500,
            sroiRatio: 3,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  const metricCards = [
    {
      title: t("dashboard.metrics.fundsAssigned"),
      value: formatCurrency(metrics.fundsAssigned),
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("dashboard.metrics.skillCertificates"),
      value: formatNumber(metrics.skillCertificates),
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("dashboard.metrics.beneficiariesReached"),
      value: formatNumber(metrics.beneficiariesReached),
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: t("dashboard.metrics.sroiRatio"),
      value: `${metrics.sroiRatio}:1`,
      subtitle: `(${metrics.sroiRatio}$ ${t(
        "dashboard.metrics.sroiDescription"
      )})`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <div className="text-xs text-gray-500 mt-1">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}
                >
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  {t("common.expand")}
                  <Expand size={14} className="ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <DashboardCharts />
    </div>
  );
}
