import { getAll, getOne, runQuery } from '../config/db.js';

export const getListings = async (req, res) => {
  try {
    const listings = await getAll('SELECT * FROM marketplace_pets ORDER BY createdAt DESC');
    const formatted = listings.map(l => ({
      ...l,
      certified: Boolean(l.certified),
      vaccinated: Boolean(l.vaccinated)
    }));
    return res.json(formatted);
  } catch (error) {
    console.error('Get marketplace listings error:', error);
    return res.status(500).json({ message: 'Server error fetching marketplace listings' });
  }
};

export const createListing = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { title, type, breed, age, gender, price, location, phone, description, image, certified, vaccinated } = req.body;

    if (!title || !type || !breed) {
      return res.status(400).json({ message: 'Title, type, and breed are required' });
    }

    let sellerName = 'Pet Owner';
    let sellerPhone = phone || '+91 98765 43210';

    if (userId) {
      const user = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
      if (user) {
        sellerName = user.name;
        if (!phone) sellerPhone = user.phone;
      }
    }

    const listingId = `mkt_${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const listingImage = image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600';

    await runQuery(
      `INSERT INTO marketplace_pets (id, title, type, breed, age, gender, price, certified, vaccinated, location, sellerName, sellerId, phone, image, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listingId,
        title,
        type,
        breed,
        age || '3 Months',
        gender || 'Male',
        price !== undefined ? price : 15000,
        certified ? 1 : 0,
        vaccinated ? 1 : 1,
        location || 'Bengaluru, India',
        sellerName,
        userId,
        sellerPhone,
        listingImage,
        description || '',
        createdAt
      ]
    );

    const newListing = await getOne('SELECT * FROM marketplace_pets WHERE id = ?', [listingId]);
    return res.status(201).json({
      ...newListing,
      certified: Boolean(newListing.certified),
      vaccinated: Boolean(newListing.vaccinated)
    });
  } catch (error) {
    console.error('Create marketplace listing error:', error);
    return res.status(500).json({ message: 'Server error creating listing' });
  }
};

export const buyPet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const listing = await getOne('SELECT * FROM marketplace_pets WHERE id = ?', [id]);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Automatically create a new pet in the buyer's pets list
    const petId = `pet_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const name = listing.title.split(' ')[0];

    await runQuery(
      `INSERT INTO pets (id, userId, name, type, breed, age, gender, weight, vaccinationStatus, image, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petId,
        userId,
        name,
        listing.type,
        listing.breed,
        listing.age,
        listing.gender || 'Male',
        '5',
        'Vaccinated',
        listing.image,
        `Purchased/Adopted from ${listing.sellerName}`,
        createdAt
      ]
    );

    // Remove listing from marketplace
    await runQuery('DELETE FROM marketplace_pets WHERE id = ?', [id]);

    const newPet = await getOne('SELECT * FROM pets WHERE id = ?', [petId]);
    return res.json({ message: 'Pet adopted/purchased successfully', pet: newPet });
  } catch (error) {
    console.error('Buy pet error:', error);
    return res.status(500).json({ message: 'Server error processing pet purchase' });
  }
};
