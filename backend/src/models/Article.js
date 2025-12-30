/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters']
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: true,
      trim: true
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [1000, 'Excerpt cannot exceed 1000 characters']
    },
    content: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    publishedDate: {
      type: Date
    },
    thumbnail: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    scrapedAt: {
      type: Date,
      default: Date.now
    },
    metadata: {
      wordCount: {
        type: Number,
        min: 0
      },
      readingTime: {
        type: Number,
        min: 0
      },
      lastAnalyzed: {
        type: Date
      },
      similarityScore: {
        type: Number,
        min: 0,
        max: 100
      },
      rankingFactors: [{
        type: String
      }],
      isAIGenerated: {
        type: Boolean,
        default: false
      },
      sourceType: {
        type: String,
        enum: ['original', 'competitive-analysis', 'enhanced'],
        default: 'original'
      },
      keywords: [{
        type: String,
        trim: true
      }],
      references: [{
        title: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        scrapedAt: {
          type: Date,
          default: Date.now
        }
      }]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
articleSchema.index({ title: 'text', content: 'text' }); // Full-text search
articleSchema.index({ publishedDate: -1 }); // Sort by date descending
// NOTE: url field already has unique:true which creates an index automatically
articleSchema.index({ 'metadata.isAIGenerated': 1 }); // Filter by AI-generated
articleSchema.index({ 'metadata.sourceType': 1 }); // Filter by source type
articleSchema.index({ tags: 1 }); // Filter by tags

// Virtual property: formatted date
articleSchema.virtual('formattedDate').get(function() {
  if (!this.publishedDate) return null;
  return this.publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual property: short excerpt
articleSchema.virtual('shortExcerpt').get(function() {
  if (!this.excerpt) return null;
  return this.excerpt.length > 100 
    ? this.excerpt.substring(0, 100) + '...' 
    : this.excerpt;
});

// Method: Calculate reading time based on word count
articleSchema.methods.calculateReadingTime = function() {
  if (!this.metadata.wordCount) return 0;
  // Average reading speed: 200 words per minute
  return Math.ceil(this.metadata.wordCount / 200);
};

// Method: Add a reference
articleSchema.methods.addReference = function(title, url) {
  if (!this.metadata.references) {
    this.metadata.references = [];
  }
  
  // Check if reference already exists
  const exists = this.metadata.references.some(ref => ref.url === url);
  if (!exists) {
    this.metadata.references.push({
      title,
      url,
      scrapedAt: new Date()
    });
  }
};

// Pre-save middleware: Calculate word count if content exists
articleSchema.pre('save', function(next) {
  if (this.content && this.isModified('content')) {
    // Calculate word count
    const words = this.content.trim().split(/\s+/);
    this.metadata.wordCount = words.length;
    
    // Calculate reading time
    this.metadata.readingTime = this.calculateReadingTime();
  }
  next();
});

// Pre-save middleware: Update lastAnalyzed if metadata changes
articleSchema.pre('save', function(next) {
  if (this.isModified('metadata') && this.metadata.isAIGenerated) {
    this.metadata.lastAnalyzed = new Date();
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
