"use client";

import React from "react";
import Link from "next/link";
import Button from "../components/ui/Button";
import {
  ArrowRight,
  Shield,
  Users,
  Target,
  Globe,
  ArrowDown,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                KEY Protocol
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button variant="ghost">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Libro de Contabilidad Compartido
              <span className="block text-primary-600">
                para el Impacto Social
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma blockchain para financiadores que buscan transparencia
              y trazabilidad en proyectos de impacto social. Visión integral y
              en tiempo real del progreso y el impacto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  variant="outline"
                >
                  Comenzar Ahora
                  <ArrowDown className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Acceder al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir KEY Protocol?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnología blockchain para garantizar transparencia, trazabilidad
              y confianza en proyectos de impacto social.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transparencia
              </h3>
              <p className="text-gray-600">
                Todas las transacciones y verificaciones están registradas en
                blockchain para máxima transparencia.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Impacto Real
              </h3>
              <p className="text-gray-600">
                Seguimiento en tiempo real del impacto social y número de
                beneficiarios alcanzados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verificación
              </h3>
              <p className="text-gray-600">
                Sistema de verificación de capacitaciones y evidencias mediante
                smart contracts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ODS</h3>
              <p className="text-gray-600">
                Alineación automática con los Objetivos de Desarrollo Sostenible
                de la ONU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución de la transparencia en proyectos de impacto
            social.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Crear Cuenta Gratuita
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
              >
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="ml-3 text-xl font-bold">KEY Protocol</span>
            </div>
            <p className="text-gray-400 mb-4">
              Libro de Contabilidad Compartido para el Impacto Social
            </p>
            <p className="text-sm text-gray-500">
              © 2024 KEY Protocol. Construido con tecnología blockchain en el
              ecosistema Polkadot.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
