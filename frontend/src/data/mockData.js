export const INITIAL_USER = {
  id: 'usr_demo_1',
  name: 'Alex Morgan',
  email: 'alex@petly.com',
  phone: '+91 98765 43210',
  password: 'password123',
  address: '42 MG Road, Indiranagar, Bengaluru, Karnataka',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  createdAt: '2026-01-15'
};

export const SERVICES = [
  {
    id: 'srv_grooming',
    name: 'Pet Grooming',
    category: 'Grooming',
    iconName: 'Scissors',
    shortDescription: 'Complete bath, coat trim, nail clipping, and ear cleaning for your furry friend.',
    fullDescription: 'Give your pet a luxurious spa treatment! Our professional groomers use hypoallergenic shampoos, thorough brush-outs, precision trimming, and relaxing paw massages to keep them clean and healthy.',
    price: 999,
    duration: '60 mins',
    popular: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'srv_vet',
    name: 'Vet Consultation',
    category: 'Medical',
    iconName: 'Stethoscope',
    shortDescription: 'General wellness checkups, vaccinations, and expert medical advice from certified vets.',
    fullDescription: 'Comprehensive medical care for your pet. Includes full physical exam, vital checks, diagnostic guidance, and digital health records.',
    price: 1499,
    duration: '45 mins',
    popular: true,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'srv_walking',
    name: 'Pet Walking',
    category: 'Activity',
    iconName: 'Footprints',
    shortDescription: '30 to 60-minute energetic neighborhood walks with real-time GPS tracking.',
    fullDescription: 'Keep your dog active and happy with customized private or small-group walks. Includes fresh water refresh and photo updates.',
    price: 499,
    duration: '45 mins',
    popular: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'srv_sitting',
    name: 'Pet Sitting',
    category: 'Care',
    iconName: 'Home',
    shortDescription: 'Loving in-home or daycare pet care while you are away at work or traveling.',
    fullDescription: 'Stress-free environment for your pets. We follow your exact feeding routines, give medications if needed, and send daily video updates.',
    price: 799,
    duration: 'Per Day',
    popular: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'srv_taxi',
    name: 'Pet Taxi',
    category: 'Transport',
    iconName: 'Car',
    shortDescription: 'Safe, comfortable, climate-controlled transportation to vet clinics, grooming & parks.',
    fullDescription: 'Equipped with secure pet harnesses and sanitized carriers. Our trained drivers ensure your pet travels comfortably.',
    price: 599,
    duration: 'Per Trip',
    popular: false,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_PETS = [
  {
    id: 'pet_1',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '3',
    gender: 'Male',
    weight: '28',
    vaccinationStatus: 'Vaccinated',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    notes: 'Friendly, loves playing fetch and eating apple slices.'
  },
  {
    id: 'pet_2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '2',
    gender: 'Female',
    weight: '4.2',
    vaccinationStatus: 'Vaccinated',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    notes: 'Likes sunbathing on window sills. Sensitive to loud noises.'
  },
  {
    id: 'pet_3',
    name: 'Max',
    type: 'Dog',
    breed: 'French Bulldog',
    age: '4',
    gender: 'Male',
    weight: '12',
    vaccinationStatus: 'Due Soon',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
    notes: 'Requires daily facial fold cleaning. Playful personality.'
  }
];

export const INITIAL_MARKETPLACE_PETS = [
  {
    id: 'mkt_1',
    title: 'Purebred Golden Retriever Puppy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '2 Months',
    gender: 'Male',
    price: 18500,
    certified: true,
    vaccinated: true,
    location: 'Bengaluru, Karnataka',
    sellerName: 'Royal Paws Kennel',
    phone: '+91 98450 11223',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
    description: 'Playful, healthy male puppy with KCI registration papers. De-wormed and first vaccination completed.',
    createdAt: '2026-08-15'
  },
  {
    id: 'mkt_2',
    title: 'Adorable Persian Kitten (White)',
    type: 'Cat',
    breed: 'Persian Cat',
    age: '3 Months',
    gender: 'Female',
    price: 14000,
    certified: true,
    vaccinated: true,
    location: 'Mumbai, Maharashtra',
    sellerName: 'Cuddly Cats Breeder',
    phone: '+91 98200 44556',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    description: 'Fluffy triple-coat female Persian kitten. Litter trained, friendly, and very affectionate.',
    createdAt: '2026-08-16'
  },
  {
    id: 'mkt_3',
    title: 'Tri-Color Beagle Puppy',
    type: 'Dog',
    breed: 'Beagle',
    age: '4 Months',
    gender: 'Male',
    price: 16500,
    certified: true,
    vaccinated: true,
    location: 'Hyderabad, Telangana',
    sellerName: 'Deccan Paws',
    phone: '+91 97000 88990',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600',
    description: 'Active and curious tri-color Beagle puppy. Microchipped with complete health card.',
    createdAt: '2026-08-17'
  },
  {
    id: 'mkt_4',
    title: 'Siberian Husky Puppy (Blue Eyes)',
    type: 'Dog',
    breed: 'Siberian Husky',
    age: '3 Months',
    gender: 'Female',
    price: 24000,
    certified: true,
    vaccinated: true,
    location: 'Delhi NCR',
    sellerName: 'Northern Tails Kennel',
    phone: '+91 99100 22334',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
    description: 'Stunning Siberian Husky with striking blue eyes. Well socialized and healthy pedigree.',
    createdAt: '2026-08-18'
  },
  {
    id: 'mkt_5',
    title: 'Hand-Reamed Cockatiel Bird Pair',
    type: 'Bird',
    breed: 'Cockatiel',
    age: '5 Months',
    gender: 'Pair',
    price: 4500,
    certified: false,
    vaccinated: true,
    location: 'Chennai, Tamil Nadu',
    sellerName: 'Feathered Friends Aviary',
    phone: '+91 98400 66778',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=600',
    description: 'Friendly hand-tamed Cockatiel pair. Singing tunes and eating pelleted diet.',
    createdAt: '2026-08-18'
  },
  {
    id: 'mkt_6',
    title: 'Mini Lop Bunny Rabbit (Adoption)',
    type: 'Rabbit',
    breed: 'Mini Lop',
    age: '6 Months',
    gender: 'Male',
    price: 0, // Free adoption
    certified: false,
    vaccinated: true,
    location: 'Pune, Maharashtra',
    sellerName: 'Petly Shelter Rescue',
    phone: '+91 98900 11223',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    description: 'Gentle, litter-trained rabbit looking for a loving home. Free adoption to verified pet lover.',
    createdAt: '2026-08-19'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk_101',
    serviceId: 'srv_grooming',
    serviceName: 'Pet Grooming',
    petId: 'pet_1',
    petName: 'Buddy',
    date: '2026-08-22',
    time: '10:00 AM',
    ownerName: 'Alex Morgan',
    phone: '+91 98765 43210',
    price: 999,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / PhonePe',
    transactionId: 'TXN-904812',
    paidAt: '2026-08-16T14:21:00Z',
    notes: 'Please use sensitivity shampoo.',
    createdAt: '2026-08-16T14:20:00Z'
  },
  {
    id: 'bk_102',
    serviceId: 'srv_vet',
    serviceName: 'Vet Consultation',
    petId: 'pet_3',
    petName: 'Max',
    date: '2026-08-25',
    time: '02:30 PM',
    ownerName: 'Alex Morgan',
    phone: '+91 98765 43210',
    price: 1499,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Pay on Arrival',
    transactionId: null,
    paidAt: null,
    notes: 'Routine checkup and booster dose.',
    createdAt: '2026-08-17T09:15:00Z'
  },
  {
    id: 'bk_103',
    serviceId: 'srv_walking',
    serviceName: 'Pet Walking',
    petId: 'pet_2',
    petName: 'Luna',
    date: '2026-08-10',
    time: '08:00 AM',
    ownerName: 'Alex Morgan',
    phone: '+91 98765 43210',
    price: 499,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentMethod: 'GPay Wallet',
    transactionId: 'TXN-881204',
    paidAt: '2026-08-08T11:05:00Z',
    notes: 'Cancelled due to travel schedule change.',
    createdAt: '2026-08-08T11:00:00Z'
  }
];

export const INITIAL_REMINDERS = [
  {
    id: 'rem_1',
    petId: 'pet_1',
    petName: 'Buddy',
    title: 'Rabies Booster Shot',
    type: 'Vaccination',
    dueDate: '2026-09-05',
    time: '09:00 AM',
    status: 'Active',
    notes: 'Dr. Smith Clinic - Main Branch'
  },
  {
    id: 'rem_2',
    petId: 'pet_2',
    petName: 'Luna',
    title: 'Deworming Tablet',
    type: 'Medication',
    dueDate: '2026-08-20',
    time: '08:30 PM',
    status: 'Active',
    notes: 'Give with evening meal'
  },
  {
    id: 'rem_3',
    petId: 'pet_3',
    petName: 'Max',
    title: 'Ear Drop Medication',
    type: 'Medication',
    dueDate: '2026-08-15',
    time: '10:00 AM',
    status: 'Completed',
    notes: '2 drops in right ear'
  }
];

export const EMERGENCY_CONTACTS = [
  {
    id: 'em_1',
    name: '24/7 Animal Emergency Clinic',
    type: 'Hospital',
    phone: '+91 (800) 555-PETS',
    address: '108 Veterinary Way, MG Road, Bengaluru',
    openHours: '24 Hours / 7 Days',
    distance: '1.8 km'
  },
  {
    id: 'em_2',
    name: 'Pet Ambulance Express',
    type: 'Ambulance',
    phone: '+91 (888) 999-HELP',
    address: 'Rapid Response Hub #4, Koramangala',
    openHours: '24/7 On-Call Dispatch',
    distance: 'Mobile Service'
  },
  {
    id: 'em_3',
    name: 'Poison Control Helpline',
    type: 'Hotline',
    phone: '1800 426 4435',
    address: 'National Veterinary Center',
    openHours: '24/7 Immediate Guidance',
    distance: 'Toll Free'
  }
];
