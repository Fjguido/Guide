
// you first explore all the nodes one step away, then all the nodes two steps away, etc.
// Breadth-first search is like throwing a stone in the center of a pond. 
// The nodes you explore "ripple out" from the starting point until it reaches the "ending" point.
// will find the shortest path between the starting point and any other reachable node.

export function bfs(grid, startNode, finishNode) {

   // initialize empty queue of nodes that will be visited
    const visitedNodesInOrder = [];
    // let the nextNode equal whereever the starting node is on the graph
    let nextNodesStack = [startNode];
    // while the next node is increased - the queue stores the node and marks it visited and repeats the process
    while (nextNodesStack.length) {
      const currentNode = nextNodesStack.shift();
      // it repeats the processs until it reaches the endpoint - and this will be used to display path 
      if (currentNode === finishNode) return visitedNodesInOrder;
      // if one of the statements are true - the currentNode is visited
      if (
        !currentNode.isWall &&
        (currentNode.isStart || !currentNode.isVisited)
      ) {
        currentNode.isVisited = true;
        // include the currentNode into the visited nodes at the end of the array
        visitedNodesInOrder.push(currentNode);
        // need col and row props for node 
        const {col, row} = currentNode;
        let nextNode;
        if (row > 0) {
          nextNode = grid[row-1][col];
          // if node is not visited - it will be added to the next queue of unvisited nodes
          if (!nextNode.isVisited) {
            nextNode.previousNode = currentNode;
            nextNodesStack.push(nextNode);
          }
        }
        // below if statement represent all possible directions and checks if all indexs are valid indexes in the grid - and the value is equal to the starting point
        // need both row and col not negative
        //row index is less than number of rows in grid 
        if (row < grid.length - 1) {
          nextNode = grid[row + 1][col];
          if (!nextNode.isVisited) {
            nextNode.previousNode = currentNode;
            nextNodesStack.push(nextNode);
          }
        }
        if (col > 0) {
          nextNode = grid[row][col - 1];
          if (!nextNode.isVisited) {
            nextNode.previousNode = currentNode;
            nextNodesStack.push(nextNode);
          }
        }
        // need column index less than number of cols in grid
        if (col < grid[0].length - 1) {
          nextNode = grid[row][col + 1];
          if (!nextNode.isVisited) {
            nextNode.previousNode = currentNode;
            nextNodesStack.push(nextNode);
          }
        }
      }
    }
  }
  
