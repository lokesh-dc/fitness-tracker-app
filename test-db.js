const { MongoClient, ObjectId } = require('mongodb');
async function run() {
  // Try local first, or extract from .env
  require('dotenv').config({ path: '../fitness-tracker/.env' });
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.log("NO URI"); return; }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const user = await db.collection('users').findOne({ email: "lokesh.cdewanand@gmail.com" });
  if (!user) { console.log("User not found"); return; }
  
  const records = await db.collection('ExerciseRecords').find({ userId: user._id }).toArray();
  console.log("Records:", JSON.stringify(records, null, 2));
  const logs = await db.collection('WorkoutLog').find({ userId: user._id }).sort({ date: -1 }).limit(1).toArray();
  console.log("Logs:", JSON.stringify(logs, null, 2));
  
  process.exit(0);
}
run();
