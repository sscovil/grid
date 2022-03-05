import Grid from '../src/grid'

describe('Grid', () => {
  describe('constructor', () => {
    test('requires rows and cols arguments', () => {
      const rows = 4
      const cols = 3
      const grid = new Grid(rows, cols)

      expect(grid instanceof Grid).toBe(true)
    })

    test('throws a RangeError if either or both required arguments are omitted', () => {
      // @ts-ignore
      expect(() => new Grid()).toThrow(RangeError)
      // @ts-ignore
      expect(() => new Grid(4)).toThrow(RangeError)
    })

    test('accepts an array of items as an optional third argument', () => {
      const rows = 4
      const cols = 3
      const items: number[] = new Array(rows * cols)
      for (let i = 0; i < items.length; i++) {
        items[i] = i
      }
      const grid = new Grid<number>(rows, cols, items)

      expect(grid.items).toEqual(items)
    })

    test('truncates a given items array if it is too large', () => {
      const rows = 4
      const cols = 3
      const items: number[] = new Array(rows * cols + 1)
      for (let i = 0; i < items.length; i++) {
        items[i] = i
      }
      const grid = new Grid<number>(rows, cols, items)

      expect(grid.items.length).toBe(items.length - 1)
      expect(grid.items).not.toContain(items.at(-1))
      expect(grid.items).toEqual(items.filter((item) => item < rows * cols))
    })
  })

  describe('properties', () => {
    describe('Grid.prototype.rows', () => {
      test('equals the value of the first argument passed to the constructor', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)
        expect(grid.rows).toBe(rows)
      })
    })

    describe('Grid.prototype.cols', () => {
      test('equals the value of the second argument passed to the constructor', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)
        expect(grid.cols).toBe(cols)
      })
    })

    describe('Grid.prototype.size', () => {
      test('equals Grid.prototype.rows * Grid.prototype.cols', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)
        expect(grid.size).toBe(rows * cols)
      })
    })
  })

  describe('methods', () => {
    describe('Grid.prototype.coordsOf()', () => {
      test('returns the coordinate of a given item if found', () => {
        const rows = 4
        const cols = 3
        const items: number[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = i
        }
        const grid = new Grid<number>(rows, cols, items)

        expect(grid.coordsOf(4)).toEqual({ x: 1, y: 1 })
      })

      test('returns -1 x and y values if item is not found', () => {
        const rows = 4
        const cols = 3
        const items: number[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = i
        }
        const grid = new Grid<number>(rows, cols, items)

        expect(grid.coordsOf(40)).toEqual({ x: -1, y: -1 })
      })
    })

    describe('Grid.prototype.get()', () => {
      test('returns the value at a given coordinate', () => {
        const rows = 4
        const cols = 3
        const items: string[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = String.fromCharCode(65 + i)
        }
        const grid = new Grid<string>(rows, cols, items)

        expect(grid.get({ x: 0, y: 0 })).toBe('A')
        expect(grid.get({ x: 1, y: 0 })).toBe('B')
        expect(grid.get({ x: 1, y: 1 })).toBe('E')
        expect(grid.get({ x: 2, y: 3 })).toBe('L')
      })

      test('returns the value at a given index', () => {
        const rows = 4
        const cols = 3
        const items: string[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = String.fromCharCode(65 + i)
        }
        const grid = new Grid<string>(rows, cols, items)

        expect(grid.get(0)).toBe('A')
        expect(grid.get(1)).toBe('B')
        expect(grid.get(4)).toBe('E')
        expect(grid.get(11)).toBe('L')
      })
    })

    describe('Grid.prototype.getAdjacent()', () => {
      test('returns an array of all values adjacent to a given index', () => {
        const rows = 4
        const cols = 3
        const items: string[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = String.fromCharCode(65 + i)
        }
        const grid = new Grid<string>(rows, cols, items)

        expect(grid.getAdjacent(0)).toEqual(['B', 'D', 'E'])
        expect(grid.getAdjacent(1)).toEqual(['A', 'C', 'D', 'E', 'F'])
        expect(grid.getAdjacent(4)).toEqual([
          'A',
          'B',
          'C',
          'D',
          'F',
          'G',
          'H',
          'I',
        ])
        expect(grid.getAdjacent(11)).toEqual(['H', 'I', 'K'])
      })

      test('returns an empty array if given index is out of range', () => {
        const rows = 4
        const cols = 3
        const items: number[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = i
        }
        const grid = new Grid<number>(rows, cols, items)

        expect(grid.getAdjacent(100)).toEqual([])
      })
    })

    describe('Grid.prototype.getAdjacentCoords()', () => {
      test('returns an array of all coordinates adjacent to a given coordinate', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getAdjacentCoords({ x: 0, y: 0 })).toEqual([
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ])
        expect(grid.getAdjacentCoords({ x: 1, y: 0 })).toEqual([
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ])
        expect(grid.getAdjacentCoords({ x: 1, y: 1 })).toEqual([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ])
        expect(grid.getAdjacentCoords({ x: 2, y: 3 })).toEqual([
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 3 },
        ])
      })

      test('returns an empty array if coordinate is out of range', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getAdjacentCoords({ x: 10, y: 10 })).toEqual([])
      })
    })

    describe('Grid.prototype.getAdjacentIndices()', () => {
      test('returns an array of all indices adjacent to a given index', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getAdjacentIndices(0)).toEqual([1, 3, 4])
        expect(grid.getAdjacentIndices(1)).toEqual([0, 2, 3, 4, 5])
        expect(grid.getAdjacentIndices(4)).toEqual([0, 1, 2, 3, 5, 6, 7, 8])
        expect(grid.getAdjacentIndices(11)).toEqual([7, 8, 10])
      })

      test('returns an empty array if index is out of range', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getAdjacentIndices(100)).toEqual([])
      })
    })

    describe('Grid.prototype.getCoords()', () => {
      test('returns coordinate for a given index', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getCoords(0)).toEqual({ x: 0, y: 0 })
        expect(grid.getCoords(1)).toEqual({ x: 1, y: 0 })
        expect(grid.getCoords(4)).toEqual({ x: 1, y: 1 })
        expect(grid.getCoords(11)).toEqual({ x: 2, y: 3 })
      })

      test('returns -1 x and y values if index is out of range', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getCoords(100)).toEqual({ x: -1, y: -1 })
      })
    })

    describe('Grid.prototype.getIndex()', () => {
      test('returns index for a given coordinate', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getIndex({ x: 0, y: 0 })).toEqual(0)
        expect(grid.getIndex({ x: 1, y: 0 })).toEqual(1)
        expect(grid.getIndex({ x: 1, y: 1 })).toEqual(4)
        expect(grid.getIndex({ x: 2, y: 3 })).toEqual(11)
      })

      test('returns -1 if coordinate is out of range', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.getIndex({ x: 10, y: 10 })).toEqual(-1)
      })
    })

    describe('Grid.prototype.indexOf()', () => {
      test('returns the index of a given item if found', () => {
        const rows = 4
        const cols = 3
        const items: number[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = i
        }
        const grid = new Grid<number>(rows, cols, items)

        expect(grid.indexOf(4)).toEqual(4)
      })

      test('returns -1 if item is not found', () => {
        const rows = 4
        const cols = 3
        const items: number[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = i
        }
        const grid = new Grid<number>(rows, cols, items)

        expect(grid.indexOf(40)).toEqual(-1)
      })
    })

    describe('Grid.prototype.isValidCoords()', () => {
      test('returns true if the given coordinate is valid', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.isValidCoords({ x: 0, y: 0 })).toBe(true)
        expect(grid.isValidCoords({ x: 1, y: 0 })).toBe(true)
        expect(grid.isValidCoords({ x: 1, y: 1 })).toBe(true)
        expect(grid.isValidCoords({ x: 2, y: 3 })).toBe(true)
      })

      test('returns false if the given coordinate is invalid', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.isValidCoords({ x: -1, y: -1 })).toBe(false)
        expect(grid.isValidCoords({ x: 3, y: 4 })).toBe(false)
        expect(grid.isValidCoords({ x: NaN, y: Infinity })).toBe(false)
      })
    })

    describe('Grid.prototype.isValidIndex()', () => {
      test('returns true if the given index is valid', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.isValidIndex(0)).toBe(true)
        expect(grid.isValidIndex(1)).toBe(true)
        expect(grid.isValidIndex(4)).toBe(true)
        expect(grid.isValidIndex(11)).toBe(true)
      })

      test('returns false if the given coordinate is invalid', () => {
        const rows = 4
        const cols = 3
        const grid = new Grid(rows, cols)

        expect(grid.isValidIndex(-1)).toBe(false)
        expect(grid.isValidIndex(12)).toBe(false)
        expect(grid.isValidIndex(NaN)).toBe(false)
        expect(grid.isValidIndex(Infinity)).toBe(false)
      })
    })

    describe('Grid.prototype.set()', () => {
      test('sets the value at a given coordinate', () => {
        const rows = 4
        const cols = 3
        const items: string[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = String.fromCharCode(65 + i)
        }
        const grid = new Grid<string>(rows, cols, items)

        grid.set({ x: 0, y: 0 }, 'N')
        grid.set({ x: 1, y: 0 }, 'E')
        grid.set({ x: 1, y: 1 }, 'A')
        grid.set({ x: 2, y: 3 }, 'T')

        expect(grid.get({ x: 0, y: 0 })).toBe('N')
        expect(grid.get({ x: 1, y: 0 })).toBe('E')
        expect(grid.get({ x: 1, y: 1 })).toBe('A')
        expect(grid.get({ x: 2, y: 3 })).toBe('T')
      })

      test('sets the value at a given index', () => {
        const rows = 4
        const cols = 3
        const items: string[] = new Array(rows * cols)
        for (let i = 0; i < items.length; i++) {
          items[i] = String.fromCharCode(65 + i)
        }
        const grid = new Grid<string>(rows, cols, items)

        grid.set(0, 'N')
        grid.set(1, 'E')
        grid.set(4, 'A')
        grid.set(11, 'T')

        expect(grid.get(0)).toBe('N')
        expect(grid.get(1)).toBe('E')
        expect(grid.get(4)).toBe('A')
        expect(grid.get(11)).toBe('T')
      })
    })
  })

  describe('static methods', () => {
    describe('Grid.isGridCoords()', () => {
      test('returns true if a given object implements GridCoords interface', () => {
        expect(Grid.isGridCoords({ x: 1, y: 0 })).toBe(true)
      })

      test('returns false if a given object does not implement interface', () => {
        expect(Grid.isGridCoords(1)).toBe(false)
      })
    })

    describe('Grid.isEqualCoords()', () => {
      test('returns true if both coordinates are the same', () => {
        const xy1 = { x: 1, y: 0 }
        const xy2 = { x: 1, y: 0 }

        expect(Grid.isEqualCoords(xy1, xy2)).toBe(true)
      })

      test('returns false if coordinates are different', () => {
        const xy1 = { x: 1, y: 0 }
        const xy2 = { x: 0, y: 1 }

        expect(Grid.isEqualCoords(xy1, xy2)).toBe(false)
      })
    })
  })
})
