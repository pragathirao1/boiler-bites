import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFood } from '../contexts/FoodContext'
import { VENUES } from '../data/venues'
import { ArrowLeft, CheckCircle, Leaf, Sparkles, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import emailjs from '@emailjs/browser'

export default function StudentApp() {
  const { getAvailableItems, claimItem, claimSuccess, studentStats } = useFood()
  const [studentEmail, setStudentEmail] = useState('')
  const [studentName, setStudentName] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedVenueFilter, setSelectedVenueFilter] = useState(null) // null = All, or venueId
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const [claimedItemData, setClaimedItemData] = useState(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [claimFormData, setClaimFormData] = useState({ name: '', email: '' })
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailError, setEmailError] = useState(null)

  const availableItems = getAvailableItems()

  // Get venue color for card styling
  const getVenueColor = (venueId) => {
    if (!venueId) return 'border-gray-200'
    
    const colors = {
      'anyway-you-slice-it': 'border-orange-300 bg-orange-50/30',
      'boilermaker-market-pmu': 'border-blue-300 bg-blue-50/30',
      'burgers-fries': 'border-red-300 bg-red-50/30',
      'choolaah-indian-bbq': 'border-yellow-300 bg-yellow-50/30',
      'dsj-asian-grill': 'border-purple-300 bg-purple-50/30',
      'foodlab': 'border-pink-300 bg-pink-50/30',
      'starbucks': 'border-green-300 bg-green-50/30',
      'sushi-boss': 'border-cyan-300 bg-cyan-50/30',
      'tenders-love-chicken': 'border-amber-300 bg-amber-50/30',
      'walk-ons-sports-bistreaux': 'border-indigo-300 bg-indigo-50/30',
      'zen': 'border-teal-300 bg-teal-50/30',
    }
    return colors[venueId] || 'border-gray-200'
  }

  // Get venue background color for badge
  const getVenueBgColor = (venueId) => {
    if (!venueId) return 'bg-gray-50'
    
    const colors = {
      'anyway-you-slice-it': 'bg-orange-50',
      'boilermaker-market-pmu': 'bg-blue-50',
      'burgers-fries': 'bg-red-50',
      'choolaah-indian-bbq': 'bg-yellow-50',
      'dsj-asian-grill': 'bg-purple-50',
      'foodlab': 'bg-pink-50',
      'starbucks': 'bg-green-50',
      'sushi-boss': 'bg-cyan-50',
      'tenders-love-chicken': 'bg-amber-50',
      'walk-ons-sports-bistreaux': 'bg-indigo-50',
      'zen': 'bg-teal-50',
    }
    return colors[venueId] || 'bg-gray-50'
  }

  // Get category icon for venue
  const getCategoryIcon = (category) => {
    const icons = {
      Pizza: '🍕',
      Market: '🛒',
      Burgers: '🍔',
      Indian: '🍛',
      Asian: '🍜',
      'Experimental/Dessert': '🧪',
      Coffee: '☕',
      Sushi: '🍣',
      Chicken: '🍗',
      'Sports Bar': '🍺',
      'Asian/Boba': '🧋',
    }
    return icons[category] || '🍽️'
  }

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = availableItems.filter((item) => {
      // Apply venue filter
      if (selectedVenueFilter && item.venueId !== selectedVenueFilter) {
        return false
      }
      
      // Apply dietary/price filter
      if (selectedFilter === 'All') return true
      if (selectedFilter === 'Under $4') return item.discountedPrice < 4
      if (selectedFilter === 'Vegetarian') return item.dietaryTags?.includes('Vegetarian')
      if (selectedFilter === 'Gluten-Free') return item.dietaryTags?.includes('Gluten-Free')
      return true
    })

    // Smart sorting: If "All" is selected, sort by time left (expiration)
    if (!selectedVenueFilter) {
      items.sort((a, b) => {
        const timeA = new Date(a.expiresAt).getTime()
        const timeB = new Date(b.expiresAt).getTime()
        return timeA - timeB // Soonest expiring first
      })
    }

    return items
  }, [availableItems, selectedVenueFilter, selectedFilter])

  // Watch for claim success and show overlay
  useEffect(() => {
    if (claimSuccess && claimedItemData) {
      setShowSuccessOverlay(true)
      setTimeout(() => {
        setShowSuccessOverlay(false)
        setClaimedItemData(null)
      }, 2000)
    }
  }, [claimSuccess, claimedItemData])

  // Update form data when user info changes
  useEffect(() => {
    if (studentName && studentEmail) {
      setClaimFormData({ name: studentName, email: studentEmail })
    }
  }, [studentName, studentEmail])

  const handleClaim = (item) => {
    // Open modal instead of claiming immediately
    setSelectedItem(item)
    setIsClaiming(true)
    // Pre-fill form if user has entered info before
    setClaimFormData({
      name: studentName || '',
      email: studentEmail || '',
    })
  }

  const handleConfirmReservation = async (e) => {
    e.preventDefault()
    if (!selectedItem || !claimFormData.name || !claimFormData.email) {
      return
    }

    setIsSendingEmail(true)
    setEmailError(null)

    // Generate order ID
    const orderId = `#BB-${Math.floor(Math.random() * 1000)}`

    // Prepare email template parameters
    const templateParams = {
      student_name: claimFormData.name,
      student_email: claimFormData.email,
      item_name: selectedItem.name,
      venue_name: selectedItem.venueName,
      price: selectedItem.discountedPrice.toFixed(2),
      order_id: orderId,
    }

    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_7e29925', // Your EmailJS Service ID
        'template_j8rzp5k', // Your EmailJS Template ID
        templateParams,
        'fyqks3yfURCUHwiDR' // Your EmailJS Public Key
      )

      // Email sent successfully, now claim the item
      const result = claimItem(selectedItem.id, claimFormData.name, claimFormData.email)
      
      if (result.success) {
        // Update local state
        setStudentName(claimFormData.name)
        setStudentEmail(claimFormData.email)
        
        // Close modal
        setIsClaiming(false)
        setSelectedItem(null)
        
        // Show success animation
        setClaimedItemData(selectedItem)
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      setEmailError('Could not send email, but reservation saved.')
      
      // Still claim the item even if email fails
      const result = claimItem(selectedItem.id, claimFormData.name, claimFormData.email)
      
      if (result.success) {
        setStudentName(claimFormData.name)
        setStudentEmail(claimFormData.email)
        setIsClaiming(false)
        setSelectedItem(null)
        setClaimedItemData(selectedItem)
      }
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Get tag icon
  const getTagIcon = (tag) => {
    if (tag === 'Vegetarian' || tag === 'Vegan') return '🌱'
    if (tag === 'Gluten-Free') return '🌾'
    if (tag === 'Halal') return '☪️'
    if (tag === 'Spicy') return '🌶️'
    return '🏷️'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gamification Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-purdue-gold hover:text-purdue-gold/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-purdue-black">
              <span className="text-purdue-gold">Boiler</span>-Bites
            </h1>
            <div className="flex items-center gap-2 text-green-600">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-semibold">{studentStats.co2Saved.toFixed(1)}kg CO₂</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Browse by Venue Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purdue-black mb-3">Browse by Venue</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* All Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedVenueFilter(null)}
              className={clsx(
                'px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all',
                selectedVenueFilter === null
                  ? 'bg-purdue-gold text-purdue-black shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              )}
            >
              All
            </motion.button>
            
            {/* Venue Buttons */}
            {VENUES.map((venue) => (
              <motion.button
                key={venue.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVenueFilter(venue.id)}
                className={clsx(
                  'px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all flex items-center gap-2',
                  selectedVenueFilter === venue.id
                    ? 'bg-purdue-gold text-purdue-black shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                )}
              >
                <span className="text-lg">{getCategoryIcon(venue.category)}</span>
                <span>{venue.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Vegetarian', 'Under $4', 'Gluten-Free'].map((filter) => (
            <motion.button
              key={filter}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all',
                selectedFilter === filter
                  ? 'bg-purdue-gold text-purdue-black'
                  : 'bg-white text-gray-700 border border-gray-300'
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4 pb-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-md">
              <p className="text-xl">No meals match your filters. Try a different filter!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const isMTO = item.type === 'MTO_Abandonment'
                const co2Amount = (item.ecoScore * 0.1).toFixed(1)

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={clsx(
                      'bg-white rounded-2xl p-5 shadow-md border-2 transition-all relative overflow-hidden',
                      item.isBoosted
                        ? 'border-purdue-gold shadow-lg shadow-purdue-gold/20'
                        : getVenueColor(item.venueId),
                      'hover:border-purdue-gold'
                    )}
                  >
                    {/* Glowing effect for boosted items */}
                    {item.isBoosted && (
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(206, 184, 136, 0.3)',
                            '0 0 30px rgba(206, 184, 136, 0.5)',
                            '0 0 20px rgba(206, 184, 136, 0.3)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                      />
                    )}

                    {/* Badges Row */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {item.isBoosted && (
                        <span className="px-3 py-1 bg-purdue-gold text-purdue-black rounded-full text-xs font-bold">
                          🔥 TRENDING
                        </span>
                      )}
                      {isMTO ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          🔥 READY NOW
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          💰 GREAT DEAL
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Earn +{item.ecoScore} pts
                      </span>
                    </div>

                    {/* Food Name */}
                    <h3 className="text-2xl font-bold text-purdue-black mb-3">{item.name}</h3>

                    {/* Venue Name - Prominently Displayed */}
                    {item.venueName && (
                      <div className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-lg mb-3',
                        getVenueBgColor(item.venueId)
                      )}>
                        <MapPin className="w-4 h-4 text-purdue-gold" />
                        <span className="text-sm font-semibold text-purdue-black">
                          📍 {item.venueName}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {item.dietaryTags && item.dietaryTags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {item.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                          >
                            <span>{getTagIcon(tag)}</span>
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-gray-400 line-through text-base">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-purdue-gold font-bold text-3xl">
                          ${item.discountedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleClaim(item)}
                      className="w-full bg-purdue-gold text-purdue-black py-4 rounded-xl font-bold text-lg hover:bg-purdue-gold/80 transition-colors shadow-lg"
                    >
                      CLAIM MEAL
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Claim Form Modal */}
      <AnimatePresence>
        {isClaiming && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setIsClaiming(false)
              setSelectedItem(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-purdue-black mb-2">Secure Your Meal</h2>
              <p className="text-gray-600 mb-6">Please provide your details to complete the reservation</p>

              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={claimFormData.name}
                    onChange={(e) =>
                      setClaimFormData({ ...claimFormData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-purdue-black focus:outline-none focus:border-purdue-gold"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purdue Email
                  </label>
                  <input
                    type="email"
                    value={claimFormData.email}
                    onChange={(e) =>
                      setClaimFormData({ ...claimFormData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-purdue-black focus:outline-none focus:border-purdue-gold"
                    placeholder="jdoe@purdue.edu"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="flex-1 bg-purdue-gold text-purdue-black px-6 py-3 rounded-xl font-semibold hover:bg-purdue-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingEmail ? 'Sending Confirmation...' : 'Confirm Reservation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsClaiming(false)
                      setSelectedItem(null)
                    }}
                    className="flex-1 bg-gray-200 text-purdue-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Error Toast */}
      <AnimatePresence>
        {emailError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <p className="font-semibold">{emailError}</p>
            <button
              onClick={() => setEmailError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && claimedItemData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-purdue-black mb-4"
              >
                Success!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 text-lg mb-2"
              >
                You saved <span className="font-bold text-purdue-gold">1 Meal</span>
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-700 text-lg"
              >
                & Prevented{' '}
                <span className="font-bold text-green-600">
                  {(claimedItemData.ecoScore * 0.1).toFixed(1)}kg CO₂
                </span>
                !
              </motion.p>

              {/* Confetti effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos((i / 30) * Math.PI * 2) * 200,
                      y: Math.sin((i / 30) * Math.PI * 2) * 200,
                    }}
                    transition={{ duration: 2, delay: 0.6 + i * 0.05 }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-4 h-4 text-purdue-gold" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
