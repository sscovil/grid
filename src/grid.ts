export interface GridCoords {
  x: number
  y: number
}

export default class Grid<T> {
  readonly rows: number
  readonly cols: number
  items: T[]

  constructor(rows: number, cols: number, items?: T[]) {
    this.rows = rows
    this.cols = cols
    this.items = new Array(rows * cols)

    if (items) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i] = items[i]
      }
    }
  }

  static isGridCoords(xy: number | GridCoords): xy is GridCoords {
    return (
      (xy as GridCoords).hasOwnProperty('x') &&
      (xy as GridCoords).hasOwnProperty('y')
    )
  }

  static isEqualCoords(xy: GridCoords, ab: GridCoords) {
    return (
      Grid.isGridCoords(xy) &&
      Grid.isGridCoords(ab) &&
      xy.x === ab.x &&
      xy.y === ab.y
    )
  }

  get size(): number {
    return this.items.length
  }

  coordsOf(item: T): GridCoords {
    const index = this.items.indexOf(item)

    if (index === -1) {
      return { x: -1, y: -1 }
    } else {
      return this.getCoords(index)
    }
  }

  get(index: number | GridCoords): T {
    if (Grid.isGridCoords(index)) {
      index = this.getIndex(index)
    }

    return this.items[index]
  }

  getAdjacent(index: number | GridCoords): T[] {
    const adjItems: T[] = []

    if (Grid.isGridCoords(index)) {
      index = this.getIndex(index)
    }

    for (const adjIndex of this.getAdjacentIndices(index)) {
      const adjItem = this.get(adjIndex)
      adjItems.push(adjItem)
    }

    return adjItems
  }

  getAdjacentCoords(xy: GridCoords): GridCoords[] {
    const adjXY: GridCoords[] = []

    if (!this.isValidCoords(xy)) {
      return adjXY
    }

    for (const b of [-1, 0, 1]) {
      for (const a of [-1, 0, 1]) {
        const ab = { x: xy.x + a, y: xy.y + b }
        if (this.isValidCoords(ab) && !Grid.isEqualCoords(xy, ab)) {
          adjXY.push(ab)
        }
      }
    }

    return adjXY
  }

  getAdjacentIndices(index: number): number[] {
    const adjIndices: number[] = []

    if (!this.isValidIndex(index)) {
      return adjIndices
    }

    const xy = this.getCoords(index)

    for (const ab of this.getAdjacentCoords(xy)) {
      adjIndices.push(this.getIndex(ab))
    }

    return adjIndices
  }

  getCoords(index: number): GridCoords {
    if (this.isValidIndex(index)) {
      const x = index % this.cols
      const y = Math.trunc(index / this.cols)
      return { x, y }
    }

    return { x: -1, y: -1 }
  }

  getIndex(xy: GridCoords): number {
    if (this.isValidCoords(xy)) {
      const { x, y } = xy
      return y * this.cols + x
    }

    return -1
  }

  indexOf(item: T) {
    return this.items.indexOf(item)
  }

  isValidCoords(xy: GridCoords): boolean {
    const { x, y } = xy
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows
  }

  isValidIndex(index: number): boolean {
    return 0 <= index && this.size > index
  }

  set(index: number | GridCoords, item: T): void {
    if (Grid.isGridCoords(index)) {
      index = this.getIndex(index)
    }

    this.items[index] = item
  }
}
