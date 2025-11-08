// Test MongoDB connection using the same config as the main app
const connectToMongo = require('./util/dbConfig');

console.log('Testing MongoDB connection...');
connectToMongo()
  .then(() => {
    console.log('✅ Connection test: SUCCESS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection test: FAILED');
    console.error('Error details:', err.message);
    process.exit(1);
  });