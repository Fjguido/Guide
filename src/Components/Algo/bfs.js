
// you first explore all the nodes one step away, then all the nodes two steps away, etc.
// Breadth-first search is like throwing a stone in the center of a pond. 
// The nodes you explore "ripple out" from the starting point until it reaches the "ending" point.
// will find the shortest path between the starting point and any other reachable node.

export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    let nextNodesStack = [startNode];
    while (nextNodesStack.length) {
      const currentNode = nextNodesStack.shift();
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      if (
        !currentNode.isWall &&
        (currentNode.isStart || !currentNode.isVisited)
      ) {
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        const {col, row} = currentNode;
        let nextNode;
        if (row > 0) {
          nextNode = grid[row - 1][col];
          if (!nextNode.isVisited) {
            nextNode.previousNode = currentNode;
            nextNodesStack.push(nextNode);
          }
        }
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
  
