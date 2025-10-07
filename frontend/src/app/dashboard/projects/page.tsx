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
import Input from "../../components/ui/Input";
import {
  Search,
  Filter,
  Eye,
  DollarSign,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: string;
  status: string;
  funding: {
    requested: number;
    received: number;
    currency: string;
  };
  location: {
    country: string;
    region: string;
  };
  impact: {
    targetBeneficiaries: number;
    actualBeneficiaries: number;
    sroi: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    duration: number;
  };
  metrics: {
    completionPercentage: number;
  };
}

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      try {
        setTimeout(() => {
          const mockProjects: Project[] = [
            {
              id: "1",
              title: "Proyecto Agua Limpia",
              description:
                "Implementación de sistemas de purificación de agua en comunidades rurales del norte del país.",
              organization: "ONG Desarrollo Rural",
              category: "agua",
              status: "in-progress",
              funding: {
                requested: 50000,
                received: 35000,
                currency: "USD",
              },
              location: {
                country: "México",
                region: "Norte",
              },
              impact: {
                targetBeneficiaries: 500,
                actualBeneficiaries: 350,
                sroi: 3.2,
              },
              timeline: {
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                duration: 12,
              },
              metrics: {
                completionPercentage: 70,
              },
            },
            {
              id: "2",
              title: "Capacitación en Agricultura Sostenible",
              description:
                "Programa de formación para agricultores en técnicas sostenibles y orgánicas.",
              organization: "Fundación Verde",
              category: "agricultura",
              status: "completed",
              funding: {
                requested: 25000,
                received: 25000,
                currency: "USD",
              },
              location: {
                country: "Colombia",
                region: "Eje Cafetero",
              },
              impact: {
                targetBeneficiaries: 200,
                actualBeneficiaries: 200,
                sroi: 4.1,
              },
              timeline: {
                startDate: "2023-06-01",
                endDate: "2024-05-31",
                duration: 12,
              },
              metrics: {
                completionPercentage: 100,
              },
            },
            {
              id: "3",
              title: "Salud Rural - Clínicas Móviles",
              description:
                "Despliegue de clínicas móviles para atención médica en zonas rurales aisladas.",
              organization: "Médicos Sin Fronteras Local",
              category: "salud",
              status: "available",
              funding: {
                requested: 75000,
                received: 0,
                currency: "USD",
              },
              location: {
                country: "Guatemala",
                region: "Altiplano",
              },
              impact: {
                targetBeneficiaries: 1000,
                actualBeneficiaries: 0,
                sroi: 2.8,
              },
              timeline: {
                startDate: "2024-03-01",
                endDate: "2025-02-28",
                duration: 12,
              },
              metrics: {
                completionPercentage: 0,
              },
            },
          ];

          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "funded") {
        filtered = filtered.filter(
          (project) =>
            project.status === "funded" ||
            project.status === "in-progress" ||
            project.status === "completed"
        );
      } else {
        filtered = filtered.filter(
          (project) => project.status === statusFilter
        );
      }
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.category === categoryFilter
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, categoryFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800";
      case "funded":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "agua":
        return "bg-blue-100 text-blue-800";
      case "salud":
        return "bg-red-100 text-red-800";
      case "educacion":
        return "bg-green-100 text-green-800";
      case "agricultura":
        return "bg-yellow-100 text-yellow-800";
      case "energia":
        return "bg-orange-100 text-orange-800";
      case "tecnologia":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y explora proyectos de impacto social
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Nuevo Proyecto</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} />}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="available">Disponibles</option>
                <option value="funded">Financiados</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completados</option>
              </select>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="agua">Agua</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educación</option>
                <option value="agricultura">Agricultura</option>
                <option value="energia">Energía</option>
                <option value="tecnologia">Tecnología</option>
              </select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Filter size={16} className="mr-2" />
                Más Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {project.title}
                </CardTitle>
                <div className="flex flex-col space-y-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {t(`projects.statuses.${project.status}`)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      project.category
                    )}`}
                  >
                    {t(`projects.categories.${project.category}`)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Organization */}
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">Organización:</span>
                <span className="ml-2">{project.organization}</span>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>
                  {project.location.region}, {project.location.country}
                </span>
              </div>

              {/* Funding */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span>Financiamiento</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(project.funding.received)} /{" "}
                    {formatCurrency(project.funding.requested)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(
                      (project.funding.received / project.funding.requested) *
                        100
                    )}
                    % financiado
                  </div>
                </div>
              </div>

              {/* Beneficiaries */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span>Beneficiarios</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {project.impact.actualBeneficiaries} /{" "}
                    {project.impact.targetBeneficiaries}
                  </div>
                  <div className="text-xs text-gray-500">
                    SROI: {project.impact.sroi}:1
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Duración</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {project.timeline.duration} meses
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.metrics.completionPercentage}% completado
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye size={16} className="mr-2" />
                  Ver Detalles
                </Button>
                {project.status === "available" && (
                  <Button size="sm" className="flex-1">
                    <DollarSign size={16} className="mr-2" />
                    Financiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
