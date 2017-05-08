import React, { Component } from 'react'
import GoSim from 'go-sim'

import Cell from './Cell'

import './style.css'

export default class extends Component {
  constructor(props) {
    super(props)

    const { size } = props
    this.range = Array.apply(null, Array(size))

    this.sim = new GoSim(size)
    this.state = this.sim.serialize()
  }

  row(r) {
    return (
      <div className="row" key={r}>
        {this.range.map((_, c) => <Cell
                                    key={c+','+r}
                                    size={this.sim.board.size}
                                    turn={this.sim.turn}
                                    onClick={_ => this.play(r, c)}
                                    {...this.sim.board.at(r, c)} />)}
      </div>
    )
  }

  play(row, col) {
    this.sim.play(row, col)
    this.setState(this.sim.serialize())
  }

  render() {
    return (
      <div>
        {this.range.map((_, r) => this.row(r))}
      </div>
    )
  }
}