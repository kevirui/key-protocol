"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenderData {
  gender: string;
  percentage: number;
  count: number;
}

interface AgeData {
  ageGroup: string;
  percentage: number;
  label: string;
}

interface DemographicsChartProps {
  genderData: GenderData[];
  ageData: AgeData[];
}

const GENDER_COLORS = ["#EC4899", "#3B82F6"];
const AGE_COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DemographicsChart({
  genderData,
  ageData,
}: DemographicsChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Distribución por Género
        </h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={50}
                paddingAngle={5}
                dataKey="percentage"
              >
                {genderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Legend */}
        <div className="space-y-2">
          {genderData.map((entry, index) => (
            <div
              key={entry.gender}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: GENDER_COLORS[index] }}
                />
                <span className="text-sm text-gray-600">{entry.gender}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Age Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Distribución por Edad
        </h4>
        <div className="space-y-3">
          {ageData.map((entry, index) => (
            <div
              key={entry.ageGroup}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: AGE_COLORS[index % AGE_COLORS.length],
                  }}
                />
                <span className="text-sm text-gray-600">{entry.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
