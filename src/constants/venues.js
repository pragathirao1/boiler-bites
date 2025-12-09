export const VENUES = [
  {
    id: 'anyway-you-slice-it',
    name: 'Anyway You Slice It',
    category: 'Pizza',
  },
  {
    id: 'boilermaker-market-pmu',
    name: 'Boilermaker Market @ PMU',
    category: 'Market',
  },
  {
    id: 'burgers-fries',
    name: 'Burgers + Fries',
    category: 'Burgers',
  },
  {
    id: 'choolaah-indian-bbq',
    name: 'Choolaah Indian BBQ',
    category: 'Indian',
  },
  {
    id: 'dsj-asian-grill',
    name: 'DSJ Asian Grill',
    category: 'Asian',
  },
  {
    id: 'foodlab',
    name: 'FoodLab',
    category: 'Experimental/Dessert',
  },
  {
    id: 'starbucks',
    name: 'Starbucks®',
    category: 'Coffee',
  },
  {
    id: 'sushi-boss',
    name: 'Sushi Boss',
    category: 'Sushi',
  },
  {
    id: 'tenders-love-chicken',
    name: 'Tenders, Love & Chicken',
    category: 'Chicken',
  },
  {
    id: 'walk-ons-sports-bistreaux',
    name: "Walk-On's Sports Bistreaux",
    category: 'Sports Bar',
  },
  {
    id: 'zen',
    name: 'Zen',
    category: 'Asian/Boba',
  },
]

// Helper function to get venue by ID
export const getVenueById = (venueId) => {
  return VENUES.find((venue) => venue.id === venueId)
}

// Helper function to get venue name by ID
export const getVenueName = (venueId) => {
  const venue = getVenueById(venueId)
  return venue ? venue.name : 'Unknown Venue'
}

