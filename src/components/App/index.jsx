import React from 'react'

import Cell from '../Cell'

const row = (j, size) => <div className="row" key={j}>{Array.from(new Array(size)).map((_, i) => <Cell x={i} y={j} size={size} key={i} />)}</div>

export default ({ size }) => (
  <div>
    {Array.from(new Array(size)).map((_, i) => row(i, size))}
  </div>
)
