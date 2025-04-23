"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MathChallenge({ challenge, level, onComplete, playSound }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null) // null, "correct", "incorrect"
  const [timer, setTimer] = useState(null)
  const [visualElements, setVisualElements] = useState([])
  const [exerciseCount, setExerciseCount] = useState(1)
  const [currentChallenge, setCurrentChallenge] = useState(challenge)
  const [totalStars, setTotalStars] = useState(0)

  useEffect(() => {
    // Reset state for new challenge
    setSelectedAnswer(null)
    setResult(null)

    // Create visual elements for the challenge
    createVisualElements()

    // Set timer based on level
    const timeLimit = Math.max(20 - level, 10)
    setTimer(timeLimit)

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (result === null) {
            handleAnswer(null)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentChallenge])

  const createVisualElements = () => {
    // Create visual elements based on the challenge type
    const elements = []

    if (currentChallenge.type === "addition" || currentChallenge.type === "subtraction") {
      // Parse the question to get the numbers
      const parts = currentChallenge.question.split(/[+\-=]/g)
      const num1 = Number.parseInt(parts[0].trim())
      const num2 = Number.parseInt(parts[1].trim())

      // Create visual elements for the first number
      for (let i = 0; i < num1; i++) {
        elements.push({
          id: `elem-1-${i}`,
          type: "circle",
          color: "bg-blue-500",
          group: 1,
        })
      }

      // Create visual elements for the second number
      for (let i = 0; i < num2; i++) {
        elements.push({
          id: `elem-2-${i}`,
          type: "circle",
          color: currentChallenge.type === "addition" ? "bg-green-500" : "bg-red-500",
          group: 2,
        })
      }
    } else if (currentChallenge.type === "multiplication") {
      // Parse the question to get the numbers
      const parts = currentChallenge.question.split(/[×=]/g)
      const num1 = Number.parseInt(parts[0].trim())
      const num2 = Number.parseInt(parts[1].trim())

      // Create a grid of elements
      for (let i = 0; i < num1; i++) {
        for (let j = 0; j < num2; j++) {
          elements.push({
            id: `elem-${i}-${j}`,
            type: "square",
            color: "bg-purple-500",
            group: 1,
          })
        }
      }
    } else if (currentChallenge.type === "division") {
      // Parse the question to get the numbers
      const parts = currentChallenge.question.split(/[÷=]/g)
      const dividend = Number.parseInt(parts[0].trim())
      const divisor = Number.parseInt(parts[1].trim())

      // Create elements for the dividend
      for (let i = 0; i < dividend; i++) {
        elements.push({
          id: `elem-${i}`,
          type: "circle",
          color: "bg-orange-500",
          group: Math.floor(i / divisor) + 1,
        })
      }
    }

    setVisualElements(elements)
  }

  const handleAnswer = (answer) => {
    if (result !== null) return // Already answered

    const isCorrect = answer === currentChallenge.correctAnswer
    setResult(isCorrect ? "correct" : "incorrect")
    setSelectedAnswer(answer)

    // Play sound through the parent component
    if (isCorrect) {
      playSound("correct")
    } else {
      playSound("incorrect")
    }

    // Calculate stars earned
    const starsEarned = isCorrect ? Math.max(1, Math.floor(timer / 2)) : 0
    setTotalStars((prev) => prev + starsEarned)

    // After a delay, either show next exercise or complete the challenge
    setTimeout(() => {
      if (exerciseCount < 3 && isCorrect) {
        // Generate a new challenge of the same type
        generateNextChallenge()
      } else {
        // Complete the challenge after 3 exercises or on incorrect answer
        onComplete(isCorrect, totalStars + starsEarned)
      }
    }, 2000)
  }

  const generateNextChallenge = () => {
    // Create a new challenge of the same type
    const max = Math.min(10 + level * 2, 20)
    const newChallenge = { ...currentChallenge }

    switch (currentChallenge.type) {
      case "addition":
        const a = Math.floor(Math.random() * max)
        const b = Math.floor(Math.random() * max)
        newChallenge.question = `${a} + ${b} = ?`
        newChallenge.correctAnswer = a + b
        break

      case "subtraction":
        const minuend = Math.floor(Math.random() * max) + max
        const subtrahend = Math.floor(Math.random() * minuend)
        newChallenge.question = `${minuend} - ${subtrahend} = ?`
        newChallenge.correctAnswer = minuend - subtrahend
        break

      case "multiplication":
        const factor1 = Math.floor(Math.random() * 5) + 1
        const factor2 = Math.floor(Math.random() * 5) + 1
        newChallenge.question = `${factor1} × ${factor2} = ?`
        newChallenge.correctAnswer = factor1 * factor2
        break

      case "division":
        const divisor = Math.floor(Math.random() * 5) + 1
        const quotient = Math.floor(Math.random() * 5) + 1
        const dividend = divisor * quotient
        newChallenge.question = `${dividend} ÷ ${divisor} = ?`
        newChallenge.correctAnswer = quotient
        break
    }

    // Generate options (including the correct answer)
    newChallenge.options = generateOptions(newChallenge.correctAnswer, max)

    // Update state for next exercise
    setExerciseCount((prev) => prev + 1)
    setCurrentChallenge(newChallenge)
    setSelectedAnswer(null)
    setResult(null)
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

  const handleBackToMap = () => {
    onComplete(false, totalStars)
  }

  const renderVisualElements = () => {
    if (currentChallenge.type === "addition" || currentChallenge.type === "subtraction") {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {visualElements
              .filter((e) => e.group === 1)
              .map((elem) => (
                <motion.div
                  key={elem.id}
                  className={`w-6 h-6 rounded-full ${elem.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                />
              ))}
          </div>

          <div className="text-2xl font-bold">{currentChallenge.type === "addition" ? "+" : "-"}</div>

          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {visualElements
              .filter((e) => e.group === 2)
              .map((elem) => (
                <motion.div
                  key={elem.id}
                  className={`w-6 h-6 rounded-full ${elem.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.3 }}
                />
              ))}
          </div>
        </div>
      )
    } else if (currentChallenge.type === "multiplication") {
      // Group elements by rows
      const rows = {}
      visualElements.forEach((elem) => {
        const row = elem.id.split("-")[1]
        if (!rows[row]) rows[row] = []
        rows[row].push(elem)
      })

      return (
        <div className="flex flex-col items-center gap-2">
          {Object.values(rows).map((rowElems, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-2">
              {rowElems.map((elem, colIndex) => (
                <motion.div
                  key={elem.id}
                  className={`w-6 h-6 ${elem.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.05 * (rowIndex + colIndex),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )
    } else if (currentChallenge.type === "division") {
      // Group elements by groups (representing the quotient)
      const groups = {}
      visualElements.forEach((elem) => {
        if (!groups[elem.group]) groups[elem.group] = []
        groups[elem.group].push(elem)
      })

      return (
        <div className="flex flex-col items-center gap-4">
          {Object.entries(groups).map(([groupId, groupElems]) => (
            <div
              key={`group-${groupId}`}
              className="flex flex-wrap justify-center gap-2 p-2 border border-dashed border-gray-300 rounded-lg max-w-md"
            >
              {groupElems.map((elem, index) => (
                <motion.div
                  key={elem.id}
                  className={`w-6 h-6 rounded-full ${elem.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.05 * (Number.parseInt(groupId) + index),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  // Get location name based on challenge
  const getLocationName = () => {
    const locationMap = {
      jungle: "Jungle",
      beach: "Beach",
      mountain: "Mountain",
      space: "Space",
      underwater: "Underwater",
    }
    return locationMap[currentChallenge.locationId] || "Adventure"
  }

  return (
    <div className="w-full max-w-2xl">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackToMap}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-bold">
                {getLocationName()} Challenge ({exerciseCount}/3)
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-full font-bold ${
                  timer > 10
                    ? "bg-green-100 text-green-700"
                    : timer > 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {timer}s
              </div>
              <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                <span className="text-amber-500 text-lg">★</span>
                <span className="font-bold">{totalStars}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 mb-8">
            {/* Visual representation */}
            <div className="w-full p-4 bg-gray-50 rounded-lg flex justify-center">{renderVisualElements()}</div>

            {/* Question */}
            <div className="text-4xl font-bold">{currentChallenge.question}</div>
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-4">
            {currentChallenge.options.map((option) => (
              <motion.button
                key={option}
                className={`p-6 text-2xl font-bold rounded-lg border-2 ${
                  selectedAnswer === option
                    ? result === "correct"
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-500 text-red-700"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => handleAnswer(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={result !== null}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={`p-8 rounded-xl ${
                    result === "correct" ? "bg-green-500" : "bg-red-500"
                  } text-white text-4xl font-bold`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  {result === "correct"
                    ? exerciseCount < 3
                      ? "Correct! Next problem coming up! 🎉"
                      : "All correct! Great job! 🎉"
                    : "Try Again! 🤔"}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
