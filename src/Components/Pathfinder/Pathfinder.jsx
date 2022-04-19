import React, {Component} from 'react';
import Node from './Node/Node';
import {bfs} from '../Algo/bfs';
import {dfs} from '../Algo/dfs';
import './Pathfinder.scss';
class Pathfinder extends Component {

  constructor() {
    // used super to access and call functions on an object's parent
    super();
    this.state = {
      grid: [],
      //position of starting/ending points
      START_NODE_ROW: 5,
      FINISH_NODE_ROW: 5,
      START_NODE_COL: 11,
      // START_NODE_COL: 23,
      FINISH_NODE_COL: 38,
      // FINISH_NODE_COL: 57,
      //---------------------
      mouseIsPressed: false,
      ROW_COUNT: 20,
      COLUMN_COUNT: 50,
      // ROW_COUNT: 30,
      // COLUMN_COUNT: 80,
      // false for initial grid - start off empty
      isRunning: false,
      isStartNode: false,
      isFinishNode: false,
      isWallNode: false,
      //-----------------------
      currRow: 0,
      currCol: 0,
    };
    
    // main three mouse movements 
    // need to use .bind to make 'this' work when calling back
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.toggleIsRunning = this.toggleIsRunning.bind(this);
    //---------------------------------------------------
  }

 
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({grid});
  }
  
//toggle isRunning to be true/false
  toggleIsRunning() {
    this.setState({isRunning: !this.state.isRunning});
  }

 // grid setup - by using state properties
 getInitialGrid = (
  rowCount = this.state.ROW_COUNT,
  colCount = this.state.COLUMN_COUNT,
) => {
  const initialGrid = [];
  // for loop to repeat rows/columns
  for (let row = 0; row < rowCount; row++) {
    const currentRow = [];
    for (let col = 0; col < colCount; col++) {
      currentRow.push(this.createNode(row, col));
    }
    initialGrid.push(currentRow);
  }
  // shows grid
  return initialGrid;
};


  //setting up starting/ending point "node"
  createNode = (row, col) => {
    return {
      row,
      col,
      // this sets up the position of the starting/ending node based on the state
      isStart:
        row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish:
        row === this.state.FINISH_NODE_ROW &&
        col === this.state.FINISH_NODE_COL,
      //---------------------------------------------------------------------------
      // used math.abs for no negative numbers
      distanceToFinishNode:
        Math.abs(this.state.FINISH_NODE_ROW - row) +
        Math.abs(this.state.FINISH_NODE_COL - col),
      //----------------------------------------------

      // ------------- makes sure wall is not being used initially 
      isVisited: false,
      isWall: false,
      // -------------
      // true to be mark 
      previousNode: null,
      isNode: true,
    };
  };


//holding clicked mouse/clicked mouse on grid - will let walls appear 
handleMouseDown(row, col) {
  if (!this.state.isRunning) {
    if (this.isGridClear()) {
      if (
          // created Id in Node component in Node.jsx - made it equal to className in Node.css
        document.getElementById(`node-${row}-${col}`).className ===
        'node node-start'
      ) {
          //setState to let updates appear 
        this.setState({
          mouseIsPressed: true,
          isStartNode: true,
          currRow: row,
          currCol: col,
        });
      } else if (
        document.getElementById(`node-${row}-${col}`).className ===
        'node node-finish'
      ) {
        this.setState({
          mouseIsPressed: true,
          isFinishNode: true,
          currRow: row,
          currCol: col,
        });
      } else {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({
          grid: newGrid,
          // true so you can press and drag to create walls
          mouseIsPressed: true,
          isWallNode: true,
          currRow: row,
          currCol: col,
        });
        //----------------------------------------------------------------------
      }
    } else {
      this.clearGrid();
    }
  }
}

