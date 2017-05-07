import React, { Component } from 'react'

import './style.css'

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      piece: false,
      hover: false
    }
    
    const { x, y, size } = props
    this.cellType = (x === 0 && y === 0 && '#top-left') ||
                    (x === size - 1 && y === 0 && '#top-right') ||
                    (y === 0 && '#top') ||
                    (x === 0 && y === size - 1 && '#bottom-left') ||
                    (x === size - 1 && y === size - 1 && '#bottom-right') ||
                    (y === size - 1 && '#bottom') ||
                    (x === 0 && '#left') ||
                    (x === size - 1 && '#right') ||
                    '#inner'
  }

  render() {
    return (
      <div
        className="cell"
        onMouseEnter={_ => this.setState({ hover: true })}
        onMouseLeave={_ => this.setState({ hover: false })}
        onClick={_ => this.setState({ piece: true })}>

        <svg><use xlinkHref={this.cellType}></use></svg>
        {this.state.piece
          ? <svg className="piece"><use xlinkHref='#white'></use></svg>
          : this.state.hover && <svg className="piece hover"><use xlinkHref='#white'></use></svg>}
      </div>
    )
  }
}