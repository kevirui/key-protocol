const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "agua",
        "salud",
        "educacion",
        "agricultura",
        "energia",
        "tecnologia",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "funded", "in-progress", "completed", "verified"],
      default: "available",
    },
    funding: {
      requested: {
        type: Number,
        required: true,
        min: 0,
      },
      received: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    location: {
      country: String,
      region: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    timeline: {
      startDate: Date,
      endDate: Date,
      duration: Number, // in months
    },
    impact: {
      targetBeneficiaries: Number,
      actualBeneficiaries: {
        type: Number,
        default: 0,
      },
      sroi: {
        type: Number,
        default: 0,
      },
      sdgs: [
        {
          type: String,
          enum: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
          ],
        },
      ],
    },
    funders: [
      {
        funderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        transactionHash: String,
      },
    ],
    evidence: [
      {
        type: {
          type: String,
          enum: ["image", "video", "document", "certificate"],
        },
        url: String,
        ipfsHash: String,
        description: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    blockchain: {
      contractAddress: String,
      tokenId: String,
      transactionHash: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
    metrics: {
      completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastUpdate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ "funding.requested": 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
