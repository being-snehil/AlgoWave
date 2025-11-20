import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Plus, Minus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

interface GraphNode {
  id: number
  x: number
  y: number
  label: string
  isVisited?: boolean
  isActive?: boolean
  distance?: number
  parent?: GraphNode | null
}

interface GraphEdge {
  from: number
  to: number
  weight: number
  isActive?: boolean
  isMST?: boolean
}

type Algorithm = 'bfs' | 'dfs' | 'mst'

export const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs')
  const [isRunning, setIsRunning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [startNode, setStartNode] = useState<number | null>(null)
  const [animationSteps, setAnimationSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  // Initialize with sample graph
  const initializeGraph = useCallback(() => {
    const sampleNodes: GraphNode[] = [
      { id: 1, x: 200, y: 150, label: 'A' },
      { id: 2, x: 400, y: 100, label: 'B' },
      { id: 3, x: 600, y: 150, label: 'C' },
      { id: 4, x: 300, y: 300, label: 'D' },
      { id: 5, x: 500, y: 350, label: 'E' },
      { id: 6, x: 700, y: 300, label: 'F' }
    ]
    
    const sampleEdges: GraphEdge[] = [
      { from: 1, to: 2, weight: 4 },
      { from: 1, to: 4, weight: 3 },
      { from: 2, to: 3, weight: 2 },
      { from: 2, to: 5, weight: 5 },
      { from: 3, to: 6, weight: 1 },
      { from: 4, to: 5, weight: 6 },
      { from: 5, to: 6, weight: 3 }
    ]
    
    setNodes(sampleNodes)
    setEdges(sampleEdges)
    setStartNode(1)
    resetVisualization()
  }, [])

  // Reset visualization state
  const resetVisualization = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      isVisited: false,
      isActive: false,
      distance: undefined,
      parent: null
    })))
    setEdges(prev => prev.map(edge => ({
      ...edge,
      isActive: false,
      isMST: false
    })))
    setAnimationSteps([])
    setCurrentStep(0)
    setIsRunning(false)
  }

  // Add new node
  const addNode = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRunning || isConnecting) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newNode: GraphNode = {
      id: Math.max(...nodes.map(n => n.id), 0) + 1,
      x,
      y,
      label: String.fromCharCode(65 + nodes.length) // A, B, C, etc.
    }
    
    setNodes(prev => [...prev, newNode])
  }

  // Handle node click
  const handleNodeClick = (nodeId: number) => {
    if (isRunning) return
    
    if (isConnecting) {
      if (selectedNode && selectedNode !== nodeId) {
        // Create edge
        const newEdge: GraphEdge = {
          from: selectedNode,
          to: nodeId,
          weight: Math.floor(Math.random() * 9) + 1
        }
        setEdges(prev => [...prev, newEdge])
        setSelectedNode(null)
        setIsConnecting(false)
      } else {
        setSelectedNode(nodeId)
      }
    } else {
      setStartNode(nodeId)
    }
  }

  // BFS Algorithm
  const bfs = (startNodeId: number) => {
    const steps: any[] = []
    const visited = new Set<number>()
    const queue: number[] = [startNodeId]
    
    while (queue.length > 0) {
      const currentId = queue.shift()!
      
      if (visited.has(currentId)) continue
      
      visited.add(currentId)
      steps.push({
        type: 'visit_node',
        nodeId: currentId,
        visited: new Set(visited)
      })
      
      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === currentId || edge.to === currentId)
        .map(edge => edge.from === currentId ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId))
      
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          queue.push(neighborId)
          steps.push({
            type: 'activate_edge',
            from: currentId,
            to: neighborId
          })
        }
      }
    }
    
    return steps
  }

  // DFS Algorithm
  const dfs = (startNodeId: number) => {
    const steps: any[] = []
    const visited = new Set<number>()
    
    const dfsRecursive = (nodeId: number) => {
      visited.add(nodeId)
      steps.push({
        type: 'visit_node',
        nodeId: nodeId,
        visited: new Set(visited)
      })
      
      const neighbors = edges
        .filter(edge => edge.from === nodeId || edge.to === nodeId)
        .map(edge => edge.from === nodeId ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId))
      
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          steps.push({
            type: 'activate_edge',
            from: nodeId,
            to: neighborId
          })
          dfsRecursive(neighborId)
        }
      }
    }
    
    dfsRecursive(startNodeId)
    return steps
  }

  // Kruskal's MST Algorithm
  const kruskalMST = () => {
    const steps: any[] = []
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)
    const parent: { [key: number]: number } = {}
    const rank: { [key: number]: number } = {}
    const mstEdges: GraphEdge[] = []
    
    // Initialize disjoint set
    nodes.forEach(node => {
      parent[node.id] = node.id
      rank[node.id] = 0
    })
    
    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x])
      }
      return parent[x]
    }
    
    const union = (x: number, y: number) => {
      const rootX = find(x)
      const rootY = find(y)
      
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX
      } else {
        parent[rootY] = rootX
        rank[rootX]++
      }
    }
    
    for (const edge of sortedEdges) {
      const rootFrom = find(edge.from)
      const rootTo = find(edge.to)
      
      steps.push({
        type: 'consider_edge',
        edge: edge
      })
      
      if (rootFrom !== rootTo) {
        union(edge.from, edge.to)
        mstEdges.push(edge)
        steps.push({
          type: 'add_to_mst',
          edge: edge,
          mstEdges: [...mstEdges]
        })
      } else {
        steps.push({
          type: 'reject_edge',
          edge: edge
        })
      }
    }
    
    return steps
  }

  // Start algorithm
  const startAlgorithm = () => {
    if (!startNode && algorithm !== 'mst') return
    
    resetVisualization()
    let steps: any[] = []
    
    switch (algorithm) {
      case 'bfs':
        steps = bfs(startNode!)
        break
      case 'dfs':
        steps = dfs(startNode!)
        break
      case 'mst':
        steps = kruskalMST()
        break
    }
    
    setAnimationSteps(steps)
    setIsRunning(true)
  }

  // Animation effect
  useEffect(() => {
    if (isRunning && animationSteps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= animationSteps.length - 1) {
            setIsRunning(false)
            return prev
          }
          
          const step = animationSteps[prev + 1]
          
          switch (step.type) {
            case 'visit_node':
              setNodes(nodesPrev => nodesPrev.map(node => ({
                ...node,
                isVisited: step.visited.has(node.id),
                isActive: node.id === step.nodeId
              })))
              break
            case 'activate_edge':
              setEdges(edgesPrev => edgesPrev.map(edge => ({
                ...edge,
                isActive: (edge.from === step.from && edge.to === step.to) ||
                         (edge.from === step.to && edge.to === step.from)
              })))
              break
            case 'add_to_mst':
              setEdges(edgesPrev => edgesPrev.map(edge => ({
                ...edge,
                isMST: step.mstEdges.some((mstEdge: GraphEdge) => 
                  (edge.from === mstEdge.from && edge.to === mstEdge.to) ||
                  (edge.from === mstEdge.to && edge.to === mstEdge.from)
                )
              })))
              break
          }
          
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning, animationSteps])

  // Initialize on mount
  useEffect(() => {
    initializeGraph()
  }, [initializeGraph])

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
              Graph Algorithms
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore graph traversal and minimum spanning tree algorithms
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Controls */}
        <Card className="mb-8 p-6 glass-card">
          <div className="flex flex-wrap items-center gap-6">
            <Button
              onClick={startAlgorithm}
              className="bg-gradient-to-r from-primary to-secondary text-white"
              disabled={isRunning || (!startNode && algorithm !== 'mst')}
            >
              <Play className="w-4 h-4 mr-2" />
              Start {algorithm.toUpperCase()}
            </Button>

            <Button
              onClick={resetVisualization}
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              onClick={() => setIsConnecting(!isConnecting)}
              variant={isConnecting ? "default" : "outline"}
              disabled={isRunning}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isConnecting ? 'Cancel Connection' : 'Add Edge'}
            </Button>

            <Button
              onClick={initializeGraph}
              variant="outline"
              disabled={isRunning}
            >
              <Minus className="w-4 h-4 mr-2" />
              Reset Graph
            </Button>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">Breadth-First Search</SelectItem>
                  <SelectItem value="dfs">Depth-First Search</SelectItem>
                  <SelectItem value="mst">Minimum Spanning Tree</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mb-6 p-4 glass-card">
          <div className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> 
            {algorithm !== 'mst' && " Click a node to set it as start point."}
            {isConnecting && " Click two nodes to connect them."}
            {!isConnecting && !isRunning && " Click empty space to add new nodes."}
            {algorithm === 'mst' && " MST finds the minimum spanning tree of the entire graph."}
          </div>
        </Card>

        {/* Graph Visualization */}
        <Card className="p-6 glass-card">
          <div 
            className="relative w-full h-96 bg-muted/10 rounded-lg overflow-hidden cursor-crosshair"
            onClick={addNode}
          >
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from)
                const toNode = nodes.find(n => n.id === edge.to)
                if (!fromNode || !toNode) return null
                
                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={edge.isMST ? '#10b981' : edge.isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                      strokeWidth={edge.isMST ? 3 : edge.isActive ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 10}
                      fill="hsl(var(--foreground))"
                      fontSize="12"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  className={`
                    absolute w-12 h-12 rounded-full flex items-center justify-center font-semibold cursor-pointer
                    transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                    ${node.id === startNode ? 'bg-green-500 text-white shadow-lg' : ''}
                    ${node.isActive ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                    ${node.isVisited && !node.isActive ? 'bg-primary/50 text-white' : ''}
                    ${!node.isVisited && !node.isActive && node.id !== startNode ? 'bg-muted text-muted-foreground' : ''}
                    ${node.id === selectedNode ? 'ring-2 ring-primary' : ''}
                  `}
                  style={{
                    left: node.x,
                    top: node.y
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNodeClick(node.id)
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {node.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {/* Algorithm Info */}
        <Card className="mt-8 p-6 glass-card">
          <h3 className="text-xl font-semibold gradient-text mb-4">
            {algorithm === 'bfs' && 'Breadth-First Search (BFS)'}
            {algorithm === 'dfs' && 'Depth-First Search (DFS)'}
            {algorithm === 'mst' && 'Minimum Spanning Tree (Kruskal\'s Algorithm)'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-primary mb-2">Time Complexity</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bfs' && 'O(V + E) where V = vertices, E = edges'}
                {algorithm === 'dfs' && 'O(V + E) where V = vertices, E = edges'}
                {algorithm === 'mst' && 'O(E log E) for sorting edges'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Space Complexity</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bfs' && 'O(V) for the queue'}
                {algorithm === 'dfs' && 'O(V) for the call stack'}
                {algorithm === 'mst' && 'O(V) for the disjoint set'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Use Cases</h4>
              <p className="text-muted-foreground">
                {algorithm === 'bfs' && 'Shortest path, level traversal'}
                {algorithm === 'dfs' && 'Topological sort, cycle detection'}
                {algorithm === 'mst' && 'Network design, clustering'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}