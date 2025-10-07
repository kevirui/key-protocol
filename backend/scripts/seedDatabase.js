const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Project = require("../models/Project");
const Training = require("../models/Training");

// Mock data
const mockUsers = [
  {
    email: "funder@example.com",
    password: "password123",
    name: "Juan Pérez",
    organization: "Fundación Impacto Social",
    role: "funder",
  },
  {
    email: "ong@example.com",
    password: "password123",
    name: "María García",
    organization: "ONG Desarrollo Rural",
    role: "ong",
  },
  {
    email: "admin@example.com",
    password: "password123",
    name: "Carlos Admin",
    organization: "KEY Protocol",
    role: "admin",
  },
];

const mockProjects = [
  {
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
    timeline: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      duration: 12,
    },
    impact: {
      targetBeneficiaries: 500,
      actualBeneficiaries: 350,
      sroi: 3.2,
      sdgs: ["6", "3", "11"],
    },
    metrics: {
      completionPercentage: 70,
      lastUpdate: new Date(),
    },
  },
  {
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
    timeline: {
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-05-31"),
      duration: 12,
    },
    impact: {
      targetBeneficiaries: 200,
      actualBeneficiaries: 200,
      sroi: 4.1,
      sdgs: ["2", "15", "12"],
    },
    metrics: {
      completionPercentage: 100,
      lastUpdate: new Date(),
    },
  },
  {
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
    timeline: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2025-02-28"),
      duration: 12,
    },
    impact: {
      targetBeneficiaries: 1000,
      actualBeneficiaries: 0,
      sroi: 2.8,
      sdgs: ["3", "1", "10"],
    },
    metrics: {
      completionPercentage: 0,
      lastUpdate: new Date(),
    },
  },
  {
    title: "Educación Digital Rural",
    description:
      "Programa de alfabetización digital y acceso a tecnología educativa en comunidades rurales.",
    organization: "Fundación Educativa Rural",
    category: "educacion",
    status: "funded",
    funding: {
      requested: 40000,
      received: 40000,
      currency: "USD",
    },
    location: {
      country: "Perú",
      region: "Sierra",
    },
    timeline: {
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-11-30"),
      duration: 10,
    },
    impact: {
      targetBeneficiaries: 300,
      actualBeneficiaries: 150,
      sroi: 3.5,
      sdgs: ["4", "10", "17"],
    },
    metrics: {
      completionPercentage: 45,
      lastUpdate: new Date(),
    },
  },
];

const mockTrainings = [
  {
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
      start: new Date("2024-01-15"),
      end: new Date("2024-01-16"),
    },
    blockchain: {
      transactionHash:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      blockNumber: 1234567,
      verifiedAt: new Date("2024-01-20"),
    },
  },
  {
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
      start: new Date("2024-02-10"),
      end: new Date("2024-02-11"),
    },
  },
  {
    title: "Tecnologías de Purificación de Agua",
    description:
      "Capacitación en sistemas de filtración y purificación de agua para comunidades rurales.",
    technical: {
      name: "Ing. Patricia Ruiz",
      email: "patricia.ruiz@agua.org",
      organization: "Instituto de Tecnología del Agua",
      credentials: "Ingeniera Civil, Especialista en Tratamiento de Agua",
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
      ipfsHash: "Qm9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
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
      start: new Date("2024-01-25"),
      end: new Date("2024-01-26"),
    },
    blockchain: {
      transactionHash:
        "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      blockNumber: 1234568,
      verifiedAt: new Date("2024-01-30"),
    },
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/key-protocol"
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Training.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of mockUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.email} (${user.role})`);
    }

    // Create projects
    console.log("📊 Creating projects...");
    for (const projectData of mockProjects) {
      const project = new Project(projectData);
      await project.save();
      console.log(`   ✅ Created project: ${project.title}`);
    }

    // Create trainings
    console.log("📚 Creating trainings...");
    for (const trainingData of mockTrainings) {
      const training = new Training(trainingData);
      await training.save();
      console.log(`   ✅ Created training: ${training.title}`);
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Test accounts created:");
    console.log("   Funder: funder@example.com / password123");
    console.log("   ONG:    ong@example.com / password123");
    console.log("   Admin:  admin@example.com / password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();
