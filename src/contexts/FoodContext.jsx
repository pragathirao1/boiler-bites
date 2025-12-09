import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getVenueName } from '../data/venues'

const FoodContext = createContext(null)

export function FoodProvider({ children }) {
  // Calculate expiration time (15 minutes from now for dummy data)
  const getExpiresIn15Mins = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 15)
    return now.toISOString()
  }

  // Selected venue state (tracks which kitchen is currently logged in)
  const [selectedVenue, setSelectedVenue] = useState(null)

  // Demo data - 3 items already live
  const getExpiresIn = (minutes) => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + minutes)
    return now.toISOString()
  }

  // Smart database state with advanced features
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: 'Hawaiian Classic Poke',
      type: 'MTO_Abandonment',
      originalPrice: 12.95,
      discountedPrice: 6.48, // 50% off
      status: 'available',
      dietaryTags: ['Raw', 'Fresh'],
      ecoScore: 25,
      isBoosted: false,
      quantity: 1,
      venueId: 'zen',
      venueName: 'Zen',
      preparedTime: new Date(Date.now() - 5 * 60000).toISOString(),
      expiresAt: getExpiresIn(10), // Expiring in 10 mins
    },
    {
      id: 2,
      name: 'Pepperoni Slice',
      type: 'MTO_Abandonment',
      originalPrice: 4.29,
      discountedPrice: 2.15, // 50% off
      status: 'available',
      dietaryTags: ['Quick'],
      ecoScore: 15,
      isBoosted: false,
      quantity: 1,
      venueId: 'pizza',
      venueName: 'Anyway You Slice It',
      preparedTime: new Date(Date.now() - 10 * 60000).toISOString(),
      expiresAt: getExpiresIn(45), // Expiring in 45 mins
    },
    {
      id: 3,
      name: 'Double Bacon Cheese',
      type: 'MTO_Abandonment',
      originalPrice: 9.29,
      discountedPrice: 4.65, // 50% off
      status: 'available',
      dietaryTags: ['Beef', 'Heavy'],
      ecoScore: 20,
      isBoosted: false,
      quantity: 1,
      venueId: 'burgers',
      venueName: 'Burgers + Fries',
      preparedTime: new Date(Date.now() - 2 * 60000).toISOString(),
      expiresAt: getExpiresIn(5), // Expiring in 5 mins
    },
  ])

  // Kitchen statistics
  const [kitchenStats, setKitchenStats] = useState({
    revenueRecovered: 450,
    wasteDiverted: 12,
    activeUsers: 85,
  })

  // Student statistics
  const [studentStats, setStudentStats] = useState({
    points: 120,
    co2Saved: 4.5,
  })

  const [claimSuccess, setClaimSuccess] = useState(false)
  const [pushNotification, setPushNotification] = useState(false)

  // Orders state - stores claimed items with student details
  const [orders, setOrders] = useState([])

  // Auto-expire items when their time is up
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setFoodItems((prev) =>
        prev.map((item) => {
          if (item.status === 'available' && new Date(item.expiresAt) <= now) {
            return { ...item, status: 'expired' }
          }
          return item
        })
      )
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [])

  // Add abandoned item (Made to Order but left behind) - "Ready Now" with 30-minute expiration
  // Accepts full item object: { name, originalPrice, tags, quantity, ecoScore, etc. }
  const addAbandonedItem = useCallback((item, tags = [], venueId = null, quantity = 1) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 60000) // 30 minutes from now

    // Use provided venueId or fall back to selectedVenue
    const finalVenueId = venueId || selectedVenue
    const venueName = finalVenueId ? getVenueName(finalVenueId) : 'Unknown Venue'

    // Calculate 50% discount automatically
    const originalPrice = item.originalPrice || 0
    const discountedPrice = originalPrice * 0.5

    // Use tags from item object if provided, otherwise use tags parameter
    const finalTags = item.tags || tags || []

    // Create items based on quantity
    const newItems = []
    for (let i = 0; i < quantity; i++) {
      newItems.push({
        id: Date.now() + i, // Unique ID for each item
        name: item.name,
        type: 'MTO_Abandonment',
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        status: 'available',
        dietaryTags: finalTags,
        ecoScore: item.ecoScore || 15, // Default eco score
        isBoosted: false,
        quantity: 1,
        venueId: finalVenueId,
        venueName: venueName,
        preparedTime: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      })
    }

    setFoodItems((prev) => [...prev, ...newItems])

    // Trigger notification
    setPushNotification(true)
    setTimeout(() => setPushNotification(false), 3000)

    return newItems
  }, [selectedVenue])

  // Add batch surplus (End of night leftovers)
  const addBatchSurplus = useCallback((item, tags = [], venueId = null) => {
    const now = new Date()
    const expiresAt = item.expiresAt
      ? new Date(item.expiresAt).toISOString()
      : new Date(now.getTime() + 2 * 60 * 60000).toISOString() // Default 2 hours

    // Use provided venueId or fall back to selectedVenue
    const finalVenueId = venueId || selectedVenue
    const venueName = finalVenueId ? getVenueName(finalVenueId) : 'Unknown Venue'

    const newItem = {
      id: Date.now(),
      name: item.name,
      type: 'Batch_Surplus',
      originalPrice: item.originalPrice || 0,
      discountedPrice: item.discountedPrice || 0,
      status: 'available',
      dietaryTags: tags || [],
      ecoScore: item.ecoScore || 25, // Default eco score for batch items
      isBoosted: false,
      quantity: item.quantity || 1,
      venueId: finalVenueId,
      venueName: venueName,
      preparedTime: item.preparedTime || now.toISOString(),
      expiresAt: expiresAt,
    }

    setFoodItems((prev) => [...prev, newItem])
    return newItem
  }, [selectedVenue])

  // Toggle boost for "Hot Deals"
  const toggleBoost = useCallback((id) => {
    setFoodItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isBoosted: !item.isBoosted }
        }
        return item
      })
    )
  }, [])

  // Claim item (Student App) - updates status, stats, creates order, and triggers success
  const claimItem = useCallback(
    (itemId, studentName, studentEmail) => {
      const item = foodItems.find((f) => f.id === itemId)
      if (!item || item.status !== 'available') {
        return { success: false, message: 'Item not available' }
      }

      // Create order object
      const newOrder = {
        id: Date.now(),
        studentName: studentName,
        studentEmail: studentEmail,
        itemName: item.name,
        venueId: item.venueId,
        timestamp: new Date().toISOString(),
      }

      // Add to orders array
      setOrders((prev) => [...prev, newOrder])

      // Mark item as claimed (remove from available list)
      setFoodItems((prev) =>
        prev.map((foodItem) => {
          if (foodItem.id === itemId && foodItem.status === 'available') {
            return { ...foodItem, status: 'claimed' }
          }
          return foodItem
        })
      )

      // Update kitchen stats - increase revenue recovered
      setKitchenStats((prev) => ({
        ...prev,
        revenueRecovered: prev.revenueRecovered + item.discountedPrice,
        wasteDiverted: prev.wasteDiverted + 1,
      }))

      // Update student stats - add ecoScore to points and calculate CO2 saved
      setStudentStats((prev) => ({
        points: prev.points + item.ecoScore,
        co2Saved: prev.co2Saved + item.ecoScore * 0.1, // 0.1 CO2 per eco score point
      }))

      // Trigger success state
      setClaimSuccess(true)
      setTimeout(() => setClaimSuccess(false), 3000)

      return { success: true, order: newOrder }
    },
    [foodItems]
  )

  // Update food item
  const updateFoodItem = useCallback((id, updates) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [])

  // Remove food item
  const removeFoodItem = useCallback((id) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Get available food items
  const getAvailableItems = useCallback(() => {
    const now = new Date()
    return foodItems.filter(
      (item) =>
        item.status === 'available' &&
        item.quantity > 0 &&
        new Date(item.expiresAt) > now // Not expired
    )
  }, [foodItems])

  // Get boosted items (Hot Deals)
  const getBoostedItems = useCallback(() => {
    return getAvailableItems().filter((item) => item.isBoosted)
  }, [getAvailableItems])

  // Calculate total waste saved (claimed items)
  const totalWasteSaved = foodItems.filter((item) => item.status === 'claimed').length

  const value = {
    foodItems,
    kitchenStats,
    studentStats,
    claimSuccess,
    pushNotification,
    totalWasteSaved,
    selectedVenue,
    setSelectedVenue,
    orders,
    addAbandonedItem,
    addBatchSurplus,
    toggleBoost,
    claimItem,
    updateFoodItem,
    removeFoodItem,
    getAvailableItems,
    getBoostedItems,
  }

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>
}

export function useFood() {
  const context = useContext(FoodContext)
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider')
  }
  return context
}
