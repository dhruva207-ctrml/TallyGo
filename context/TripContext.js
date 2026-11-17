"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createExpense as saveExpense,
  createTrip as saveTrip,
  deleteExpense as removeExpense,
  getTrip as readTrip,
  getTrips,
  setTripActive as updateTripActive,
} from "@/lib/trip-storage";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [error, setError] = useState("");

  const refreshTrips = useCallback(() => {
    try {
      setTrips(getTrips());
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  useEffect(() => {
    refreshTrips();
    window.addEventListener("storage", refreshTrips);
    return () => window.removeEventListener("storage", refreshTrips);
  }, [refreshTrips]);

  const createTrip = useCallback((input) => {
    const trip = saveTrip(input);
    refreshTrips();
    return trip;
  }, [refreshTrips]);

  const createExpense = useCallback((tripId, input) => {
    const expense = saveExpense(tripId, input);
    refreshTrips();
    return expense;
  }, [refreshTrips]);

  const deleteExpense = useCallback((expenseId) => {
    removeExpense(expenseId);
    refreshTrips();
  }, [refreshTrips]);

  const setTripActive = useCallback((tripId, isActive) => {
    const trip = updateTripActive(tripId, isActive);
    refreshTrips();
    return trip;
  }, [refreshTrips]);

  const value = useMemo(() => ({
    trips,
    activeTrip: trips.find((trip) => trip.isActive) || null,
    loadingTrips,
    error,
    refreshTrips,
    createTrip,
    getTrip: readTrip,
    createExpense,
    deleteExpense,
    setTripActive,
  }), [trips, loadingTrips, error, refreshTrips, createTrip, createExpense, deleteExpense, setTripActive]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrips must be used within a TripProvider");
  return context;
}
