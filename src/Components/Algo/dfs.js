// The algorithm starts at the root "starting" node
// and explores as far as possible along each branch until it 
// reaches the endpoint before backtracking.
// So the basic idea is to start from the root or
// any "starting" node and mark the node and move to the adjacent
// unmarked node and continue this loop until there is no unmarked
// adjacent node. Then backtrack and check for other unmarked nodes and traverse them. 
// Finally, show the nodes of the path from the starting point to the ending point.

export function dfs(grid, startNode, finishNode) {
    //begin with empty array - to start a queue of nodes that would be visited
    const visitedNodesInOrder = [];
    const nextNodesStack = [];
    // .push to add node in end of array
    nextNodesStack.push(startNode);
    while (nextNodesStack.length) {
        // while added new length - want to take out previous node to get the current node
        const currentNode = nextNodesStack.pop();
        // if currentNode is at the ending point return all nodes visited to show path
        if (currentNode === finishNode) {
            return visitedNodesInOrder;
        }

        if (
            !currentNode.isWall && (currentNode.isStart || !currentNode.isVisited)
        ) {
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);

            const {col, row} = currentNode;
            let nextNode;
            if (row > 0) {
                nextNode = grid[row -1][col];
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