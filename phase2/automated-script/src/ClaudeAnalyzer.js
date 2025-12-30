/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import Anthropic from '@anthropic-ai/sdk';

class ClaudeAnalyzer {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    if (!apiKey || apiKey === 'your_claude_api_key_here') {
      console.warn('⚠️  No Claude API key found, will use mock analysis');
      this.client = null;
    } else {
      this.client = new Anthropic({ apiKey });
    }
    
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000;
    this.maxRetries = 3;
  }

  /**
   * Analyze content and generate enhanced version
   */
  async analyzeContent(originalArticle, competitorArticles) {
    try {
      if (!this.client) {
        return this.getMockAnalysis(originalArticle, competitorArticles);
      }

      const prompt = this.buildPrompt(originalArticle, competitorArticles);

      console.log('🤖 Analyzing with Claude AI...');

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          const response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            messages: [{
              role: 'user',
              content: prompt
            }]
          });

          const content = response.content[0].text;
          const analysis = this.parseResponse(content);

          if (analysis) {
            console.log(`✓ Analysis complete (Similarity: ${analysis.similarityScore}%)`);
            return analysis;
          }

        } catch (error) {
          if (attempt === this.maxRetries - 1) throw error;
          console.warn(`Attempt ${attempt + 1} failed, retrying...`);
          await this.sleep(2000 * (attempt + 1));
        }
      }

    } catch (error) {
      console.error('Claude AI error:', error.message);
      return this.getMockAnalysis(originalArticle, competitorArticles);
    }
  }

  /**
   * Build comprehensive prompt for Claude
   */
  buildPrompt(originalArticle, competitorArticles) {
    const competitor1 = competitorArticles[0] || {};
    const competitor2 = competitorArticles[1] || {};

    return `You are a content optimization expert. Analyze these articles and provide insights.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content?.substring(0, 2000) || originalArticle.excerpt}

COMPETITOR ARTICLE 1:
Title: ${competitor1.title || 'N/A'}
URL: ${competitor1.url || 'N/A'}
Content: ${competitor1.content?.substring(0, 1500) || 'N/A'}

COMPETITOR ARTICLE 2:
Title: ${competitor2.title || 'N/A'}
URL: ${competitor2.url || 'N/A'}
Content: ${competitor2.content?.substring(0, 1500) || 'N/A'}

TASK:
1. Compare the original article with competitors
2. Identify why competitors might rank better
3. Extract key topics/keywords they cover
4. Suggest improvements for the original article
5. Generate an enhanced version with better SEO
6. Create 2 alternative title variations
7. Provide actionable recommendations

IMPORTANT: Respond ONLY with valid JSON in this EXACT format:
{
  "similarityScore": <number 0-100>,
  "rankingFactors": [
    "Factor 1 description",
    "Factor 2 description"
  ],
  "suggestedUpdates": {
    "content": "Enhanced article content with improvements",
    "reasoning": "Why these changes improve the article"
  },
  "alternativeTitles": [
    "Title Option 1",
    "Title Option 2"
  ],
  "shouldPublish": <true/false>,
  "newVersions": [
    {
      "title": "Enhanced article title",
      "content": "Complete enhanced article content",
      "targetKeywords": ["keyword1", "keyword2"]
    }
  ],
  "references": [
    {
      "title": "${competitor1.title || 'Competitor 1'}",
      "url": "${competitor1.url || ''}"
    },
    {
      "title": "${competitor2.title || 'Competitor 2'}",
      "url": "${competitor2.url || ''}"
    }
  ]
}

Respond with ONLY the JSON object, no additional text.`;
  }

  /**
   * Parse Claude's response
   */
  parseResponse(content) {
    try {
      // Extract JSON from response (in case Claude adds extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in Claude response');
        return null;
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (typeof analysis.similarityScore !== 'number' ||
          !Array.isArray(analysis.rankingFactors) ||
          !analysis.suggestedUpdates ||
          !Array.isArray(analysis.references)) {
        console.error('Invalid analysis structure');
        return null;
      }

      return analysis;

    } catch (error) {
      console.error('Error parsing Claude response:', error.message);
      return null;
    }
  }

  /**
   * Mock analysis for demo mode
   */
  getMockAnalysis(originalArticle, competitorArticles) {
    console.log('🤖 Using mock AI analysis (no API key)');

    return {
      similarityScore: Math.floor(Math.random() * 30) + 60, // 60-90%
      rankingFactors: [
        'Longer content (2500 words vs 1200 words)',
        'Includes case studies and examples',
        'Better keyword density and SEO optimization',
        'More comprehensive coverage of subtopics',
        'Structured with clear headings and sections'
      ],
      suggestedUpdates: {
        content: originalArticle.content + '\n\n[AI Enhancement] This article has been analyzed and enhanced with additional insights from industry-leading sources.',
        reasoning: 'Added more depth, examples, and structured content for better readability and SEO performance.'
      },
      alternativeTitles: [
        `${originalArticle.title} - Complete 2025 Guide`,
        `Everything You Need to Know About ${originalArticle.title.split(':')[0]}`
      ],
      shouldPublish: true,
      newVersions: [{
        title: `${originalArticle.title} (AI-Enhanced)`,
        content: originalArticle.content + '\n\n## Enhanced Insights\n\nBased on competitive analysis, this article has been enhanced with additional perspectives and best practices.',
        targetKeywords: ['AI', 'chatbot', 'automation', 'customer service']
      }],
      references: competitorArticles.map(article => ({
        title: article.title || 'Competitor Article',
        url: article.url || ''
      }))
    };
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ClaudeAnalyzer;
