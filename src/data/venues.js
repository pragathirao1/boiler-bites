export const VENUES = [
  {
    id: 'walkons',
    name: "Walk-On's Sports Bistreaux",
    category: 'Sports Bar',
  },
  {
    id: 'dsj',
    name: 'DSJ Asian Grill',
    category: 'Asian',
  },
  {
    id: 'pizza',
    name: 'Anyway You Slice It',
    category: 'Pizza',
  },
  {
    id: 'sushi',
    name: 'Sushi Boss',
    category: 'Sushi',
  },
  {
    id: 'burgers',
    name: 'Burgers + Fries',
    category: 'Burgers',
  },
  {
    id: 'foodlab',
    name: 'FoodLab',
    category: 'Experimental/Dessert',
  },
  {
    id: 'choolaah',
    name: 'Choolaah Indian BBQ',
    category: 'Indian',
  },
  {
    id: 'zen',
    name: 'Zen',
    category: 'Asian/Boba',
  },
  {
    id: 'tlc',
    name: 'Tenders, Love & Chicken',
    category: 'Chicken',
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

