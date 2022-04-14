import React from 'react'

// Returns visted nodes in order 
// Makes nodes go back to thier previous node to show shortest path by tracking back from the ending node


function bfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    let nextNodesStack = [startNode];
    // .length to return length of nodes to see how many were visited from start to end
    while (nextNodesStack.length) {
        // used .shift to remove and replace the visited node
        const currentNode = nextNodesStack.shift();
        if (currentNode === finishNode)
        return visitedNodesInOrder;

        
        if (
            !currentNode.isWall && (currentNode.isStart || !currentNode.isVisited)
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
            if (row < grid.length -1) {
                nextNode = grid[row +1][col];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = currentNode;
                    nextNodesStack.push(nextNode);
                }
            }
            if (col > 0) {
                nextNode = grid[row][col -1];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = currentNode;
                    nextNodesStack.push(nextNode);
                }
            }
            if (col < grid[0].length -1) {
                nextNode = grid[row][col +1];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = currentNode;
                    nextNodesStack.push(nextNode);
                }
            }

        }
    }
}

export default bfs;