import auCinemas from "./auCinemas.json";
import nzCinemas from "./nzCinemas.json";
import { countBy } from "lodash";
import { matchCinemaToFranchise } from "./franchises";

// Helper function to add properties to objects
const addKeyToObject = (key, value) => (obj) => ({ ...obj, [key]: value });

// Combine and enhance cinema data
const cinemas = [
  ...auCinemas.map(addKeyToObject("countryCode", "au")),
  ...nzCinemas.map(addKeyToObject("countryCode", "nz")),
].map((cinema) => ({
  ...cinema,
  franchise: matchCinemaToFranchise(cinema),
}));

// Basic country filter
const filterByCountry = (cinemas, countries = ["au", "nz"]) =>
  cinemas.filter((cinema) => countries.includes(cinema.countryCode));

// Advanced filtering
const filterCinemas = (cinemas, filters = {}) => {
  return cinemas.filter((cinema) => {
    return Object.entries(filters).every(([key, value]) => {
      if (key === "maxPrice") return cinema.price <= value;
      if (key === "minPrice") return cinema.price >= value;
      if (key === "hasCandyBar") return cinema.candyBar === value;
      if (key === "has3DScreening") return cinema.has3DScreening === value;
      if (key === "hasIMAX") return cinema.hasIMAX === value;
      if (key === "hasParking") return cinema.hasParking === value;
      if (key === "rating") return cinema.rating >= value;
      if (key === "isOpen") return cinema.isOpen === value;
      if (key === "cinemaType") return cinema.cinemaType === value;
      return cinema[key] === value;
    });
  });
};

// Sorting functionality
const sortCinemas = (cinemas, sortBy = "name") => {
  return [...cinemas].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating; // Highest rating first
    return a[sortBy].localeCompare(b[sortBy]);
  });
};

// Combined processing pipeline
const processCinemas = ({
  countries = ["au", "nz"],
  filters = {},
  sortBy = "name",
} = {}) => {
  let processed = filterByCountry(cinemas, countries);
  processed = filterCinemas(processed, filters);
  return sortCinemas(processed, sortBy);
};

// Example usage with advanced filters:
const advancedFilters = {
  hasCandyBar: true,
  maxPrice: 20,
  has3DScreening: true,
  hasIMAX: false,
  rating: 4.0, // Filter cinemas with rating higher than or equal to 4.0
  isOpen: true, // Only show cinemas that are open
};

const filteredCinemas = processCinemas({
  filters: advancedFilters,
  sortBy: "price", // Sorting by price
});

// Export statistics and cinemas
export const breakdown = countBy(filteredCinemas, "countryCode");
export default filteredCinemas;
