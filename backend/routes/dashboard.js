const express = require("express");
const Project = require("../models/Project");
const Training = require("../models/Training");
const User = require("../models/User");
const router = express.Router();

// Get dashboard overview data
router.get("/overview", async (req, res) => {
  try {
    // Get project statistics
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalFundingRequested: { $sum: "$funding.requested" },
          totalFundingReceived: { $sum: "$funding.received" },
          totalBeneficiaries: { $sum: "$impact.actualBeneficiaries" },
          avgSROI: { $avg: "$impact.sroi" },
        },
      },
    ]);

    // Get training statistics
    const trainingStats = await Training.aggregate([
      {
        $group: {
          _id: null,
          totalTrainings: { $sum: 1 },
          verifiedTrainings: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] },
          },
          pendingTrainings: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          funders: {
            $sum: { $cond: [{ $eq: ["$role", "funder"] }, 1, 0] },
          },
          ongs: {
            $sum: { $cond: [{ $eq: ["$role", "ong"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get recent activity
    const recentProjects = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status funding updatedAt");

    const recentTrainings = await Training.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status category updatedAt");

    console.log("📊 Dashboard overview data retrieved");

    res.json({
      metrics: {
        fundsAssigned: projectStats[0]?.totalFundingReceived || 0,
        skillCertificates: trainingStats[0]?.verifiedTrainings || 0,
        beneficiariesReached: projectStats[0]?.totalBeneficiaries || 0,
        sroiRatio: projectStats[0]?.avgSROI || 0,
      },
      statistics: {
        projects: projectStats[0] || {
          totalProjects: 0,
          totalFundingRequested: 0,
          totalFundingReceived: 0,
          totalBeneficiaries: 0,
          avgSROI: 0,
        },
        trainings: trainingStats[0] || {
          totalTrainings: 0,
          verifiedTrainings: 0,
          pendingTrainings: 0,
        },
        users: userStats[0] || {
          totalUsers: 0,
          funders: 0,
          ongs: 0,
        },
      },
      recentActivity: {
        projects: recentProjects,
        trainings: recentTrainings,
      },
    });
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve dashboard data",
        error: error.message,
      });
  }
});

// Get project completion chart data
router.get("/charts/project-completion", async (req, res) => {
  try {
    const completionData = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          avgCompletionPercentage: { $avg: "$metrics.completionPercentage" },
        },
      },
      {
        $project: {
          category: "$_id",
          total: 1,
          completed: 1,
          inProgress: 1,
          avgCompletionPercentage: { $round: ["$avgCompletionPercentage", 1] },
          _id: 0,
        },
      },
    ]);

    console.log("📊 Project completion chart data retrieved");

    res.json({ data: completionData });
  } catch (error) {
    console.error("Get project completion chart error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve completion data",
        error: error.message,
      });
  }
});

// Get SDG alignment data
router.get("/charts/sdg-alignment", async (req, res) => {
  try {
    const sdgData = await Project.aggregate([
      { $unwind: "$impact.sdgs" },
      {
        $group: {
          _id: "$impact.sdgs",
          count: { $sum: 1 },
          totalFunding: { $sum: "$funding.requested" },
          totalBeneficiaries: { $sum: "$impact.actualBeneficiaries" },
        },
      },
      {
        $project: {
          sdg: "$_id",
          count: 1,
          totalFunding: 1,
          totalBeneficiaries: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log("📊 SDG alignment chart data retrieved");

    res.json({ data: sdgData });
  } catch (error) {
    console.error("Get SDG alignment chart error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve SDG data", error: error.message });
  }
});

// Get population impact trends
router.get("/charts/population-impact", async (req, res) => {
  try {
    const { months = 12 } = req.query;

    const impactData = await Project.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          beneficiaries: { $sum: "$impact.actualBeneficiaries" },
          projects: { $sum: 1 },
          funding: { $sum: "$funding.received" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    console.log("📊 Population impact trends data retrieved");

    res.json({ data: impactData });
  } catch (error) {
    console.error("Get population impact trends error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve impact trends",
        error: error.message,
      });
  }
});

// Get demographic data
router.get("/charts/demographics", async (req, res) => {
  try {
    // Gender distribution (mock data for now)
    const genderData = [
      { gender: "women", percentage: 67, count: 1675 },
      { gender: "men", percentage: 33, count: 825 },
    ];

    // Age group distribution (mock data for now)
    const ageData = [
      { ageGroup: "0-18", percentage: 45, label: "Jóvenes" },
      { ageGroup: "19-60", percentage: 45, label: "Adultos" },
      { ageGroup: "60+", percentage: 30, label: "Mayores" },
      { ageGroup: "other", percentage: 20, label: "Otros" },
    ];

    console.log("📊 Demographics data retrieved");

    res.json({
      gender: genderData,
      age: ageData,
    });
  } catch (error) {
    console.error("Get demographics error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve demographics",
        error: error.message,
      });
  }
});

module.exports = router;
