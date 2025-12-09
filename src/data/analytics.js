// Get venue-specific statistics
export const getVenueStats = (venueId) => {
  // Sushi/Zen/Walkons: High Revenue Saved, Low Waste Weight
  if (venueId === 'sushi' || venueId === 'zen' || venueId === 'walkons') {
    return {
      revenueRecovered: 800 + Math.floor(Math.random() * 200), // $800-1000
      wasteDiverted: 5 + Math.floor(Math.random() * 3), // 5-8 lbs
      activeUsers: 120 + Math.floor(Math.random() * 30), // 120-150
    }
  }
  
  // Pizza/Burgers/TLC: High Waste Weight, Lower Revenue Saved
  if (venueId === 'pizza' || venueId === 'burgers' || venueId === 'tlc') {
    return {
      revenueRecovered: 300 + Math.floor(Math.random() * 100), // $300-400
      wasteDiverted: 25 + Math.floor(Math.random() * 10), // 25-35 lbs
      activeUsers: 85 + Math.floor(Math.random() * 20), // 85-105
    }
  }
  
  // Default for other venues (DSJ, FoodLab, Choolaah)
  return {
    revenueRecovered: 450 + Math.floor(Math.random() * 150), // $450-600
    wasteDiverted: 12 + Math.floor(Math.random() * 8), // 12-20 lbs
    activeUsers: 95 + Math.floor(Math.random() * 25), // 95-120
  }
}

