const prompt = require("prompt-sync")();
const { MongoClient } = require('mongodb');

async function connect() {
  const uri = 'mongodb+srv://binuppbbsc22:binu1506@cluster0.kadncde.mongodb.net/zoo'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('zoo');
    const collection = db.collection('animals');

    // Create a new animal document
    async function createAnimal(animal) {
      const result = await collection.insertOne(animal);
      console.log(`Created animal with ID: ${result.insertedId}`);
    }

    // Read all animals
    async function readAnimals() {
      const animals = await collection.find({}).toArray();
      console.log('All animals:');
      animals.forEach(animal => console.log(animal));
    }

    // Update an animal by ID
    async function updateAnimal(id, updates) {
      const result = await collection.updateOne({ _id: id }, { $set: updates });
      console.log(`Updated ${result.modifiedCount} animal(s)`);
    }

    // Delete an animal by ID
    async function deleteAnimal(id) {
      const result = await collection.deleteOne({ _id: id });
      console.log(`Deleted ${result.deletedCount} animal(s)`);
    }

    // Count the number of animals that will be alive after n years
    async function countAnimalsAliveAfterYears(n) {
      const currentYear = new Date().getFullYear();
      const aliveAnimals = await collection.countDocuments({ birthYear: { $lte: currentYear - n } });
      console.log(`Number of animals alive after ${n} years: ${aliveAnimals}`);
    }

    // Usage examples:
    await createAnimal({ name: 'Lion', birthYear: 2015 });
    await createAnimal({ name: 'Elephant', birthYear: 2010 });
    await createAnimal({ name: 'Giraffe', birthYear: 2018 });

    await readAnimals();

    const animalIdToUpdate = prompt('Enter the ID of the animal to update: ');
    const updatedName = prompt('Enter the updated name: ');
    await updateAnimal(animalIdToUpdate, { name: updatedName });

    const animalIdToDelete = prompt('Enter the ID of the animal to delete: ');
    await deleteAnimal(animalIdToDelete);

    const years = prompt('Enter the number of years: ');
    await countAnimalsAliveAfterYears(parseInt(years));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

connect();
