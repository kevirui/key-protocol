const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
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
    technical: {
      name: {
        type: String,
        required: true,
      },
      email: String,
      phone: String,
      organization: String,
      credentials: String,
    },
    producer: {
      name: {
        type: String,
        required: true,
      },
      email: String,
      phone: String,
      organization: String,
      experience: String,
    },
    category: {
      type: String,
      enum: [
        "agricultura",
        "tecnologia",
        "salud",
        "educacion",
        "negocios",
        "sostenibilidad",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    evidence: {
      ipfsHash: {
        type: String,
        required: true,
      },
      originalUrl: String,
      type: {
        type: String,
        enum: ["video", "image", "document", "certificate"],
        default: "document",
      },
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
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
    participants: {
      target: {
        type: Number,
        default: 0,
      },
      actual: {
        type: Number,
        default: 0,
      },
    },
    duration: {
      type: Number, // in hours
      required: true,
    },
    date: {
      start: Date,
      end: Date,
    },
    blockchain: {
      transactionHash: String,
      blockNumber: Number,
      verifiedAt: Date,
      verifierAddress: String,
    },
    verification: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      notes: String,
      rejectionReason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
trainingSchema.index({ status: 1, category: 1 });
trainingSchema.index({ "blockchain.transactionHash": 1 });
trainingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Training", trainingSchema);
