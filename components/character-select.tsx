"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Compass, Rocket, Anchor } from "lucide-react"

const characters = [
  {
    id: "explorer",
    name: "Explorer",
    icon: Compass,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    id: "astronaut",
    name: "Astronaut",
    icon: Rocket,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "diver",
    name: "Diver",
    icon: Anchor,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
]

export default function CharacterSelect({ onSelect }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const handleSelect = (character) => {
    setSelectedCharacter(character.id)
  }

  const handleConfirm = () => {
    if (selectedCharacter) {
      onSelect(selectedCharacter)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 w-full max-w-3xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Character</h1>
        <p className="text-white/80 text-xl">Who will help Gil on this math adventure?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {characters.map((character) => {
          const Icon = character.icon
          return (
            <motion.div key={character.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                className={`cursor-pointer transition-all ${
                  selectedCharacter === character.id ? "ring-4 ring-yellow-400 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => handleSelect(character)}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <div className={`flex items-center justify-center w-32 h-32 mb-4 rounded-full ${character.bgColor}`}>
                    <Icon className={`w-16 h-16 ${character.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{character.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Button
        size="lg"
        className="mt-4 h-16 w-40 rounded-full bg-green-500 text-xl hover:bg-green-600"
        disabled={!selectedCharacter}
        onClick={handleConfirm}
      >
        Start!
      </Button>
    </div>
  )
}
