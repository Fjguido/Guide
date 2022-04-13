import React, {Component} from 'react';
import './Node.css';

class Node extends Component {
    render() {
        const {
          col,
          isFinish,
          isStart,
          isWall,
          onMouseDown,
          onMouseEnter,
          onMouseUp,
          row,
        } = this.props;
        
        //used ternary to show which condition is true/false
        const extraClassName = isFinish ? 'node-finish' 
        : isStart ? 'node-start' 
        : isWall ? 'node-wall' 
        : '';

        return (
          <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>

         </div>
        );
      }
    }

export default Node;