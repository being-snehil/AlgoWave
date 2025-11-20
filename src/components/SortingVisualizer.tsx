import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

interface ArrayBar {
  value: number
  id: number
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
}

type SortingAlgorithm = 'bubble' | 'quick' | 'merge' | 'selection'

export const SortingVisualizer = () => {
  const [array, setArray] = useState<ArrayBar[]>([])
  const [arraySize, setArraySize] = useState(50)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [sortingSteps, setSortingSteps] = useState<ArrayBar[][]>([])

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray: ArrayBar[] = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 400) + 10,
        id: i
      })
    }
    setArray(newArray)
    setCurrentStep(0)
    setSortingSteps([])
    setIsPlaying(false)
  }, [arraySize])

  // Helper function to create a step
  const createStep = (arr: ArrayBar[], comparing: number[] = [], swapping: number[] = [], sorted: number[] = []): ArrayBar[] => {
    return arr.map((item, index) => ({
      ...item,
      isComparing: comparing.includes(index),
      isSwapping: swapping.includes(index),
      isSorted: sorted.includes(index)
    }))
  }

  // Bubble Sort Algorithm
  const bubbleSort = (arr: ArrayBar[]) => {
    const steps: ArrayBar[][] = []
    const arrayCopy = [...arr]
    
    steps.push(createStep(arrayCopy)) // Initial state
    
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      for (let j = 0; j < arrayCopy.length - i - 1; j++) {
        // Comparing elements
        steps.push(createStep(arrayCopy, [j, j + 1], [], 
          Array.from({ length: arrayCopy.length - i - 1 }, (_, k) => arrayCopy.length - k - 1)
        ))
        
        if (arrayCopy[j].value > arrayCopy[j + 1].value) {
          // Swapping elements
          steps.push(createStep(arrayCopy, [], [j, j + 1],
            Array.from({ length: arrayCopy.length - i - 1 }, (_, k) => arrayCopy.length - k - 1)
          ))
          
          // Perform swap
          const temp = arrayCopy[j]
          arrayCopy[j] = arrayCopy[j + 1]
          arrayCopy[j + 1] = temp
          
          // After swap
          steps.push(createStep(arrayCopy, [], [],
            Array.from({ length: arrayCopy.length - i - 1 }, (_, k) => arrayCopy.length - k - 1)
          ))
        }
      }
    }
    
    // Final sorted state
    steps.push(createStep(arrayCopy, [], [], Array.from({ length: arrayCopy.length }, (_, i) => i)))
    
    return steps
  }

  // Merge Sort Algorithm
  const mergeSort = (arr: ArrayBar[]) => {
    const steps: ArrayBar[][] = []
    const arrayCopy = [...arr]
    
    const mergeSortHelper = (arr: ArrayBar[], start: number, end: number) => {
      if (start >= end) return
    
      const mid = Math.floor((start + end) / 2)
      mergeSortHelper(arr, start, mid)
      mergeSortHelper(arr, mid + 1, end)
      merge(arr, start, mid, end, steps)
    }
    
    const merge = (arr: ArrayBar[], start: number, mid: number, end: number, steps: ArrayBar[][]) => {
      const leftArray = arr.slice(start, mid + 1)
      const rightArray = arr.slice(mid + 1, end + 1)
      
      let i = 0, j = 0, k = start
      
      while (i < leftArray.length && j < rightArray.length) {
        // Comparing elements
        steps.push(createStep(arr, [start + i, mid + 1 + j]))
        
        if (leftArray[i].value <= rightArray[j].value) {
          arr[k] = leftArray[i]
          i++
        } else {
          arr[k] = rightArray[j]
          j++
        }
        k++
      }
      
      while (i < leftArray.length) {
        arr[k] = leftArray[i]
        i++
        k++
      }
      
      while (j < rightArray.length) {
        arr[k] = rightArray[j]
        j++
        k++
      }
      
      // Show merged result
      steps.push(createStep(arr))
    }
    
    steps.push(createStep(arrayCopy)) // Initial state
    mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1)
    steps.push(createStep(arrayCopy, [], [], Array.from({ length: arrayCopy.length }, (_, i) => i))) // Final state
    
    return steps
  }

  // Quick Sort Algorithm
  const quickSort = (arr: ArrayBar[]) => {
    const steps: ArrayBar[][] = []
    const arrayCopy = [...arr]
    
    const quickSortHelper = (arr: ArrayBar[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high, steps)
        quickSortHelper(arr, low, pi - 1)
        quickSortHelper(arr, pi + 1, high)
      }
    }
    
    const partition = (arr: ArrayBar[], low: number, high: number, steps: ArrayBar[][]) => {
      const pivot = arr[high].value
      let i = low - 1
      
      for (let j = low; j < high; j++) {
        // Comparing with pivot
        steps.push(createStep(arr, [j, high]))
        
        if (arr[j].value < pivot) {
          i++
          // Swapping elements
          steps.push(createStep(arr, [], [i, j]))
          
          const temp = arr[i]
          arr[i] = arr[j]
          arr[j] = temp
          
          // After swap
          steps.push(createStep(arr))
        }
      }
      
      // Place pivot in correct position
      steps.push(createStep(arr, [], [i + 1, high]))
      
      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp
      
      // After pivot swap
      steps.push(createStep(arr))
      
      return i + 1
    }
    
    steps.push(createStep(arrayCopy)) // Initial state
    quickSortHelper(arrayCopy, 0, arrayCopy.length - 1)
    steps.push(createStep(arrayCopy, [], [], Array.from({ length: arrayCopy.length }, (_, i) => i))) // Final state
    
    return steps
  }

  // Selection Sort Algorithm
  const selectionSort = (arr: ArrayBar[]) => {
    const steps: ArrayBar[][] = []
    const arrayCopy = [...arr]
    
    steps.push(createStep(arrayCopy)) // Initial state
    
    for (let i = 0; i < arrayCopy.length; i++) {
      let minIndex = i
      
      for (let j = i + 1; j < arrayCopy.length; j++) {
        // Comparing elements
        steps.push(createStep(arrayCopy, [minIndex, j], [], Array.from({ length: i }, (_, k) => k)))
        
        if (arrayCopy[j].value < arrayCopy[minIndex].value) {
          minIndex = j
        }
      }
      
      if (minIndex !== i) {
        // Swapping elements
        steps.push(createStep(arrayCopy, [], [i, minIndex], Array.from({ length: i }, (_, k) => k)))
        
        const temp = arrayCopy[i]
        arrayCopy[i] = arrayCopy[minIndex]
        arrayCopy[minIndex] = temp
        
        // After swap
        steps.push(createStep(arrayCopy, [], [], Array.from({ length: i + 1 }, (_, k) => k)))
      } else {
        // Mark as sorted
        steps.push(createStep(arrayCopy, [], [], Array.from({ length: i + 1 }, (_, k) => k)))
      }
    }
    
    // Final sorted state
    steps.push(createStep(arrayCopy, [], [], Array.from({ length: arrayCopy.length }, (_, i) => i)))
    
    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (sortingSteps.length === 0) {
      let steps: ArrayBar[][] = []
      
      switch (algorithm) {
        case 'bubble':
          steps = bubbleSort(array)
          break
        case 'merge':
          steps = mergeSort(array)
          break
        case 'quick':
          steps = quickSort(array)
          break
        case 'selection':
          steps = selectionSort(array)
          break
        default:
          steps = bubbleSort(array)
      }
      
      setSortingSteps(steps)
    }
    setIsPlaying(true)
  }

  // Animation effect
  useEffect(() => {
    if (isPlaying && sortingSteps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= sortingSteps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          setArray(sortingSteps[prev + 1])
          return prev + 1
        })
      }, 101 - speed)

      return () => clearInterval(interval)
    }
  }, [isPlaying, sortingSteps, speed])

  // Initialize array on component mount
  useEffect(() => {
    generateArray()
  }, [generateArray])

  return (
    <div className="min-h-screen pt-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Sorting Algorithms
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize how different sorting algorithms work
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Controls */}
        <Card className="mb-8 p-6 glass-card">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={isPlaying ? () => setIsPlaying(false) : startSorting}
                className="bg-gradient-to-r from-primary to-secondary text-white"
                disabled={currentStep >= sortingSteps.length - 1 && sortingSteps.length > 0}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>

              <Button
                onClick={generateArray}
                variant="outline"
                disabled={isPlaying}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Speed:</label>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                max={100}
                min={1}
                step={1}
                className="w-24"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Size:</label>
              <Slider
                value={[arraySize]}
                onValueChange={(value) => setArraySize(value[0])}
                max={100}
                min={10}
                step={5}
                className="w-24"
                disabled={isPlaying}
              />
            </div>
          </div>
        </Card>

        {/* Visualization */}
        <Card className="p-6 glass-card">
          <div className="flex items-end justify-center gap-1 h-96 overflow-hidden">
            {array.map((bar, index) => (
              <motion.div
                key={bar.id}
                className={`
                  rounded-t-md transition-all duration-200
                  ${bar.isComparing ? 'bg-amber-500' : ''}
                  ${bar.isSwapping ? 'bg-red-500' : ''}
                  ${bar.isSorted ? 'bg-green-500' : 'bg-primary'}
                `}
                style={{
                  height: `${bar.value}px`,
                  width: `${Math.max(800 / arraySize - 1, 2)}px`
                }}
                animate={{
                  height: bar.value,
                  scale: bar.isSwapping ? 1.1 : 1
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </Card>

        {/* Algorithm Info */}
        <Card className="mt-8 p-6 glass-card">
          <h3 className="text-xl font-semibold gradient-text mb-4">
            {algorithm === 'bubble' && 'Bubble Sort'}
            {algorithm === 'quick' && 'Quick Sort'}
            {algorithm === 'merge' && 'Merge Sort'}
            {algorithm === 'selection' && 'Selection Sort'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-primary mb-2">Time Complexity</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bubble' && 'O(n²) average and worst case'}
                {algorithm === 'quick' && 'O(n log n) average, O(n²) worst'}
                {algorithm === 'merge' && 'O(n log n) all cases'}
                {algorithm === 'selection' && 'O(n²) all cases'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Space Complexity</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bubble' && 'O(1) - In place'}
                {algorithm === 'quick' && 'O(log n) - Recursive calls'}
                {algorithm === 'merge' && 'O(n) - Additional arrays'}
                {algorithm === 'selection' && 'O(1) - In place'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Stability</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bubble' && 'Stable'}
                {algorithm === 'quick' && 'Unstable'}
                {algorithm === 'merge' && 'Stable'}
                {algorithm === 'selection' && 'Unstable'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}