import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

interface GridCell {
  row: number
  col: number
  isWall: boolean
  isStart: boolean
  isEnd: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousCell: GridCell | null
}

type Algorithm = 'dijkstra' | 'astar'

const GRID_ROWS = 20
const GRID_COLS = 50

export const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra')
  const [isRunning, setIsRunning] = useState(false)
  const [startCell, setStartCell] = useState<{ row: number; col: number }>({ row: 10, col: 5 })
  const [endCell, setEndCell] = useState<{ row: number; col: number }>({ row: 10, col: 45 })
  const [isDrawing, setIsDrawing] = useState(false)

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: GridCell[][] = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: GridCell[] = []
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          isWall: false,
          isStart: row === startCell.row && col === startCell.col,
          isEnd: row === endCell.row && col === endCell.col,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null
        })
      }
      newGrid.push(currentRow)
    }
    setGrid(newGrid)
  }, [startCell, endCell])

  // Clear visualization
  const clearVisualization = () => {
    setGrid(prev => 
      prev.map(row => 
        row.map(cell => ({
          ...cell,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null
        }))
      )
    )
  }

  // Clear walls
  const clearWalls = () => {
    setGrid(prev => 
      prev.map(row => 
        row.map(cell => ({
          ...cell,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null
        }))
      )
    )
  }

  // Handle mouse events for drawing walls
  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return
    setIsDrawing(true)
    toggleWall(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing || isRunning) return
    toggleWall(row, col)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const toggleWall = (row: number, col: number) => {
    if (grid[row][col].isStart || grid[row][col].isEnd) return
    
    setGrid(prev => 
      prev.map((gridRow, r) => 
        gridRow.map((cell, c) => 
          r === row && c === col 
            ? { ...cell, isWall: !cell.isWall, isVisited: false, isPath: false }
            : cell
        )
      )
    )
  }

  // Dijkstra's Algorithm
  const dijkstra = async (grid: GridCell[][], start: GridCell, end: GridCell) => {
    const visitedNodesInOrder: GridCell[] = []
    start.distance = 0
    const unvisitedNodes = getAllNodes(grid)
    
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes)
      const closestNode = unvisitedNodes.shift()!
      
      if (closestNode.isWall) continue
      if (closestNode.distance === Infinity) break
      
      closestNode.isVisited = true
      visitedNodesInOrder.push(closestNode)
      
      if (closestNode === end) break
      
      updateUnvisitedNeighbors(closestNode, grid)
    }
    
    return visitedNodesInOrder
  }

  const getAllNodes = (grid: GridCell[][]) => {
    const nodes: GridCell[] = []
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node)
      }
    }
    return nodes
  }

  const sortNodesByDistance = (unvisitedNodes: GridCell[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
  }

  const updateUnvisitedNeighbors = (node: GridCell, grid: GridCell[][]) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1
      neighbor.previousCell = node
    }
  }

  const getUnvisitedNeighbors = (node: GridCell, grid: GridCell[][]) => {
    const neighbors: GridCell[] = []
    const { col, row } = node
    
    if (row > 0) neighbors.push(grid[row - 1][col])
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if (col > 0) neighbors.push(grid[row][col - 1])
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
    
    return neighbors.filter(neighbor => !neighbor.isVisited)
  }

  const getNodesInShortestPathOrder = (finishNode: GridCell) => {
    const nodesInShortestPathOrder: GridCell[] = []
    let currentNode: GridCell | null = finishNode
    
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousCell
    }
    
    return nodesInShortestPathOrder
  }

  // Animate algorithm
  const visualizeAlgorithm = async () => {
    setIsRunning(true)
    clearVisualization()
    
    const startNode = grid[startCell.row][startCell.col]
    const finishNode = grid[endCell.row][endCell.col]
    
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)
    
    // Animate visited nodes
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        // Animate shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[j]
            setGrid(prev => 
              prev.map((row, r) => 
                row.map((cell, c) => 
                  r === node.row && c === node.col 
                    ? { ...cell, isPath: true }
                    : cell
                )
              )
            )
          }, 50 * j)
        }
        setTimeout(() => setIsRunning(false), 50 * nodesInShortestPathOrder.length)
        return
      }
      
      setTimeout(() => {
        const node = visitedNodesInOrder[i]
        setGrid(prev => 
          prev.map((row, r) => 
            row.map((cell, c) => 
              r === node.row && c === node.col 
                ? { ...cell, isVisited: true }
                : cell
            )
          )
        )
      }, 10 * i)
    }
  }

  // Initialize grid on mount
  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

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
              Pathfinding Algorithms
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize how pathfinding algorithms find the shortest path
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Controls */}
        <Card className="mb-8 p-6 glass-card">
          <div className="flex flex-wrap items-center gap-6">
            <Button
              onClick={visualizeAlgorithm}
              className="bg-gradient-to-r from-primary to-secondary text-white"
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              Visualize {algorithm === 'dijkstra' ? "Dijkstra's" : "A*"}
            </Button>

            <Button
              onClick={clearVisualization}
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Path
            </Button>

            <Button
              onClick={clearWalls}
              variant="outline"
              disabled={isRunning}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Walls
            </Button>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                  <SelectItem value="astar">A* Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Legend */}
        <Card className="mb-6 p-4 glass-card">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-foreground rounded"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 rounded"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-violet-500 rounded"></div>
              <span>Shortest Path</span>
            </div>
            <span className="text-muted-foreground">Click and drag to draw walls</span>
          </div>
        </Card>

        {/* Grid */}
        <Card className="p-6 glass-card">
          <div 
            className="grid gap-[1px] mx-auto w-fit"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    cursor-pointer relative
                    ${cell.isWall ? 'grid-cell wall' : 'grid-cell'}
                    ${cell.isStart ? 'start' : ''}
                    ${cell.isEnd ? 'end' : ''}
                    ${cell.isVisited ? 'visited' : ''}
                    ${cell.isPath ? 'path' : ''}
                  `}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  style={{ width: '15px', height: '15px' }}
                />
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}