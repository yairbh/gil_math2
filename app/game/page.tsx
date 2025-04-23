"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import GameMap from "@/components/game-map"
import MathChallenge from "@/components/math-challenge"
import CharacterSelect from "@/components/character-select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Volume2, VolumeX } from "lucide-react"

export default function GamePage() {
  const [gameState, setGameState] = useState("character-select") // character-select, map, challenge
  const [level, setLevel] = useState(1)
  const [stars, setStars] = useState(0)
  const [character, setCharacter] = useState("")
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Use refs for audio elements to persist across renders
  const audioRefs = useRef({
    correct: null,
    incorrect: null,
    levelUp: null,
    background: null,
  })

  // Initialize audio on first user interaction
  const initializeAudio = () => {
    if (audioInitialized) return

    // Create audio elements
    audioRefs.current = {
      correct: new Audio("./sounds/correct.mp3"),
      incorrect: new Audio("./sounds/incorrect.mp3"),
      levelUp: new Audio("./sounds/level-up.mp3"),
      background: new Audio("./sounds/background-music.mp3"),
    }

    // Set up background music
    audioRefs.current.background.loop = true
    audioRefs.current.background.volume = 0.3

    // Try to play background music
    const playPromise = audioRefs.current.background.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Audio autoplay was prevented. User needs to interact first:", error)
      })
    }

    setAudioInitialized(true)
    toast({
      title: "Sound Enabled!",
      description: "Game sounds are now active. Click the sound icon to mute/unmute.",
    })
  }

  // Play a sound effect
  const playSound = (soundName) => {
    if (!audioInitialized || isMuted) return

    try {
      const audio = audioRefs.current[soundName]
      if (audio) {
        audio.currentTime = 0
        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Error playing ${soundName} sound:`, error)
          })
        }
      }
    } catch (error) {
      console.warn(`Error with ${soundName} sound:`, error)
    }
  }

  // Toggle mute/unmute
  const toggleMute = () => {
    if (!audioInitialized) {
      initializeAudio()
      return
    }

    setIsMuted((prev) => {
      const newMuted = !prev

      // Update all audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.muted = newMuted
        }
      })

      // If unmuting, try to play background music
      if (!newMuted && audioRefs.current.background) {
        audioRefs.current.background.play().catch((e) => {
          console.warn("Could not play background music:", e)
        })
      }

      return newMuted
    })
  }

  const handleCharacterSelect = (selectedCharacter) => {
    // Initialize audio on first user interaction
    if (!audioInitialized) {
      initializeAudio()
    }

    setCharacter(selectedCharacter)
    setGameState("map")

    toast({
      title: "Welcome to Gil's Number Quest!",
      description: "Tap on a location to start a math challenge!",
    })
  }

  const handleChallengeSelect = (challenge) => {
    setCurrentChallenge(challenge)
    setGameState("challenge")
  }

  const handleChallengeComplete = (success, starsEarned) => {
    if (success) {
      playSound("correct")
      setStars((prev) => prev + starsEarned)

      if (stars + starsEarned >= level * 10) {
        playSound("levelUp")
        setLevel((prev) => prev + 1)
        toast({
          title: "Level Up!",
          description: `You're now level ${level + 1}!`,
        })
      }
    } else {
      playSound("incorrect")
    }

    setGameState("map")
  }

  const handleHomeClick = () => {
    // For static site, use window.location instead of router
    window.location.href = "./"
  }

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // Load saved game data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("mathAdventureGameData")
      if (savedData) {
        const { savedLevel, savedStars, savedCharacter } = JSON.parse(savedData)
        if (savedLevel) setLevel(savedLevel)
        if (savedStars) setStars(savedStars)
        if (savedCharacter) {
          setCharacter(savedCharacter)
          // If character already selected, go straight to map
          setGameState("map")
        }
      }
    } catch (error) {
      console.warn("Could not load saved game data:", error)
    }
  }, [])

  // Save game data to localStorage when it changes
  useEffect(() => {
    if (character) {
      try {
        localStorage.setItem(
          "mathAdventureGameData",
          JSON.stringify({
            savedLevel: level,
            savedStars: stars,
            savedCharacter: character,
          }),
        )
      } catch (error) {
        console.warn("Could not save game data:", error)
      }
    }
  }, [level, stars, character])

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-400 to-indigo-500 p-4">
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white/80 hover:bg-white" onClick={handleHomeClick}>
            Home
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
            <span className="text-amber-500 text-2xl">★</span>
            <span className="font-bold">{stars}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
            <span className="text-purple-500 text-xl">📚</span>
            <span className="font-bold">Level {level}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex items-center justify-center">
        {gameState === "character-select" && <CharacterSelect onSelect={handleCharacterSelect} />}

        {gameState === "map" && (
          <GameMap level={level} onChallengeSelect={handleChallengeSelect} character={character} />
        )}

        {gameState === "challenge" && currentChallenge && (
          <MathChallenge
            challenge={currentChallenge}
            level={level}
            onComplete={handleChallengeComplete}
            playSound={playSound}
          />
        )}
      </div>
    </main>
  )
}
