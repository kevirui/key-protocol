const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// Get all projects with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      status,
      category,
      minFunding,
      maxFunding,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (minFunding || maxFunding) {
      filter["funding.requested"] = {};
      if (minFunding) filter["funding.requested"].$gte = parseInt(minFunding);
      if (maxFunding) filter["funding.requested"].$lte = parseInt(maxFunding);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("funders.funderId", "name email organization");

    const total = await Project.countDocuments(filter);

    console.log(`📊 Projects retrieved: ${projects.length} of ${total}`);

    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve projects", error: error.message });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "funders.funderId",
      "name email organization"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log(`📄 Project retrieved: ${project.title}`);

    res.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve project", error: error.message });
  }
});

// Create new project (for ONGs)
router.post("/", async (req, res) => {
  try {
    const projectData = req.body;

    // Validate required fields
    if (
      !projectData.title ||
      !projectData.description ||
      !projectData.organization
    ) {
      return res.status(400).json({
        message: "Title, description, and organization are required",
      });
    }

    const project = new Project(projectData);
    await project.save();

    console.log(`✅ New project created: ${project.title}`);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project
    Object.assign(project, req.body);
    project.metrics.lastUpdate = new Date();
    await project.save();

    console.log(`✅ Project updated: ${project.title}`);

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res
      .status(500)
      .json({ message: "Failed to update project", error: error.message });
  }
});

// Fund a project
router.post("/:id/fund", async (req, res) => {
  try {
    const { amount, transactionHash } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Valid funding amount is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Add funder to project
    project.funders.push({
      amount,
      transactionHash,
      date: new Date(),
    });

    // Update funding received
    project.funding.received += amount;

    // Update status if fully funded
    if (project.funding.received >= project.funding.requested) {
      project.status = "funded";
    }

    await project.save();

    console.log(`💰 Project funded: ${project.title} - $${amount}`);

    res.json({
      message: "Project funded successfully",
      project,
    });
  } catch (error) {
    console.error("Fund project error:", error);
    res
      .status(500)
      .json({ message: "Failed to fund project", error: error.message });
  }
});

// Get project statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalFundingRequested: { $sum: "$funding.requested" },
          totalFundingReceived: { $sum: "$funding.received" },
          avgCompletionPercentage: { $avg: "$metrics.completionPercentage" },
          totalBeneficiaries: { $sum: "$impact.actualBeneficiaries" },
        },
      },
    ]);

    const statusStats = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalFunding: { $sum: "$funding.requested" },
        },
      },
    ]);

    console.log("📊 Project statistics retrieved");

    res.json({
      overview: stats[0] || {
        totalProjects: 0,
        totalFundingRequested: 0,
        totalFundingReceived: 0,
        avgCompletionPercentage: 0,
        totalBeneficiaries: 0,
      },
      statusBreakdown: statusStats,
      categoryBreakdown: categoryStats,
    });
  } catch (error) {
    console.error("Get project stats error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve project statistics",
        error: error.message,
      });
  }
});

module.exports = router;
