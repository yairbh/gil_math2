"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Import location icons from Lucide React
import { Palmtree, Mountain, Rocket, Waves, Trees } from "lucide-react"

const locations = [
  {
    id: "jungle",
    name: "Jungle",
    position: { x: 20, y: 30 },
    icon: Trees,
    minLevel: 1,
    type: "addition",
    color: "text-green-600",
    bgColor: "bg-green-100",
    shadow: "shadow-green-500/50",
    glow: "bg-green-400/30",
  },
  {
    id: "beach",
    name: "Beach",
    position: { x: 70, y: 60 },
    icon: Palmtree,
    minLevel: 1,
    type: "subtraction",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    shadow: "shadow-yellow-500/50",
    glow: "bg-yellow-400/30",
  },
  {
    id: "mountain",
    name: "Mountain",
    position: { x: 40, y: 15 },
    icon: Mountain,
    minLevel: 2,
    type: "mixed",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    shadow: "shadow-gray-500/50",
    glow: "bg-gray-400/30",
  },
  {
    id: "space",
    name: "Space",
    position: { x: 80, y: 20 },
    icon: Rocket,
    minLevel: 3,
    type: "multiplication",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    shadow: "shadow-purple-500/50",
    glow: "bg-purple-400/30",
  },
  {
    id: "underwater",
    name: "Underwater",
    position: { x: 15, y: 70 },
    icon: Waves,
    minLevel: 4,
    type: "division",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    shadow: "shadow-blue-500/50",
    glow: "bg-blue-400/30",
  },
]

