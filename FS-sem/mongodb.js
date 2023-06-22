const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://binuppbbsc22:binu1506@cluster0.kadncde.mongodb.net/?retryWrites=true&w=majority';

// Database and collection names
const dbName = 'studentDatabase';
const collectionName = 'students';

async function main() {
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the student database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create student documents
    const students = [
      { name: 'Binu Prasad', grade: 85 },
      { name: 'Kiran', grade: 92 },
      { name: 'Tarun', grade: 78 },
      { name: 'Shankar', grade: 88 }
    ];

    // Insert the students into the collection
    await collection.insertMany(students);
    console.log('Inserted students:', students);

    // Read all students from the collection
    const allStudents = await collection.find().toArray();
    console.log('All students:', allStudents);

    // Calculate the average grade
    let totalGrade = 0;
    allStudents.forEach(student => {
      totalGrade += student.grade;
    });
    const averageGrade = totalGrade / allStudents.length;
    console.log('Average grade:', averageGrade);

    // Update a student's grade
    const filter = { name: 'John Doe' };
    const update = { $set: { grade: 90 } };
    const updateResult = await collection.updateOne(filter, update);
    console.log('Modified count:', updateResult.modifiedCount);

    // Delete a student
    const deleteResult = await collection.deleteOne({ name: 'Mike Johnson' });
    console.log('Deleted count:', deleteResult.deletedCount);

    // Read all students after modifications
    const modifiedStudents = await collection.find().toArray();
    console.log('Modified students:', modifiedStudents);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);