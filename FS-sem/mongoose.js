const mongoose = require('mongoose');

// Connect to MongoDB server
mongoose.connect('mongodb://localhost/studentDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    main().catch(console.error);
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define student schema
const studentSchema = new mongoose.Schema({
  name: String,
  grade: Number
});

// Create student model
const Student = mongoose.model('Student', studentSchema);

async function main() {
  try {
    // Create student documents
    const students = [
      { name: 'John Doe', grade: 85 },
      { name: 'Jane Smith', grade: 92 },
      { name: 'Mike Johnson', grade: 78 },
      { name: 'Sarah Davis', grade: 88 }
    ];

    // Insert the students into the collection
    const insertedStudents = await Student.insertMany(students);
    console.log('Inserted students:', insertedStudents);

    // Read all students from the collection
    const allStudents = await Student.find();
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
    const update = { grade: 90 };
    const updateResult = await Student.updateOne(filter, update);
    console.log('Modified count:', updateResult.nModified);

    // Delete a student
    const deleteResult = await Student.deleteOne({ name: 'Mike Johnson' });
    console.log('Deleted count:', deleteResult.deletedCount);

    // Read all students after modifications
    const modifiedStudents = await Student.find();
    console.log('Modified students:', modifiedStudents);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Disconnect from MongoDB server
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}