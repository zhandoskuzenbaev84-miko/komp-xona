import React, { createContext, useContext, useState, useMemo } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedStations, setSelectedStations] = useState([]);
  const [requestedHours, setRequestedHours] = useState(2); // default to 2-hour combo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedStation, setPreSelectedStation] = useState(null);

  // Toggle single station selection in multi-select mode
  const toggleStation = (station) => {
    setSelectedStations((prev) => {
      const exists = prev.some((s) => s.id === station.id);
      if (exists) {
        return prev.filter((s) => s.id !== station.id);
      } else {
        return [...prev, station];
      }
    });
  };

  const clearSelection = () => {
    setSelectedStations([]);
  };

  const openModalWithStations = (stations) => {
    if (stations && stations.length > 0) {
      setSelectedStations(stations);
    }
    setIsModalOpen(true);
  };

  const openModalWithSingleStation = (station) => {
    setPreSelectedStation(station);
    setSelectedStations([station]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreSelectedStation(null);
  };

  // Client-side instant calculation preview
  const pricingSummary = useMemo(() => {
    const count = selectedStations.length;
    const hours = Math.max(1, requestedHours);

    let basePrice = 0;
    let finalPrice = 0;

    for (const station of selectedStations) {
      const isPC = station.type === 'PC' || station.code?.startsWith('PC');
      if (isPC) {
        basePrice += hours * 10000;
        finalPrice += Math.floor(hours / 2) * 17000 + (hours % 2) * 10000;
      } else {
        basePrice += hours * 45000;
        finalPrice += Math.floor(hours / 2) * 80000 + (hours % 2) * 45000;
      }
    }

    const isBulkBonus = count >= 5;
    const bonusHours = isBulkBonus ? 1 : 0;
    const totalDurationHours = hours + bonusHours;
    const tieredDiscount = basePrice - finalPrice;

    return {
      count,
      hours,
      bonusHours,
      totalDurationHours,
      isBulkBonus,
      basePrice,
      tieredDiscount,
      finalPrice,
    };
  }, [selectedStations, requestedHours]);

  return (
    <BookingContext.Provider
      value={{
        selectedStations,
        setSelectedStations,
        toggleStation,
        clearSelection,
        requestedHours,
        setRequestedHours,
        isModalOpen,
        openModalWithStations,
        openModalWithSingleStation,
        closeModal,
        pricingSummary,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
};
