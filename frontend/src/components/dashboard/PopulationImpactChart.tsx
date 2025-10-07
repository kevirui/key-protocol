"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PopulationData {
  month: string;
  population: number;
  mothers: number;
}

interface PopulationImpactChartProps {
  data: PopulationData[];
}

export default function PopulationImpactChart({
  data,
}: PopulationImpactChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            formatter={(value, name) => [
              `${value}`,
              name === "population"
                ? "Población Desatendida"
                : name === "mothers"
                ? "Madres de familia"
                : name,
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "population"
                ? "Población Desatendida"
                : value === "mothers"
                ? "Madres de familia"
                : value
            }
          />
          <Line
            type="monotone"
            dataKey="population"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            name="population"
          />
          <Line
            type="monotone"
            dataKey="mothers"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
            name="mothers"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
