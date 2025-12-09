import { Link } from 'react-router-dom'
import { ChefHat, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Half - Dark Theme */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-dark-gray flex flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purdue-gold/10 to-transparent opacity-50" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <ChefHat className="w-24 h-24 text-purdue-gold mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Aramark Operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-8"
          >
            Manage food waste and optimize kitchen operations
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/kitchen-login"
              className="inline-block bg-purdue-gold text-purdue-black px-12 py-4 rounded-lg font-bold text-xl hover:bg-purdue-gold/80 transition-colors shadow-lg"
            >
              Enter Kitchen Operations
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-1 bg-purdue-gold" />

      {/* Right Half - Gold/White Theme */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-gradient-to-br from-purdue-gold to-white flex flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <Smartphone className="w-24 h-24 text-purdue-black mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-purdue-black mb-6"
          >
            Boiler-Bites Mobile
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-700 mb-8"
          >
            Claim discounted meals and save the planet
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/student"
              className="inline-block bg-purdue-black text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              Open Mobile App
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
