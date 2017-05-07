import React, { Component } from 'react'

import './style.css'

export default class extends Component {
  constructor(props) {
    super(props)
    
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

  onMouseEnter() {
    this.div.classList.add('red')
  }

  onMouseLeave() {
    this.div.classList.remove('red')
  }

  render() {
    return (
      <div
        className="cell"
        ref={(el) => this.div = el}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}>

        <svg><use xlinkHref={this.cellType}></use></svg>
      </div>
    )
  }
}