// clearing grid of visited nodes
isGridClear() {
  for (const row of this.state.grid) {
    for (const node of row) {
      const nodeClassName = document.getElementById(
        `node-${node.row}-${node.col}`,
      ).className;
      if ( nodeClassName === 'node node-visited' || nodeClassName === 'node node-shortest-path') 
      { return false;
      }
    }
  }
  return true;
}
handleMouseEnter(row, col) {
  if (!this.state.isRunning) {
    if (this.state.mouseIsPressed) {
      const nodeClassName = document.getElementById(`node-${row}-${col}`)
        .className;
          
      if (this.state.isStartNode) {
          // lets start node not be put in a wall node -> !==
        if (nodeClassName !== 'node node-wall') {
          const prevStartNode = this.state.grid[this.state.currRow][
            this.state.currCol
          ];
          prevStartNode.isStart = false;
          //-----------------------------------------
          document.getElementById(
            `node-${this.state.currRow}-${this.state.currCol}`,
          ).className = 'node';
            // setState to keep updated changes - sets up new starting position
          this.setState({currRow: row, currCol: col});
          const currStartNode = this.state.grid[row][col];
          currStartNode.isStart = true;
          document.getElementById(`node-${row}-${col}`).className =
            'node node-start';
        }
        this.setState({START_NODE_ROW: row, START_NODE_COL: col});
        //-------------------------------------
      }
          
       else if (this.state.isFinishNode) {
           // lets end node not be put in a wall node -> !==
        if (nodeClassName !== 'node node-wall') {
          const prevFinishNode = this.state.grid[this.state.currRow][
            this.state.currCol
          ];
          prevFinishNode.isFinish = false;
          //-----------------------------------------
          document.getElementById(
            `node-${this.state.currRow}-${this.state.currCol}`,
          ).className = 'node';
            // setState to keep updated changes - sets up new ending position
          this.setState({currRow: row, currCol: col});
          const currFinishNode = this.state.grid[row][col];
          currFinishNode.isFinish = true;
          document.getElementById(`node-${row}-${col}`).className =
            'node node-finish';
        }
        this.setState({FINISH_NODE_ROW: row, FINISH_NODE_COL: col});
            //-------------------------------------
      } else if (this.state.isWallNode) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
      }
    }
  }
}


  //To stop making walls when you let go of mouse - lets you click to make new wall
  handleMouseUp(row, col) {
    if (!this.state.isRunning) {
      this.setState({mouseIsPressed: false});
      if (this.state.isStartNode) {
        const isStartNode = !this.state.isStartNode;
        this.setState({isStartNode, START_NODE_ROW: row, START_NODE_COL: col});
      } else if (this.state.isFinishNode) {
        const isFinishNode = !this.state.isFinishNode;
        this.setState({
          isFinishNode,
          FINISH_NODE_ROW: row,
          FINISH_NODE_COL: col,
        });
      }
      this.getInitialGrid();
    }
  }

  handleMouseLeave() {
    if (this.state.isStartNode) {
      const isStartNode = !this.state.isStartNode;
      // keeps start node at spot where you moved it 
      this.setState({isStartNode, mouseIsPressed: false});
    } else if (this.state.isFinishNode) {
      const isFinishNode = !this.state.isFinishNode;
      this.setState({isFinishNode, mouseIsPressed: false});
    } else if (this.state.isWallNode) {
      const isWallNode = !this.state.isWallNode;
      this.setState({isWallNode, mouseIsPressed: false});
      this.getInitialGrid();
    }
  }

// clearing grid animations - not walls
clearGrid() {
  if (!this.state.isRunning) {
    const newGrid = this.state.grid.slice();
    for (const row of newGrid) {
      for (const node of row) {
      // used getElementById to get className to target animation 
        let nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName !== 'node node-start' &&
          nodeClassName !== 'node node-finish' &&
          nodeClassName !== 'node node-wall'
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node';
          node.isVisited = false;
          node.distanceToFinishNode =
            Math.abs(this.state.FINISH_NODE_ROW - node.row) +
            Math.abs(this.state.FINISH_NODE_COL - node.col);
        }
        if (nodeClassName === 'node node-finish') {
          node.isVisited = false;
          node.distanceToFinishNode = 0;
        }
        if (nodeClassName === 'node node-start') {
          node.isVisited = false;
          node.distanceToFinishNode =
            Math.abs(this.state.FINISH_NODE_ROW - node.row) +
            Math.abs(this.state.FINISH_NODE_COL - node.col);
          node.isStart = true;
          node.isWall = false;
          node.previousNode = null;
          node.isNode = true;
        }
      }
    }
  }
}

// clear created walls
clearWalls() {
  if (!this.state.isRunning) {
    const newGrid = this.state.grid.slice();
    // 
    for (const row of newGrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (nodeClassName === 'node node-wall') {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node';
          node.isWall = false;
        }
      }
    }
  }
}

  // add visualization
  visualize(algo) {
    if (!this.state.isRunning) {
      this.clearGrid();
      this.toggleIsRunning();
      const {grid} = this.state;
      const startNode =
        grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
      const finishNode =
        grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
      let visitedNodesInOrder;
      switch (algo) {
        case 'BFS':
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case 'DFS':
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          break;
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      nodesInShortestPathOrder.push('end');
      this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        //used setTimout to show animation of shortestpath 10 seconds later
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      // animation of visited nodes - used setTimeout again to show animation
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        // used getElementById to get className to show animation 
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName !== 'node node-start' &&
          nodeClassName !== 'node node-finish'
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  // path from starting point to ending point
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === 'end') {
        setTimeout(() => {
          this.toggleIsRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-finish'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }
        }, i * 40);
      }
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <div>
        
              <div className="title">
            <b>Guide</b>
            </div>
          
        <table
          className="grid-container"
          onMouseLeave={() => this.handleMouseLeave()}>
          <tbody className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <tr key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp(row, col)}
                        row={row}>     
                    </Node>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.clearGrid()}>
          Clear Grid
        </button>
       
        <button
          type="button"
          className="clearWall"
          onClick={() => this.clearWalls()}>
          Clear Walls
        </button>
       
        <button
          type="button"
          className="bfsBtn"
          onClick={() => this.visualize('BFS')}>
          Breadth First Search
        </button>
        <button
          type="button"
          className="dfsBtn"
          onClick={() => this.visualize('DFS')}>
          Depth First Search
        </button>
      </div>
    );
  }
}

// creating new grid with created walls
const getNewGridWithWallToggled = (grid, row, col) => {
  // used slice b/c returns new array containing a copy of original array
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish && node.isNode) {
    const newNode = {...node, isWall: !node.isWall};
    newGrid[row][col] = newNode;
  }
  return newGrid;
};


// Backtracks from the finishNode to find the shortest path.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export default Pathfinder;