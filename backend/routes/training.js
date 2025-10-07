const express = require("express");
const Training = require("../models/Training");
const router = express.Router();

// Get all trainings with filtering
router.get("/", async (req, res) => {
  try {
    const {
      status,
      category,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const trainings = await Training.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Training.countDocuments(filter);

    console.log(`📚 Trainings retrieved: ${trainings.length} of ${total}`);

    res.json({
      trainings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get trainings error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve trainings", error: error.message });
  }
});

// Get training by ID
router.get("/:id", async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    console.log(`📄 Training retrieved: ${training.title}`);

    res.json({ training });
  } catch (error) {
    console.error("Get training error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve training", error: error.message });
  }
});

// Register new training
router.post("/register", async (req, res) => {
  try {
    const trainingData = req.body;

    // Validate required fields
    if (
      !trainingData.title ||
      !trainingData.description ||
      !trainingData.technical ||
      !trainingData.producer
    ) {
      return res.status(400).json({
        message:
          "Title, description, technical info, and producer info are required",
      });
    }

    // Generate mock IPFS hash (in real implementation, this would be uploaded to IPFS)
    const mockIpfsHash = `Qm${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const training = new Training({
      ...trainingData,
      evidence: {
        ipfsHash: mockIpfsHash,
        type: trainingData.evidence?.type || "document",
        uploadedAt: new Date(),
      },
      status: "pending",
    });

    await training.save();

    console.log(`✅ New training registered: ${training.title}`);

    res.status(201).json({
      message: "Training registered successfully",
      id: training._id,
      hash: training.evidence.ipfsHash,
      status: training.status,
    });
  } catch (error) {
    console.error("Register training error:", error);
    res
      .status(500)
      .json({ message: "Failed to register training", error: error.message });
  }
});

// List all trainings (for MVP)
router.get("/list/all", async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 }).limit(50);

    console.log(`📚 All trainings listed: ${trainings.length}`);

    res.json({
      message: "Trainings retrieved successfully",
      trainings: trainings.map((training) => ({
        id: training._id,
        title: training.title,
        description: training.description,
        technical: training.technical,
        producer: training.producer,
        status: training.status,
        hash: training.evidence.ipfsHash,
        category: training.category,
        createdAt: training.createdAt,
      })),
    });
  } catch (error) {
    console.error("List trainings error:", error);
    res
      .status(500)
      .json({ message: "Failed to list trainings", error: error.message });
  }
});

// Verify training
router.post("/verify/:id", async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    if (training.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Training is not in pending status" });
    }

    // Simulate blockchain verification
    const mockTransactionHash = `0x${Math.random()
      .toString(16)
      .substring(2, 66)}`;
    const mockBlockNumber = Math.floor(Math.random() * 1000000);

    // Update training status
    training.status = "verified";
    training.blockchain = {
      transactionHash: mockTransactionHash,
      blockNumber: mockBlockNumber,
      verifiedAt: new Date(),
    };
    training.verification = {
      verifiedAt: new Date(),
      notes: "Training verified successfully via smart contract",
    };

    await training.save();

    console.log(
      `✅ Training verified: ${training.title} - TX: ${mockTransactionHash}`
    );

    res.json({
      message: "Training verified successfully",
      training: {
        id: training._id,
        title: training.title,
        status: training.status,
        transactionHash: mockTransactionHash,
        blockNumber: mockBlockNumber,
        verifiedAt: training.verification.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Verify training error:", error);
    res
      .status(500)
      .json({ message: "Failed to verify training", error: error.message });
  }
});

// Get training statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Training.aggregate([
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
          rejectedTrainings: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    const categoryStats = await Training.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          verified: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] },
          },
        },
      },
    ]);

    console.log("📊 Training statistics retrieved");

    res.json({
      overview: stats[0] || {
        totalTrainings: 0,
        verifiedTrainings: 0,
        pendingTrainings: 0,
        rejectedTrainings: 0,
      },
      categoryBreakdown: categoryStats,
    });
  } catch (error) {
    console.error("Get training stats error:", error);
    res
      .status(500)
      .json({
        message: "Failed to retrieve training statistics",
        error: error.message,
      });
  }
});

module.exports = router;
