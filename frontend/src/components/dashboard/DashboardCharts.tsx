"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import ProjectCompletionChart from "./ProjectCompletionChart";
import SDGAlignmentChart from "./SDGAlignmentChart";
import PopulationImpactChart from "./PopulationImpactChart";
import DemographicsChart from "./DemographicsChart";

interface ChartData {
  projectCompletion: any[];
  sdgAlignment: any[];
  populationImpact: any[];
  demographics: {
    gender: any[];
    age: any[];
  };
}

export default function DashboardCharts() {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartData>({
    projectCompletion: [],
    sdgAlignment: [],
    populationImpact: [],
    demographics: { gender: [], age: [] },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for chart data
    const fetchChartData = async () => {
      try {
        // Mock data based on the image
        setTimeout(() => {
          setChartData({
            projectCompletion: [
              { category: "Proyecto Agua", completed: 45, inProgress: 45 },
              { category: "Agua Limpia", completed: 85, inProgress: 30 },
              { category: "Campacito de bo", completed: 60, inProgress: 42 },
              { category: "Salud Rural", completed: 60, inProgress: 78 },
            ],
            sdgAlignment: [
              { sdg: "6", count: 10, funding: 25000, beneficiaries: 500 },
              { sdg: "3", count: 8, funding: 40000, beneficiaries: 1000 },
              { sdg: "4", count: 6, funding: 30000, beneficiaries: 600 },
              { sdg: "1", count: 12, funding: 50000, beneficiaries: 1200 },
              { sdg: "15", count: 4, funding: 20000, beneficiaries: 400 },
            ],
            populationImpact: [
              { month: "Jun", population: 200, mothers: 150 },
              { month: "Jul", population: 350, mothers: 200 },
              { month: "Ago", population: 500, mothers: 300 },
              { month: "Sep", population: 650, mothers: 400 },
              { month: "Oct", population: 800, mothers: 500 },
              { month: "Nov", population: 950, mothers: 600 },
              { month: "Dic", population: 1100, mothers: 700 },
            ],
            demographics: {
              gender: [
                { gender: "Mujeres", percentage: 67, count: 1675 },
                { gender: "Hombres", percentage: 33, count: 825 },
              ],
              age: [
                { ageGroup: "0-18", percentage: 45, label: "Jóvenes" },
                { ageGroup: "19-60", percentage: 45, label: "Adultos" },
                { ageGroup: "60+", percentage: 30, label: "Mayores" },
                { ageGroup: "other", percentage: 20, label: "Otros" },
              ],
            },
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="h-96">
            <CardContent className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First Row - Project Completion and SDG Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.charts.projectCompletion")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectCompletionChart data={chartData.projectCompletion} />
          </CardContent>
        </Card>

        {/* SDG Alignment Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.charts.sdgAlignment")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SDGAlignmentChart data={chartData.sdgAlignment} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Population Impact and Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Impact Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.charts.populationImpact")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PopulationImpactChart data={chartData.populationImpact} />
          </CardContent>
        </Card>

        {/* Demographics Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.charts.demographics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DemographicsChart
              genderData={chartData.demographics.gender}
              ageData={chartData.demographics.age}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
