const { execSync } = require('child_process');

// Run the populate script
try {
  execSync('npx ts-node src/scripts/populateWordList.ts', {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Error running populate script:', error);
  process.exit(1);
} 