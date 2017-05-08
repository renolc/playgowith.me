import React, { Component } from 'react'

import './style.css'

export default class extends Component {
  constructor(props) {
    super(props)
    
    const { col, row, size } = props
    this.cellType = (col === 0 && row === 0 && '#top-left') ||
                    (col === size - 1 && row === 0 && '#top-right') ||
                    (row === 0 && '#top') ||
                    (col === 0 && row === size - 1 && '#bottom-left') ||
                    (col === size - 1 && row === size - 1 && '#bottom-right') ||
                    (row === size - 1 && '#bottom') ||
                    (col === 0 && '#left') ||
                    (col === size - 1 && '#right') ||
                    '#inner'

    this.state = {
      hover: false
    }
  }

  render() {
    return (
      <div
        className="cell"
        onMouseEnter={_ => this.setState({ hover: true })}
        onMouseLeave={_ => this.setState({ hover: false })}
        onClick={this.props.onClick}>

        <svg><use xlinkHref={this.cellType}></use></svg>
        {this.props.value !== 'empty'
          ? <svg className="piece"><use xlinkHref={`#${this.props.value}`}></use></svg>
          : this.state.hover && <svg className="piece hover"><use xlinkHref={`#${this.props.turn}`}></use></svg>}
      </div>
    )
  }
}