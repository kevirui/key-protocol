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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ProjectData {
  category: string;
  completed: number;
  inProgress: number;
}

interface ProjectCompletionChartProps {
  data: ProjectData[];
}

const COLORS = ["#3B82F6", "#10B981"];

export default function ProjectCompletionChart({
  data,
}: ProjectCompletionChartProps) {
  // Transform data for bar chart
  const barData = data.map((item) => ({
    name: item.category,
    completed: item.completed,
    inProgress: item.inProgress,
  }));

  // Calculate totals for pie chart
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalInProgress = data.reduce((sum, item) => sum + item.inProgress, 0);

  const pieData = [
    {
      name: "Completados",
      value: totalCompleted,
      percentage: Math.round(
        (totalCompleted / (totalCompleted + totalInProgress)) * 100
      ),
    },
    {
      name: "En Progreso",
      value: totalInProgress,
      percentage: Math.round(
        (totalInProgress / (totalCompleted + totalInProgress)) * 100
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
      {/* Bar Chart */}
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="completed" fill="#3B82F6" name="Completados" />
            <Bar dataKey="inProgress" fill="#10B981" name="En Progreso" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-600">
                {entry.name} {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
