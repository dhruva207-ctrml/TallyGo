const STORAGE_KEY = "trekledger:trips";

function readTrips() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    const trips = JSON.parse(saved);
    if (!Array.isArray(trips)) throw new Error("Saved trip data is invalid.");
    return trips;
  } catch (error) {
    throw new Error(`Could not read saved trips: ${error.message}`);
  }
}

function writeTrips(trips) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function getTrips() {
  return readTrips()
    .map(({ expenses, ...trip }) => ({
      ...trip,
      expenseCount: expenses.length,
      totalSpent: round2(expenses.reduce((total, expense) => total + expense.totalAmount, 0)),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getTrip(id) {
  const trip = readTrips().find((item) => item._id === id);
  if (!trip) throw new Error("Trip not found");
  const { expenses, ...tripDetails } = trip;
  return { trip: tripDetails, expenses };
}

export function createTrip({ title, currency, members }) {
  const cleanTitle = String(title || "").trim();
  const cleanMembers = Array.isArray(members)
    ? [...new Set(members.map((member) => String(member).trim()).filter(Boolean))]
    : [];
  if (!cleanTitle) throw new Error("Trip title is required");
  if (!cleanMembers.length) throw new Error("Add at least one member");

  const trip = {
    _id: crypto.randomUUID(),
    title: cleanTitle,
    currency: String(currency || "INR").trim() || "INR",
    members: cleanMembers,
    isActive: false,
    createdAt: new Date().toISOString(),
    expenses: [],
  };
  writeTrips([trip, ...readTrips()]);
  return trip;
}

export function setTripActive(id, isActive) {
  const trips = readTrips();
  if (!trips.some((trip) => trip._id === id)) throw new Error("Trip not found");
  const updatedTrips = trips.map((trip) => ({
    ...trip,
    isActive: trip._id === id ? isActive : isActive ? false : trip.isActive,
  }));
  writeTrips(updatedTrips);
  return getTrip(id).trip;
}

export function createExpense(tripId, input) {
  const trips = readTrips();
  const trip = trips.find((item) => item._id === tripId);
  if (!trip) throw new Error("Trip not found");

  const description = String(input.description || "").trim();
  const totalAmount = Number(input.totalAmount);
  const paidBy = String(input.paidBy || "").trim();
  const splitType = input.splitType || "EQUAL";
  if (!description) throw new Error("Description is required");
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) throw new Error("Total amount must be greater than zero");
  if (!trip.members.includes(paidBy)) throw new Error("Payer must be a trip member");
  if (!["EQUAL", "EXACT", "PERCENTAGE"].includes(splitType)) throw new Error("Invalid split type");

  let splits = [];
  if (splitType === "EQUAL") {
    const selected = Array.isArray(input.selectedMembers)
      ? [...new Set(input.selectedMembers.filter((member) => trip.members.includes(member)))]
      : [];
    if (!selected.length) throw new Error("Select at least one member");
    const perMember = round2(totalAmount / selected.length);
    const difference = round2(totalAmount - round2(perMember * selected.length));
    splits = selected.map((member, index) => ({
      member,
      amountOwed: round2(index === 0 ? perMember + difference : perMember),
      percentage: round2(100 / selected.length),
    }));
  } else if (splitType === "EXACT") {
    splits = (Array.isArray(input.splits) ? input.splits : [])
      .map((split) => ({
        member: String(split.member || "").trim(),
        amountOwed: round2(Number(split.amountOwed || 0)),
        percentage: null,
      }))
      .filter((split) => split.member && split.amountOwed > 0);
    const sum = round2(splits.reduce((total, split) => total + split.amountOwed, 0));
    if (splits.some((split) => !trip.members.includes(split.member)) || Math.abs(sum - totalAmount) > 0.009) {
      throw new Error("Exact split amounts must equal the total amount and use trip members");
    }
  } else {
    splits = (Array.isArray(input.splits) ? input.splits : [])
      .map((split) => ({
        member: String(split.member || "").trim(),
        percentage: round2(Number(split.percentage || 0)),
        amountOwed: round2((totalAmount * Number(split.percentage || 0)) / 100),
      }))
      .filter((split) => split.member && split.percentage > 0);
    const sum = round2(splits.reduce((total, split) => total + split.percentage, 0));
    if (splits.some((split) => !trip.members.includes(split.member)) || Math.abs(sum - 100) > 0.01) {
      throw new Error("Percentages must total 100% and use trip members");
    }
  }

  const expense = {
    _id: crypto.randomUUID(),
    tripId,
    description,
    totalAmount: round2(totalAmount),
    paidBy,
    splitType,
    splits,
    date: new Date().toISOString(),
  };
  trip.expenses.unshift(expense);
  writeTrips(trips);
  return expense;
}

export function deleteExpense(id) {
  const trips = readTrips();
  const trip = trips.find((item) => item.expenses.some((expense) => expense._id === id));
  if (!trip) throw new Error("Expense not found");
  trip.expenses = trip.expenses.filter((expense) => expense._id !== id);
  writeTrips(trips);
}
