import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFood } from '../contexts/FoodContext'
import { getVenueName } from '../data/venues'
import { VENUE_ITEMS } from '../data/menuItems'
import { getVenueStats } from '../data/analytics'
import { ArrowLeft, TrendingUp, DollarSign, Trash2, Rocket, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { clsx } from 'clsx'

export default function KitchenDashboard() {
  const navigate = useNavigate()
  const { 
    foodItems, 
    kitchenStats, 
    addAbandonedItem, 
    removeFoodItem, 
    toggleBoost,
    pushNotification,
    selectedVenue,
    orders
  } = useFood()

  // Redirect to venue selection if no venue is selected
  useEffect(() => {
    if (!selectedVenue) {
      navigate('/kitchen-login')
    }
  }, [selectedVenue, navigate])
  
  const [selectedTags, setSelectedTags] = useState([])
  const [autoDecayEnabled, setAutoDecayEnabled] = useState(false)
  const [boostNotification, setBoostNotification] = useState(false)
  const [notification, setNotification] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)

  // Get venue-specific menu items
  const venueMenuItems = useMemo(() => {
    if (!selectedVenue) return []
    return VENUE_ITEMS[selectedVenue] || []
  }, [selectedVenue])

  // Get venue-specific stats
  const venueStats = useMemo(() => {
    if (!selectedVenue) return { revenueRecovered: 0, wasteDiverted: 0, activeUsers: 0 }
    return getVenueStats(selectedVenue)
  }, [selectedVenue])

  // Get all unique tags from venue menu items
  const availableTags = useMemo(() => {
    const allTags = new Set()
    venueMenuItems.forEach((item) => {
      item.tags?.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags)
  }, [venueMenuItems])

  // Get theme colors based on venue
  const getThemeColors = () => {
    if (selectedVenue === 'foodlab') {
      return {
        bg: 'bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900',
        border: 'border-pink-400',
        accent: 'text-pink-300',
      }
    }
    if (selectedVenue === 'walkons') {
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-blue-900 to-red-900',
        border: 'border-red-400',
        accent: 'text-red-300',
      }
    }
    return {
      bg: 'bg-purdue-black',
      border: 'border-purdue-gold',
      accent: 'text-purdue-gold',
    }
  }

  const theme = getThemeColors()

  // Fake revenue data for chart (last 7 days)
  const revenueData = [
    { day: 'Mon', revenue: 320 },
    { day: 'Tue', revenue: 380 },
    { day: 'Wed', revenue: 290 },
    { day: 'Thu', revenue: 450 },
    { day: 'Fri', revenue: 520 },
    { day: 'Sat', revenue: 480 },
    { day: 'Sun', revenue: 410 },
  ]

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleQuickAdd = (item) => {
    // Use item.tags from menu data, or fall back to selectedTags
    const tagsToUse = item.tags && item.tags.length > 0 ? item.tags : selectedTags
    
    addAbandonedItem(
      {
        name: item.name,
        originalPrice: item.originalPrice,
        tags: tagsToUse,
        ecoScore: 15,
      },
      tagsToUse,
      selectedVenue, // Explicitly pass venueId
      1 // quantity
    )
    setNotification(true)
    setTimeout(() => setNotification(false), 3000)
    setSelectedTags([]) // Reset tags after adding
  }

  const handleAddFromDropdown = (e) => {
    e.preventDefault()
    if (!selectedMenuItem) return

    // Find the selected menu item from VENUE_ITEMS
    const menuItem = venueMenuItems.find((item) => 
      `${item.name} - $${item.originalPrice.toFixed(2)}` === selectedMenuItem
    )

    if (menuItem) {
      addAbandonedItem(
        {
          name: menuItem.name,
          originalPrice: menuItem.originalPrice,
          tags: menuItem.tags || [],
          ecoScore: 15,
        },
        menuItem.tags || [],
        selectedVenue,
        itemQuantity
      )
      setNotification(true)
      setTimeout(() => setNotification(false), 3000)
      setSelectedMenuItem('')
      setItemQuantity(1)
    }
  }

  // Filter orders for current venue
  const venueOrders = orders.filter((order) => order.venueId === selectedVenue)

  const handleBoost = (id) => {
    toggleBoost(id)
    setBoostNotification(true)
    setTimeout(() => setBoostNotification(false), 3000)
  }

  // Get available items only
  const availableItems = foodItems.filter((item) => item.status === 'available')

  return (
    <div className={clsx('min-h-screen text-white', theme.bg)}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center text-purdue-gold hover:text-purdue-gold/80 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        {/* Top Section: Analytics (ROI View) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className={clsx('w-8 h-8', theme.accent)} />
            <h1 className={clsx('text-4xl font-bold', theme.accent)}>
              Kitchen Dashboard: {selectedVenue ? getVenueName(selectedVenue) : 'Select Venue'}
            </h1>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={clsx('bg-black/50 border-2 rounded-lg p-6 transition-colors', theme.border)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Revenue Saved</p>
                <DollarSign className={clsx('w-5 h-5', theme.accent)} />
              </div>
              <p className={clsx('text-4xl font-bold', theme.accent)}>
                ${venueStats.revenueRecovered.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">+12% from last week</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={clsx('bg-black/50 border-2 rounded-lg p-6 transition-colors', theme.border)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Waste Diverted</p>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-4xl font-bold text-green-400">{venueStats.wasteDiverted}</p>
              <p className="text-xs text-gray-500 mt-2">lbs saved today</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={clsx('bg-black/50 border-2 rounded-lg p-6 transition-colors', theme.border)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Live Traffic</p>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <p className="text-4xl font-bold text-white">{venueStats.activeUsers}</p>
              <p className="text-xs text-gray-500 mt-2">active students browsing</p>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <div className={clsx('bg-black/50 border-2 rounded-lg p-6', theme.border)}>
            <h2 className={clsx('text-xl font-semibold mb-4', theme.accent)}>Revenue Saved Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CEB888" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#CEB888" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #CEB888',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#CEB888"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Middle Section: Smart Controls */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Add Inventory Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={clsx('bg-black/50 border-2 rounded-lg p-8 lg:col-span-2', theme.border)}
          >
            <h2 className={clsx('text-3xl font-bold mb-6', theme.accent)}>Add Inventory</h2>

            {/* Dropdown Form */}
            <form onSubmit={handleAddFromDropdown} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Select Menu Item
                </label>
                <select
                  value={selectedMenuItem}
                  onChange={(e) => setSelectedMenuItem(e.target.value)}
                  className="w-full bg-dark-gray border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purdue-gold"
                  required
                >
                  <option value="">Choose an item...</option>
                  {venueMenuItems.map((item) => (
                    <option key={item.name} value={`${item.name} - $${item.originalPrice.toFixed(2)}`}>
                      {item.name} - ${item.originalPrice.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-dark-gray border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purdue-gold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purdue-gold text-purdue-black py-4 px-6 rounded-lg font-bold text-lg hover:bg-purdue-gold/90 transition-colors shadow-lg"
              >
                Add to Flash Sale
              </button>
            </form>
          </motion.div>

          {/* Right: Incoming Reservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={clsx('bg-black/50 border-2 rounded-lg p-6', theme.border)}
          >
            <h2 className={clsx('text-2xl font-bold mb-4', theme.accent)}>Incoming Reservations</h2>
            
            {venueOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No reservations yet.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {venueOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-dark-gray/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-400">Student:</span>{' '}
                        <span className="text-white font-semibold">{order.studentName}</span>
                        <span className="text-gray-500"> ({order.studentEmail})</span>
                      </p>
                      <p>
                        <span className="text-gray-400">Item:</span>{' '}
                        <span className="text-purdue-gold font-semibold">{order.itemName}</span>
                      </p>
                      <p>
                        <span className="text-gray-400">Time:</span>{' '}
                        <span className="text-gray-300">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Section: Live Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-purdue-gold mb-6">Live Inventory Ticker</h2>

          {availableItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-dark-gray rounded-lg border border-purdue-gold/30">
              <p className="text-xl">No active items. Add an item to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {availableItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-dark-gray border-2 border-purdue-gold/50 rounded-lg p-6 hover:border-purdue-gold transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-bold text-purdue-gold">{item.name}</h3>
                          {item.isBoosted && (
                            <span className="px-2 py-1 bg-purdue-gold text-purdue-black rounded text-xs font-bold">
                              🚀 BOOSTED
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.type === 'MTO_Abandonment'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {item.type === 'MTO_Abandonment' ? 'Ready Now' : 'Batch Surplus'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>
                            <span className="line-through text-gray-500">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-purdue-gold font-bold ml-2">
                              ${item.discountedPrice.toFixed(2)}
                            </span>
                          </span>
                          {item.dietaryTags && item.dietaryTags.length > 0 && (
                            <span className="text-gray-500">
                              Tags: {item.dietaryTags.join(', ')}
                            </span>
                          )}
                          <span className="text-gray-500">
                            Expires: {new Date(item.expiresAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBoost(item.id)}
                          className={clsx(
                            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
                            item.isBoosted
                              ? 'bg-purdue-gold text-purdue-black'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          )}
                        >
                          <Rocket className="w-4 h-4" />
                          {item.isBoosted ? 'BOOSTED' : '🚀 BOOST'}
                        </motion.button>
                        <button
                          onClick={() => removeFoodItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {(notification || pushNotification) && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50"
            >
              <span className="font-semibold text-lg">Item pushed to Student App</span>
            </motion.div>
          )}

          {boostNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-purdue-gold text-purdue-black px-8 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50"
            >
              <Rocket className="w-6 h-6" />
              <span className="font-semibold text-lg">Item Boosted to Top of Student Feed</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
