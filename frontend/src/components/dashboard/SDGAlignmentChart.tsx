"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SDGData {
  sdg: string;
  count: number;
  funding: number;
  beneficiaries: number;
}

interface SDGAlignmentChartProps {
  data: SDGData[];
}

const SDG_ICONS: { [key: string]: string } = {
  "1": "🎯", // No Poverty
  "2": "🌾", // Zero Hunger
  "3": "🏥", // Good Health
  "4": "📚", // Quality Education
  "5": "⚖️", // Gender Equality
  "6": "💧", // Clean Water
  "7": "⚡", // Affordable Energy
  "8": "💼", // Decent Work
  "9": "🏭", // Industry Innovation
  "10": "📊", // Reduced Inequalities
  "11": "🏙️", // Sustainable Cities
  "12": "🔄", // Responsible Consumption
  "13": "🌍", // Climate Action
  "14": "🌊", // Life Below Water
  "15": "🌳", // Life on Land
  "16": "🤝", // Peace and Justice
  "17": "🤲", // Partnerships
};

export default function SDGAlignmentChart({ data }: SDGAlignmentChartProps) {
  const chartData = data.map((item) => ({
    sdg: `SDG ${item.sdg}`,
    icon: SDG_ICONS[item.sdg] || "🎯",
    count: item.count,
    funding: item.funding,
    beneficiaries: item.beneficiaries,
  }));

  return (
    <div className="space-y-4">
      {/* Horizontal Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 15]} fontSize={12} />
            <YAxis
              dataKey="sdg"
              type="category"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value}`,
                name === "count"
                  ? "Proyectos"
                  : name === "funding"
                  ? "Financiamiento ($)"
                  : "Beneficiarios",
              ]}
            />
            <Bar dataKey="count" fill="#3B82F6" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SDG Buttons */}
      <div className="flex flex-wrap gap-2">
        {data.slice(0, 2).map((item) => (
          <button
            key={item.sdg}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-lg">{SDG_ICONS[item.sdg] || "🎯"}</span>
            <span className="text-sm font-medium text-blue-900">
              SDG {item.sdg}
            </span>
            <span className="text-xs text-blue-600">
              {item.count} proyectos
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
