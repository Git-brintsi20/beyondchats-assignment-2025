/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import GoogleSearchService from './GoogleSearchService.js';
import ContentScraper from './ContentScraper.js';
import ClaudeAnalyzer from './ClaudeAnalyzer.js';
import DatabaseService from './DatabaseService.js';

class ContentDiscoveryAgent {
  constructor() {
    this.googleSearch = new GoogleSearchService();
    this.contentScraper = new ContentScraper();
    this.claudeAnalyzer = new ClaudeAnalyzer();
    this.database = new DatabaseService();
    this.demoMode = process.env.DEMO_MODE === 'true';
    
    // Pass demo mode to scraper for consistent behavior
    this.contentScraper.demoMode = this.demoMode;
  }

  /**
   * Process a single article through the entire workflow
   */
  async processArticle(article) {
    console.log('\n' + '='.repeat(60));
    console.log(`📝 Processing: ${article.title}`);
    console.log('='.repeat(60));

    try {
      // Step 1: Search Google
      console.log('\n🔍 Step 1/6: Searching Google...');
      const searchResults = await this.googleSearch.search(article.title, {
        num: 10,
        filterBlogs: true
      });
      console.log(`✓ Found ${searchResults.length} relevant articles`);

      if (searchResults.length === 0) {
        console.log('⚠️  No search results found, skipping article');
        return {
          success: false,
          reason: 'No search results'
        };
      }

      // Step 2: Take top 2 results
      const topResults = searchResults.slice(0, 2);
      console.log(`\n📊 Step 2/6: Selected top 2 results:`);
      topResults.forEach((result, i) => {
        console.log(`   ${i + 1}. ${result.title}`);
        console.log(`      ${result.url}`);
      });

      // Step 3: Scrape competitor articles
      console.log(`\n📄 Step 3/6: Scraping competitor content...`);
      const scrapedArticles = [];
      
      for (const result of topResults) {
        const scraped = await this.contentScraper.scrapeArticle(result.url);
        if (scraped) {
          scrapedArticles.push(scraped);
          console.log(`   ✓ Scraped: ${result.title.substring(0, 50)}...`);
        } else {
          console.log(`   ✗ Failed to scrape: ${result.url}`);
        }
        
        await this.sleep(3000); // Polite delay
      }

      if (scrapedArticles.length === 0) {
        console.log('⚠️  No articles could be scraped, skipping');
        return {
          success: false,
          reason: 'Scraping failed'
        };
      }

      console.log(`✓ Successfully scraped ${scrapedArticles.length} articles`);

      // Step 4: Analyze with Claude AI
      console.log(`\n🤖 Step 4/6: Analyzing with Claude AI...`);
      const analysis = await this.claudeAnalyzer.analyzeContent(article, scrapedArticles);
      
      if (!analysis) {
        console.log('⚠️  Analysis failed, skipping');
        return {
          success: false,
          reason: 'Analysis failed'
        };
      }

      console.log(`✓ Analysis complete!`);
      console.log(`   Similarity Score: ${analysis.similarityScore}%`);
      console.log(`   Ranking Factors: ${analysis.rankingFactors.length}`);

      // Step 5: Update original article in database
      console.log(`\n💾 Step 5/6: Updating database...`);
      
      const updateData = {
        metadata: {
          ...article.metadata,
          lastAnalyzed: new Date(),
          similarityScore: analysis.similarityScore,
          rankingFactors: analysis.rankingFactors,
          keywords: analysis.newVersions[0]?.targetKeywords || [],
          references: analysis.references
        }
      };

      await this.database.updateArticle(article.id, updateData);
      console.log(`✓ Original article updated`);

      // Step 6: Create and publish new enhanced versions
      console.log(`\n📤 Step 6/6: Publishing enhanced versions...`);
      
      let published = 0;
      
      if (analysis.shouldPublish && analysis.newVersions?.length > 0) {
        for (const newVersion of analysis.newVersions) {
          try {
            const enhancedArticle = {
              title: newVersion.title,
              url: `${article.url}#enhanced`,
              content: newVersion.content,
              excerpt: newVersion.content.substring(0, 200) + '...',
              author: article.author,
              published_date: article.published_date,
              thumbnail: article.thumbnail,
              tags: [...(article.tags || []), ...newVersion.targetKeywords],
              scraped_at: new Date().toISOString(),
              metadata: {
                wordCount: newVersion.content.split(/\s+/).length,
                readingTime: Math.ceil(newVersion.content.split(/\s+/).length / 200),
                lastAnalyzed: new Date(),
                similarityScore: analysis.similarityScore,
                rankingFactors: analysis.rankingFactors,
                isAIGenerated: true,
                sourceType: 'enhanced',
                keywords: newVersion.targetKeywords,
                references: analysis.references
              }
            };

            await this.database.createArticle(enhancedArticle);
            published++;
            console.log(`   ✓ Published: ${newVersion.title.substring(0, 50)}...`);
            
          } catch (error) {
            console.log(`   ✗ Failed to publish: ${error.message}`);
          }
        }
      }

      console.log(`✓ Published ${published} enhanced version(s)`);

      // Summary
      console.log(`\n✅ Processing complete!`);
      console.log(`   Articles analyzed: ${scrapedArticles.length}`);
      console.log(`   Similarity score: ${analysis.similarityScore}%`);
      console.log(`   Enhancements: ${published}`);

      return {
        success: true,
        analyzed: scrapedArticles.length,
        similarityScore: analysis.similarityScore,
        published
      };

    } catch (error) {
      console.error(`\n❌ Error processing article: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process all articles in the database
   */
  async runForAllArticles() {
    try {
      console.log('🚀 Starting batch processing...\n');

      if (this.demoMode) {
        console.log('⚠️  Running in DEMO MODE - Limited to 5 articles\n');
      }

      // Fetch all original articles (not AI-generated)
      const articles = await this.database.getAllArticles({
        limit: this.demoMode ? 5 : 100
      });

      // Filter for only original articles
      const originalArticles = articles.filter(
        article => !article.metadata?.isAIGenerated
      );

      console.log(`Found ${originalArticles.length} original articles to process\n`);

      if (originalArticles.length === 0) {
        console.log('No articles to process.');
        return;
      }

      const results = {
        total: originalArticles.length,
        successful: 0,
        failed: 0,
        published: 0
      };

      // Process each article
      for (let i = 0; i < originalArticles.length; i++) {
        const article = originalArticles[i];
        
        console.log(`\n[${i + 1}/${originalArticles.length}] Processing article...`);
        
        const result = await this.processArticle(article);
        
        if (result.success) {
          results.successful++;
          results.published += result.published || 0;
        } else {
          results.failed++;
        }

        // Rate limiting delay
        if (i < originalArticles.length - 1) {
          console.log('\n⏳ Waiting 5 seconds before next article...');
          await this.sleep(5000);
        }
      }

      // Final summary
      console.log('\n' + '='.repeat(60));
      console.log('📊 BATCH PROCESSING COMPLETE');
      console.log('='.repeat(60));
      console.log(`Total articles: ${results.total}`);
      console.log(`Successful: ${results.successful}`);
      console.log(`Failed: ${results.failed}`);
      console.log(`Enhanced versions created: ${results.published}`);
      console.log('='.repeat(60) + '\n');

      return results;

    } catch (error) {
      console.error('Error in batch processing:', error);
      throw error;
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ContentDiscoveryAgent;
