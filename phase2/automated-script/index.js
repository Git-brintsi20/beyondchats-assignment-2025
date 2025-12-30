/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import ContentDiscoveryAgent from './src/ContentDiscoveryAgent.js';
import DatabaseService from './src/DatabaseService.js';

const database = new DatabaseService();
const agent = new ContentDiscoveryAgent();

// ASCII Banner
function showBanner() {
  console.clear();
  console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ███████╗██╗   ██╗ ██████╗ ███╗   ██╗██████╗      ║
║   ██╔══██╗██╔════╝╚██╗ ██╔╝██╔═══██╗████╗  ██║██╔══██╗     ║
║   ██████╔╝█████╗   ╚████╔╝ ██║   ██║██╔██╗ ██║██║  ██║     ║
║   ██╔══██╗██╔══╝    ╚██╔╝  ██║   ██║██║╚██╗██║██║  ██║     ║
║   ██████╔╝███████╗   ██║   ╚██████╔╝██║ ╚████║██████╔╝     ║
║   ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═════╝      ║
║                                                              ║
║            Automated Content Discovery Agent                ║
║                  Powered by Claude AI                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `));
  
  if (process.env.DEMO_MODE === 'true') {
    console.log(chalk.yellow.bold('⚠️  Running in DEMO MODE\n'));
  }
  
  console.log(chalk.gray(`Created by: S_Harshit_B`));
  console.log(chalk.gray(`Repository: github.com/Git-brintsi20/beyondchats-assignment-2025\n`));
}

// Main Menu
async function showMainMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        {
          name: '🔍 Process a Single Article',
          value: 'single'
        },
        {
          name: '🚀 Process All Articles (Batch Mode)',
          value: 'batch'
        },
        {
          name: '📊 View Statistics',
          value: 'stats'
        },
        {
          name: '📋 List All Articles',
          value: 'list'
        },
        {
          name: '❌ Exit',
          value: 'exit'
        }
      ]
    }
  ]);

  return choice;
}

// Process Single Article
async function processSingleArticle() {
  console.log(chalk.cyan('\n📝 Fetching articles...\n'));
  
  const spinner = ora('Loading articles from database').start();
  
  try {
    const articles = await database.getAllArticles({ limit: 100 });
    spinner.succeed('Articles loaded');
    
    const originalArticles = articles.filter(a => !a.metadata?.isAIGenerated);
    
    if (originalArticles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No original articles found in database'));
      return;
    }

    const { selectedArticleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedArticleId',
        message: 'Select an article to process:',
        choices: originalArticles.map(article => ({
          name: `${article.title.substring(0, 60)}${article.title.length > 60 ? '...' : ''}`,
          value: article.id
        }))
      }
    ]);
    
    const selectedArticle = originalArticles.find(a => a.id === selectedArticleId);
    
    const result = await agent.processArticle(selectedArticle);
    
    if (result.success) {
      console.log(chalk.green.bold('\n✅ Processing completed successfully!'));
      
      const table = new Table({
        head: [chalk.cyan('Metric'), chalk.cyan('Value')],
        style: { head: [], border: [] }
      });
      
      table.push(
        ['Articles Analyzed', result.analyzed || 0],
        ['Similarity Score', `${result.similarityScore || 0}%`],
        ['Published Versions', result.published || 0]
      );
      
      console.log('\n' + table.toString());
    } else {
      console.log(chalk.red.bold(`\n❌ Processing failed: ${result.reason || result.error}`));
    }
    
  } catch (error) {
    spinner.fail('Error occurred');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

// Process All Articles
async function processBatchArticles() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow('⚠️  This will process ALL articles. Continue?'),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.gray('\nBatch processing cancelled.'));
    return;
  }

  console.log(chalk.cyan('\n🚀 Starting batch processing...\n'));
  
  try {
    const results = await agent.runForAllArticles();
    
    console.log(chalk.green.bold('\n✅ Batch processing completed!\n'));
    
    const table = new Table({
      head: [chalk.cyan('Metric'), chalk.cyan('Value')],
      style: { head: [], border: [] }
    });
    
    table.push(
      ['Total Articles', results.total],
      ['Successful', chalk.green(results.successful)],
      ['Failed', results.failed > 0 ? chalk.red(results.failed) : results.failed],
      ['Enhanced Versions', chalk.blue(results.published)]
    );
    
    console.log(table.toString() + '\n');
    
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

// View Statistics
async function viewStatistics() {
  console.log(chalk.cyan('\n📊 Fetching statistics...\n'));
  
  const spinner = ora('Loading data').start();
  
  try {
    const articles = await database.getAllArticles({ limit: 1000 });
    spinner.succeed('Data loaded');
    
    const original = articles.filter(a => !a.metadata?.isAIGenerated);
    const enhanced = articles.filter(a => a.metadata?.isAIGenerated);
    const analyzed = articles.filter(a => a.metadata?.lastAnalyzed);
    
    const avgSimilarity = analyzed.length > 0
      ? Math.round(analyzed.reduce((sum, a) => sum + (a.metadata.similarityScore || 0), 0) / analyzed.length)
      : 0;
    
    const table = new Table({
      head: [chalk.cyan('Statistic'), chalk.cyan('Value')],
      style: { head: [], border: [] }
    });
    
    table.push(
      ['Total Articles', articles.length],
      ['Original Articles', original.length],
      ['Enhanced Versions', enhanced.length],
      ['Analyzed Articles', analyzed.length],
      ['Average Similarity', `${avgSimilarity}%`]
    );
    
    console.log('\n' + table.toString() + '\n');
    
  } catch (error) {
    spinner.fail('Error occurred');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

// List All Articles
async function listAllArticles() {
  console.log(chalk.cyan('\n📋 Fetching articles...\n'));
  
  const spinner = ora('Loading articles').start();
  
  try {
    const articles = await database.getAllArticles({ limit: 50 });
    spinner.succeed(`Loaded ${articles.length} articles`);
    
    if (articles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No articles found in database'));
      return;
    }
    
    const table = new Table({
      head: [
        chalk.cyan('#'),
        chalk.cyan('Title'),
        chalk.cyan('Type'),
        chalk.cyan('Analyzed')
      ],
      colWidths: [5, 45, 12, 12],
      style: { head: [], border: [] },
      wordWrap: true
    });
    
    articles.forEach((article, index) => {
      const type = article.metadata?.isAIGenerated ? chalk.blue('Enhanced') : chalk.green('Original');
      const analyzed = article.metadata?.lastAnalyzed ? chalk.green('✓') : chalk.gray('✗');
      
      table.push([
        index + 1,
        article.title.substring(0, 42) + (article.title.length > 42 ? '...' : ''),
        type,
        analyzed
      ]);
    });
    
    console.log('\n' + table.toString() + '\n');
    
  } catch (error) {
    spinner.fail('Error occurred');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

// Main Application Loop
async function main() {
  showBanner();
  
  // Check backend connectivity
  const spinner = ora('Checking backend connection').start();
  try {
    await database.getAllArticles({ limit: 1 });
    spinner.succeed('Backend connected');
  } catch (error) {
    spinner.fail('Backend connection failed');
    console.error(chalk.red(`\n❌ Cannot connect to backend at ${process.env.BACKEND_URL || 'http://localhost:8000'}`));
    console.log(chalk.yellow('\nPlease ensure the backend server is running.\n'));
    process.exit(1);
  }
  
  let running = true;
  
  while (running) {
    const choice = await showMainMenu();
    
    switch (choice) {
      case 'single':
        await processSingleArticle();
        break;
      
      case 'batch':
        await processBatchArticles();
        break;
      
      case 'stats':
        await viewStatistics();
        break;
      
      case 'list':
        await listAllArticles();
        break;
      
      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye!\n'));
        running = false;
        break;
    }
    
    if (running) {
      console.log('\n' + '─'.repeat(60) + '\n');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...'
        }
      ]);
      showBanner();
    }
  }
}

// Start the application
main().catch(error => {
  console.error(chalk.red.bold('\n❌ Fatal Error:'), error.message);
  process.exit(1);
});