export default function GameMap({ level, onChallengeSelect, character }) {
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 })
  const [availableLocations, setAvailableLocations] = useState([])
  const [clouds, setClouds] = useState([])
  const [animals, setAnimals] = useState([])
  const [treasures, setTreasures] = useState([])

  useEffect(() => {
    // Filter locations based on player level
    setAvailableLocations(locations.filter((loc) => loc.minLevel <= level))

    // Generate decorative elements
    generateClouds()
    generateAnimals()
    generateTreasures()
  }, [level])

  const generateClouds = () => {
    const newClouds = []
    const cloudCount = 5

    for (let i = 0; i < cloudCount; i++) {
      newClouds.push({
        id: `cloud-${i}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 5,
        size: Math.random() * 0.5 + 0.7,
        speed: Math.random() * 10 + 20,
      })
    }

    setClouds(newClouds)
  }

  const generateAnimals = () => {
    const animalEmojis = ["🦊", "🐢", "🦜", "🐠", "🦋", "🐿️"]
    const newAnimals = []
    const animalCount = Math.min(level + 2, 6)

    for (let i = 0; i < animalCount; i++) {
      newAnimals.push({
        id: `animal-${i}`,
        emoji: animalEmojis[i],
        x: Math.random() * 70 + 15,
        y: Math.random() * 40 + 40,
        delay: Math.random() * 5,
      })
    }

    setAnimals(newAnimals)
  }

  const generateTreasures = () => {
    const treasureEmojis = ["💎", "🏆", "🔮", "📦", "🎁"]
    const newTreasures = []
    const treasureCount = Math.min(Math.floor(level / 2) + 1, 5)

    for (let i = 0; i < treasureCount; i++) {
      newTreasures.push({
        id: `treasure-${i}`,
        emoji: treasureEmojis[i],
        x: Math.random() * 60 + 20,
        y: Math.random() * 30 + 50,
      })
    }

    setTreasures(newTreasures)
  }

  const handleLocationClick = (location) => {
    // Move character to location
    setCharacterPosition({ x: location.position.x, y: location.position.y })

    // Generate a challenge based on location type
    const challenge = generateChallenge(location.type, level)
    challenge.locationId = location.id // Add location ID to challenge

    // After a short delay, start the challenge
    setTimeout(() => {
      onChallengeSelect(challenge)
    }, 1000)
  }

  const generateChallenge = (type, level) => {
    const challenge = {
      type,
      difficulty: level,
      options: [],
      correctAnswer: null,
    }

    const max = Math.min(10 + level * 2, 20)

    switch (type) {
      case "addition":
        const a = Math.floor(Math.random() * max)
        const b = Math.floor(Math.random() * max)
        challenge.question = `${a} + ${b} = ?`
        challenge.correctAnswer = a + b
        break

      case "subtraction":
        const minuend = Math.floor(Math.random() * max) + max
        const subtrahend = Math.floor(Math.random() * minuend)
        challenge.question = `${minuend} - ${subtrahend} = ?`
        challenge.correctAnswer = minuend - subtrahend
        break

      case "multiplication":
        const factor1 = Math.floor(Math.random() * 5) + 1
        const factor2 = Math.floor(Math.random() * 5) + 1
        challenge.question = `${factor1} × ${factor2} = ?`
        challenge.correctAnswer = factor1 * factor2
        break

      case "division":
        const divisor = Math.floor(Math.random() * 5) + 1
        const quotient = Math.floor(Math.random() * 5) + 1
        const dividend = divisor * quotient
        challenge.question = `${dividend} ÷ ${divisor} = ?`
        challenge.correctAnswer = quotient
        break

      case "mixed":
        // Randomly choose between addition and subtraction
        const mixedType = Math.random() > 0.5 ? "addition" : "subtraction"
        return generateChallenge(mixedType, level)
    }

    // Generate options (including the correct answer)
    challenge.options = generateOptions(challenge.correctAnswer, max)

    return challenge
  }

  const generateOptions = (correctAnswer, max) => {
    const options = [correctAnswer]

    // Generate 3 more unique options
    while (options.length < 4) {
      const option = Math.floor(Math.random() * (max * 2))
      if (!options.includes(option)) {
        options.push(option)
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5)
  }

  // Character icons based on selection
  const getCharacterIcon = () => {
    switch (character) {
      case "explorer":
        return "👨‍🌾"
      case "astronaut":
        return "👨‍🚀"
      case "diver":
        return "🏊‍♂️"
      default:
        return "👦"
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-sky-300 to-blue-400 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
      {/* Animated clouds */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: `${cloud.y}%`,
            left: `-10%`,
            scale: cloud.size,
          }}
          animate={{
            left: ["0%", "110%"],
          }}
          transition={{
            duration: cloud.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="flex space-x-1">
            <div className="w-12 h-8 bg-white rounded-full opacity-90"></div>
            <div className="w-8 h-10 bg-white rounded-full opacity-90"></div>
            <div className="w-10 h-12 bg-white rounded-full opacity-90"></div>
          </div>
        </motion.div>
      ))}

      {/* Sun with rays */}
      <div className="absolute top-[5%] right-[10%]">
        <motion.div
          className="w-16 h-16 bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/50"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute w-2 h-8 bg-yellow-300 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "center bottom",
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </motion.div>
      </div>

      {/* Land masses with more details */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%]">
        {/* Main land */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-400 to-green-300 rounded-tl-[100px] rounded-tr-[50px]"></div>

        {/* Hills */}
        <div className="absolute bottom-0 left-[10%] w-40 h-20 bg-green-500 rounded-t-[100%]"></div>
        <div className="absolute bottom-0 left-[30%] w-60 h-40 bg-green-500 rounded-t-[100%]"></div>
        <div className="absolute bottom-0 right-[20%] w-40 h-30 bg-green-500 rounded-t-[100%]"></div>

        {/* Lake */}
        <div className="absolute top-[20%] right-[20%] w-32 h-32">
          <motion.div
            className="w-full h-full bg-blue-400 rounded-full opacity-90"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        {/* Path */}
        <motion.div
          className="absolute top-[30%] left-[10%] w-[80%] h-4 bg-yellow-200 rounded-full"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
      </div>

      {/* Mountains in background */}
      <div className="absolute top-[20%] left-[30%] w-20 h-20">
        <div className="absolute bottom-0 w-full h-full bg-gray-400 clip-triangle"></div>
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[30%] bg-white clip-triangle"></div>
      </div>
      <div className="absolute top-[15%] left-[40%] w-16 h-16">
        <div className="absolute bottom-0 w-full h-full bg-gray-500 clip-triangle"></div>
        <div className="absolute bottom-0 left-[30%] w-[40%] h-[20%] bg-white clip-triangle"></div>
      </div>

      {/* Animals */}
      {animals.map((animal) => (
        <motion.div
          key={animal.id}
          className="absolute text-2xl"
          style={{
            left: `${animal.x}%`,
            top: `${animal.y}%`,
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            delay: animal.delay,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {animal.emoji}
        </motion.div>
      ))}

      {/* Treasures */}
      {treasures.map((treasure) => (
        <motion.div
          key={treasure.id}
          className="absolute text-2xl"
          style={{
            left: `${treasure.x}%`,
            top: `${treasure.y}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {treasure.emoji}
        </motion.div>
      ))}

      {/* Locations with improved styling */}
      {availableLocations.map((location) => {
        const Icon = location.icon
        return (
          <div
            key={location.id}
            className="absolute cursor-pointer"
            style={{
              left: `${location.position.x}%`,
              top: `${location.position.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${location.glow} blur-xl`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              style={{
                width: "100%",
                height: "100%",
                transform: "translate(-25%, -25%) scale(1.5)",
              }}
            />

            <motion.div
              className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full ${location.bgColor} ${location.shadow} shadow-lg border-2 border-white`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLocationClick(location)}
            >
              <Icon className={`w-10 h-10 ${location.color}`} />

              {/* Animated stars around location */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`star-${location.id}-${i}`}
                  className="absolute w-3 h-3 text-yellow-400"
                  style={{
                    left: `${50 + Math.cos((i * (Math.PI * 2)) / 3) * 130}%`,
                    top: `${50 + Math.sin((i * (Math.PI * 2)) / 3) * 130}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-md border border-gray-200"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {location.name}
            </motion.div>
          </div>
        )
      })}

      {/* Character with improved animation */}
      <motion.div
        className="absolute z-20"
        animate={{
          left: `${characterPosition.x}%`,
          top: `${characterPosition.y}%`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {/* Character shadow */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-10 h-3 bg-black/20 rounded-full blur-sm"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          style={{ transform: "translateX(-50%)" }}
        />

        {/* Character body */}
        <motion.div
          className="relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border-2 border-gray-200"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-3xl">{getCharacterIcon()}</span>

          {/* Animated effect when moving */}
          <motion.div
            className="absolute -bottom-2 w-10 h-10 rounded-full bg-yellow-400/30 blur-md"
            animate={{ scale: [0, 1, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>

      {/* Level indicator */}
      {availableLocations.map((location) => (
        <motion.div
          key={`level-${location.id}`}
          className="absolute z-5"
          style={{
            left: `${location.position.x}%`,
            top: `${location.position.y - 15}%`,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="px-2 py-1 bg-white/80 rounded-md text-xs font-bold text-gray-700 shadow-sm">
            Level {location.minLevel}+
          </div>
        </motion.div>
      ))}
    </div>
  )
}
