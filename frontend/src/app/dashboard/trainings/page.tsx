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
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  MapPin,
} from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string;
  technical: {
    name: string;
    email: string;
    organization: string;
    credentials: string;
  };
  producer: {
    name: string;
    email: string;
    organization: string;
    experience: string;
  };
  category: string;
  status: "pending" | "verified" | "rejected";
  evidence: {
    ipfsHash: string;
    type: string;
    size: number;
  };
  location: {
    country: string;
    region: string;
  };
  participants: {
    target: number;
    actual: number;
  };
  duration: number;
  date: {
    start: string;
    end: string;
  };
  blockchain?: {
    transactionHash: string;
    blockNumber: number;
    verifiedAt: string;
  };
}

export default function TrainingsPage() {
  const { t } = useTranslation();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Simulate API call
    const fetchTrainings = async () => {
      try {
        setTimeout(() => {
          const mockTrainings: Training[] = [
            {
              id: "1",
              title: "Técnicas de Riego Eficiente",
              description:
                "Capacitación en sistemas de riego por goteo y gestión eficiente del agua agrícola.",
              technical: {
                name: "Ing. Roberto Silva",
                email: "roberto.silva@agricultura.com",
                organization: "Instituto Agrícola Nacional",
                credentials: "Ingeniero Agrónomo, Especialista en Riego",
              },
              producer: {
                name: "Ana Martínez",
                email: "ana.martinez@ong.org",
                organization: "ONG Desarrollo Rural",
                experience: "10 años en desarrollo rural",
              },
              category: "agricultura",
              status: "verified",
              evidence: {
                ipfsHash: "Qm1234567890abcdef1234567890abcdef12345678",
                type: "video",
                size: 25600000,
              },
              location: {
                country: "México",
                region: "Norte",
              },
              participants: {
                target: 50,
                actual: 47,
              },
              duration: 16,
              date: {
                start: "2024-01-15",
                end: "2024-01-16",
              },
              blockchain: {
                transactionHash:
                  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                blockNumber: 1234567,
                verifiedAt: "2024-01-20",
              },
            },
            {
              id: "2",
              title: "Manejo de Cultivos Orgánicos",
              description:
                "Formación en técnicas de cultivo orgánico y certificación de productos.",
              technical: {
                name: "Dra. Carmen López",
                email: "carmen.lopez@organico.org",
                organization: "Centro de Investigación Orgánica",
                credentials: "PhD en Agronomía, Certificadora Orgánica",
              },
              producer: {
                name: "Luis Hernández",
                email: "luis.hernandez@verde.org",
                organization: "Fundación Verde",
                experience: "8 años en agricultura orgánica",
              },
              category: "agricultura",
              status: "pending",
              evidence: {
                ipfsHash:
                  "Qmabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
                type: "document",
                size: 15000000,
              },
              location: {
                country: "Colombia",
                region: "Eje Cafetero",
              },
              participants: {
                target: 30,
                actual: 30,
              },
              duration: 12,
              date: {
                start: "2024-02-10",
                end: "2024-02-11",
              },
            },
            {
              id: "3",
              title: "Tecnologías de Purificación de Agua",
              description:
                "Capacitación en sistemas de filtración y purificación de agua para comunidades rurales.",
              technical: {
                name: "Ing. Patricia Ruiz",
                email: "patricia.ruiz@agua.org",
                organization: "Instituto de Tecnología del Agua",
                credentials:
                  "Ingeniera Civil, Especialista en Tratamiento de Agua",
              },
              producer: {
                name: "Miguel Torres",
                email: "miguel.torres@msf.org",
                organization: "Médicos Sin Fronteras Local",
                experience: "12 años en proyectos de agua",
              },
              category: "tecnologia",
              status: "verified",
              evidence: {
                ipfsHash:
                  "Qm9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
                type: "video",
                size: 32000000,
              },
              location: {
                country: "Guatemala",
                region: "Altiplano",
              },
              participants: {
                target: 40,
                actual: 38,
              },
              duration: 20,
              date: {
                start: "2024-01-25",
                end: "2024-01-26",
              },
              blockchain: {
                transactionHash:
                  "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
                blockNumber: 1234568,
                verifiedAt: "2024-01-30",
              },
            },
          ];

          setTrainings(mockTrainings);
          setFilteredTrainings(mockTrainings);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  useEffect(() => {
    let filtered = trainings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (training) =>
          training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          training.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          training.technical.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          training.producer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (training) => training.status === statusFilter
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (training) => training.category === categoryFilter
      );
    }

    setFilteredTrainings(filtered);
  }, [trainings, searchTerm, statusFilter, categoryFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "agricultura":
        return "bg-yellow-100 text-yellow-800";
      case "tecnologia":
        return "bg-purple-100 text-purple-800";
      case "salud":
        return "bg-red-100 text-red-800";
      case "educacion":
        return "bg-green-100 text-green-800";
      case "negocios":
        return "bg-blue-100 text-blue-800";
      case "sostenibilidad":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleVerifyTraining = async (trainingId: string) => {
    try {
      // Simulate API call
      console.log(`Verifying training ${trainingId}`);

      // Update local state
      setTrainings((prev) =>
        prev.map((training) =>
          training.id === trainingId
            ? {
                ...training,
                status: "verified" as const,
                blockchain: {
                  transactionHash: `0x${Math.random()
                    .toString(16)
                    .substring(2, 66)}`,
                  blockNumber: Math.floor(Math.random() * 1000000),
                  verifiedAt: new Date().toISOString(),
                },
              }
            : training
        )
      );
    } catch (error) {
      console.error("Error verifying training:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Capacitaciones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y verifica capacitaciones registradas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Registrar Capacitación</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Buscar capacitaciones..."
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
                <option value="pending">Pendientes</option>
                <option value="verified">Verificadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="agricultura">Agricultura</option>
                <option value="tecnologia">Tecnología</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educación</option>
                <option value="negocios">Negocios</option>
                <option value="sostenibilidad">Sostenibilidad</option>
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

      {/* Trainings List */}
      <div className="space-y-4">
        {filteredTrainings.map((training) => (
          <Card key={training.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {training.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {training.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          training.status
                        )}`}
                      >
                        {getStatusIcon(training.status)}
                        <span className="ml-1">
                          {t(`training.statuses.${training.status}`)}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          training.category
                        )}`}
                      >
                        {t(`training.categories.${training.category}`)}
                      </span>
                    </div>
                  </div>

                  {/* Technical & Producer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Técnico
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <User size={14} className="mr-2" />
                          <span className="font-medium">
                            {training.technical.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {training.technical.organization}
                        </p>
                        <p className="text-xs text-gray-500">
                          {training.technical.credentials}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Productor
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <User size={14} className="mr-2" />
                          <span className="font-medium">
                            {training.producer.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {training.producer.organization}
                        </p>
                        <p className="text-xs text-gray-500">
                          {training.producer.experience}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="space-y-4">
                  {/* Evidence Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Evidencia
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium">IPFS Hash:</span>
                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                          {training.evidence.ipfsHash.substring(0, 20)}...
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Tipo:</span>
                        <span className="ml-2">{training.evidence.type}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Tamaño:</span>
                        <span className="ml-2">
                          {formatFileSize(training.evidence.size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Training Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Detalles
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-2" />
                        <span>
                          {training.location.region},{" "}
                          {training.location.country}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-2" />
                        <span>{training.duration} horas</span>
                      </div>
                      <div className="flex items-center">
                        <User size={12} className="mr-2" />
                        <span>
                          {training.participants.actual} /{" "}
                          {training.participants.target} participantes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  {training.blockchain && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Blockchain
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium">TX Hash:</span>
                          <span className="ml-2 font-mono bg-green-100 px-2 py-1 rounded">
                            {training.blockchain.transactionHash.substring(
                              0,
                              20
                            )}
                            ...
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Block:</span>
                          <span className="ml-2">
                            {training.blockchain.blockNumber}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Verificado:</span>
                          <span className="ml-2">
                            {new Date(
                              training.blockchain.verifiedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye size={16} className="mr-2" />
                      Ver Detalles
                    </Button>
                    {training.status === "pending" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerifyTraining(training.id)}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Verificar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTrainings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron capacitaciones
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
