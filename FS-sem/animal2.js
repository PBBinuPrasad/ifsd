const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://binuppbbsc22:binu1506@cluster0.kadncde.mongodb.net/zoo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Define the zoo-animal schema
    const animalSchema = new mongoose.Schema({
      name: String,
      birthYear: Number
    });

    // Create the animal model
    const Animal = mongoose.model('Animal', animalSchema);

    // Create a new animal document
    async function createAnimal(name, birthYear) {
      const animal = new Animal({ name, birthYear });
      const result = await animal.save();
      console.log(`Created animal with ID: ${result._id}`);
    }

    // Read all animals
    async function readAnimals() {
      const animals = await Animal.find({});
      console.log('All animals:');
      console.log(animals);
    }

    // Update an animal by ID
    async function updateAnimal(id, updates) {
      const animal = await Animal.findByIdAndUpdate(id, updates);
      console.log(`Updated animal with ID: ${animal._id}`);
    }

    // Delete an animal by ID
    async function deleteAnimal(id) {
      const animal = await Animal.findByIdAndDelete(id);
      console.log(`Deleted animal with ID: ${animal._id}`);
    }

    // Count the number of animals that will be alive after n years
    async function countAnimalsAliveAfterYears(n) {
      const currentYear = new Date().getFullYear();
      const aliveAnimals = await Animal.countDocuments({ birthYear: { $lte: currentYear - n } });
      console.log(`Number of animals alive after ${n} years: ${aliveAnimals}`);
    }

    // Usage examples:
    try {
      await createAnimal('Cheetah', 2015);
      await createAnimal('Tiger', 2010);
      await createAnimal('Camel', 2018);

      await readAnimals();

      const animalIdToUpdate = 'animal_id'; // Replace with the actual ID of the animal to update
      await updateAnimal(animalIdToUpdate, { name: 'Fox' });

      const animalIdToDelete = 'animal_id'; // Replace with the actual ID of the animal to delete
      await deleteAnimal(animalIdToDelete);

      const years = 5; // Specify the number of years
      await countAnimalsAliveAfterYears(years);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });