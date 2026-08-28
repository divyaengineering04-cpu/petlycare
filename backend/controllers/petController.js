import { getAll, getOne, runQuery } from '../config/db.js';

export const getPets = async (req, res) => {
  try {
    const userId = req.user.id;
    const pets = await getAll('SELECT * FROM pets WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    return res.status(500).json({ message: 'Server error fetching pets' });
  }
};

export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const pet = await getOne('SELECT * FROM pets WHERE id = ? AND userId = ?', [id, userId]);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    return res.json(pet);
  } catch (error) {
    console.error('Get pet by id error:', error);
    return res.status(500).json({ message: 'Server error fetching pet details' });
  }
};

export const addPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, breed, age, gender, weight, vaccinationStatus, image, notes } = req.body;

    if (!name || !type || !breed) {
      return res.status(400).json({ message: 'Name, type, and breed are required' });
    }

    const petId = `pet_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const petImage = image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400';
    const vStatus = vaccinationStatus || 'Vaccinated';

    await runQuery(
      `INSERT INTO pets (id, userId, name, type, breed, age, gender, weight, vaccinationStatus, image, notes, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [petId, userId, name, type, breed, age || '1', gender || 'Male', weight || '5', vStatus, petImage, notes || '', createdAt]
    );

    const newPet = await getOne('SELECT * FROM pets WHERE id = ?', [petId]);
    return res.status(201).json(newPet);
  } catch (error) {
    console.error('Add pet error:', error);
    return res.status(500).json({ message: 'Server error adding pet' });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingPet = await getOne('SELECT * FROM pets WHERE id = ? AND userId = ?', [id, userId]);
    if (!existingPet) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    const { name, type, breed, age, gender, weight, vaccinationStatus, image, notes } = req.body;

    const updatedName = name || existingPet.name;
    const updatedType = type || existingPet.type;
    const updatedBreed = breed || existingPet.breed;
    const updatedAge = age || existingPet.age;
    const updatedGender = gender || existingPet.gender;
    const updatedWeight = weight || existingPet.weight;
    const updatedVStatus = vaccinationStatus || existingPet.vaccinationStatus;
    const updatedImage = image || existingPet.image;
    const updatedNotes = notes !== undefined ? notes : existingPet.notes;

    await runQuery(
      `UPDATE pets SET name = ?, type = ?, breed = ?, age = ?, gender = ?, weight = ?, vaccinationStatus = ?, image = ?, notes = ? WHERE id = ? AND userId = ?`,
      [updatedName, updatedType, updatedBreed, updatedAge, updatedGender, updatedWeight, updatedVStatus, updatedImage, updatedNotes, id, userId]
    );

    const updatedPet = await getOne('SELECT * FROM pets WHERE id = ?', [id]);
    return res.json(updatedPet);
  } catch (error) {
    console.error('Update pet error:', error);
    return res.status(500).json({ message: 'Server error updating pet' });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingPet = await getOne('SELECT * FROM pets WHERE id = ? AND userId = ?', [id, userId]);
    if (!existingPet) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    await runQuery('DELETE FROM pets WHERE id = ? AND userId = ?', [id, userId]);
    return res.json({ message: 'Pet deleted successfully', petId: id });
  } catch (error) {
    console.error('Delete pet error:', error);
    return res.status(500).json({ message: 'Server error deleting pet' });
  }
};
