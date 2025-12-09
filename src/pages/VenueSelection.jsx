import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useFood } from '../contexts/FoodContext'
import { VENUES } from '../data/venues'
import { ArrowLeft, Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function VenueSelection() {
  const navigate = useNavigate()
  const { setSelectedVenue } = useFood()

  const handleVenueSelect = (venueId) => {
    // Set the global selectedVenue state
    setSelectedVenue(venueId)
    // Navigate to the kitchen dashboard
    navigate('/kitchen')
  }

  // Get category icon or emoji
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

  return (
    <div className="min-h-screen bg-dark-gray text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center text-purdue-gold hover:text-purdue-gold/80 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Store className="w-16 h-16 text-purdue-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-purdue-gold mb-4">
              Select Your Venue
            </h1>
            <p className="text-xl text-gray-300">
              Choose your kitchen location to access the dashboard
            </p>
          </motion.div>
        </div>

        {/* Venue Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENUES.map((venue, index) => (
            <motion.button
              key={venue.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVenueSelect(venue.id)}
              className="bg-black/50 border-2 border-purdue-gold/50 rounded-lg p-6 text-left hover:border-purdue-gold hover:bg-black/70 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{getCategoryIcon(venue.category)}</div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="text-purdue-gold"
                >
                  →
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-purdue-gold mb-2 group-hover:text-purdue-gold/80">
                {venue.name}
              </h3>
              <p className="text-sm text-gray-400">{venue.category}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

