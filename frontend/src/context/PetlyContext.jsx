import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { SERVICES } from '../data/mockData';

const PetlyContext = createContext();

export const PetlyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [marketplacePets, setMarketplacePets] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUserData = async () => {
    const [userPets, userBookings, userReminders] = await Promise.all([
      api.get('/pets'),
      api.get('/bookings'),
      api.get('/reminders')
    ]);
    setPets(userPets);
    setBookings(userBookings);
    setReminders(userReminders);
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const [availableServices, listings] = await Promise.all([
          api.get('/services'),
          api.get('/marketplace')
        ]);
        if (mounted) {
          setServices(availableServices);
          setMarketplacePets(listings);
        }

        const token = localStorage.getItem('petly_token');
        if (token) {
          const currentUser = await api.get('/auth/me');
          if (mounted) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
          await loadUserData();
        }
      } catch (error) {
        localStorage.removeItem('petly_token');
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setServices(current => current.length ? current : SERVICES);
          setMarketplacePets(current => current || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initialize();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('petly_token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      await loadUserData();
      showToast(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      showToast(data.message || 'Account created. Verify your email before logging in.', 'info');
      return { success: true, requiresEmailVerification: data.requiresEmailVerification, verificationUrl: data.verificationUrl };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('petly_token');
    setUser(null);
    setIsAuthenticated(false);
    setPets([]);
    setBookings([]);
    setReminders([]);
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const updatedUser = await api.put('/auth/profile', updatedData);
      setUser(updatedUser);
      showToast('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const addPet = async (petData) => {
    try {
      const newPet = await api.post('/pets', petData);
      setPets(current => [newPet, ...current]);
      showToast(`${newPet.name} has been added to your pets!`);
      return newPet;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const updatePet = async (petId, updatedData) => {
    try {
      const updatedPet = await api.put(`/pets/${petId}`, updatedData);
      setPets(current => current.map(pet => pet.id === petId ? updatedPet : pet));
      showToast('Pet details updated!');
      return updatedPet;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const deletePet = async (petId) => {
    try {
      await api.delete(`/pets/${petId}`);
      const pet = pets.find(item => item.id === petId);
      setPets(current => current.filter(item => item.id !== petId));
      showToast(`${pet ? pet.name : 'Pet'} removed`, 'info');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const addMarketplaceListing = async (listingData) => {
    try {
      const newListing = await api.post('/marketplace', {
        ...listingData,
        price: Number(listingData.price),
        certified: true,
        vaccinated: true
      });
      setMarketplacePets(current => [newListing, ...current]);
      showToast(`Your pet listing "${newListing.title}" is now live!`);
      return newListing;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const buyMarketplacePet = async (petListing) => {
    try {
      const data = await api.post(`/marketplace/${petListing.id}/buy`, {});
      setPets(current => [data.pet, ...current]);
      setMarketplacePets(current => current.filter(item => item.id !== petListing.id));
      showToast(`Congratulations! ${data.pet.name} has been added to your My Pets!`);
      return data.pet;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const addBooking = async (bookingData) => {
    try {
      const newBooking = await api.post('/bookings', bookingData);
      setBookings(current => [newBooking, ...current]);
      showToast(`Booking for ${newBooking.serviceName} confirmed! ${newBooking.paymentStatus === 'Paid' ? 'Payment Received.' : ''}`);
      return newBooking;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const payForBooking = async (bookingId, paymentDetails) => {
    try {
      const data = await api.post(`/bookings/${bookingId}/pay`, {
        paymentMethod: paymentDetails.method,
        amount: paymentDetails.amount
      });
      setBookings(current => current.map(booking => booking.id === bookingId ? data.booking : booking));
      showToast(`Payment of ₹${paymentDetails.amount} successful! Receipt #${data.transactionId}`);
      return data.transactionId;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const updatedBooking = await api.put(`/bookings/${bookingId}/cancel`, {});
      setBookings(current => current.map(booking => booking.id === bookingId ? updatedBooking : booking));
      showToast('Booking cancelled', 'warning');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const addReminder = async (reminderData) => {
    try {
      const newReminder = await api.post('/reminders', reminderData);
      setReminders(current => [newReminder, ...current]);
      showToast('Health reminder added!');
      return newReminder;
    } catch (error) {
      showToast(error.message, 'error');
      return null;
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      await api.delete(`/reminders/${reminderId}`);
      setReminders(current => current.filter(reminder => reminder.id !== reminderId));
      showToast('Reminder deleted', 'info');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const toggleReminderStatus = async (reminderId) => {
    try {
      const updatedReminder = await api.patch(`/reminders/${reminderId}/toggle`, {});
      setReminders(current => current.map(reminder => reminder.id === reminderId ? updatedReminder : reminder));
      showToast('Reminder status updated!');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const resetAllData = async () => {
    try {
      await api.post('/seed', {});
      await loadUserData();
      const listings = await api.get('/marketplace');
      setMarketplacePets(listings);
      showToast('Data reset to default demo values!', 'info');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <PetlyContext.Provider value={{
      user,
      isAuthenticated,
      pets,
      services,
      bookings,
      reminders,
      marketplacePets,
      toast,
      loading,
      login,
      register,
      logout,
      updateUserProfile,
      addPet,
      updatePet,
      deletePet,
      addMarketplaceListing,
      buyMarketplacePet,
      addBooking,
      payForBooking,
      cancelBooking,
      addReminder,
      deleteReminder,
      toggleReminderStatus,
      showToast,
      resetAllData
    }}>
      {children}
    </PetlyContext.Provider>
  );
};

export const usePetly = () => useContext(PetlyContext);
