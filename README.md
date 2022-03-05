# Grid

The `Grid` object provides a 2D interface for a flat array, so elements can be accessed using `x` and `y` coordinates.
Helper functions have been provided to convert an array index to [GridCoords](#GridCoords) and vice versa; and items can
be retrieved or added to the array using either of the two.

Additionally, `Grid` provides methods for retrieving all coordinates, indices, or items adjacent to a given index or
coordinate, based on the number of `rows` and `cols` it was initialized with.

This package includes TypeScript type declarations, has full test coverage, and has no dependencies.

## Installation

### Yarn

```shell
yarn add @sscovil/grid
```

### NPM

```shell
npm install @sscovil/grid
```

## Usage

### ES Module Syntax

```typescript
import Grid from '@sscovil/grid'
```

### CommonJS Syntax

```typescript
const Grid = require('@sscovil/grid')
```

### Examples

Say you want a grid with three columns and four rows, with cells containing letters `A` through `L`.

To create this as a `Grid` object, you can do the following:

```typescript
const rows = 4
const cols = 3
const items: string[] = new Array(rows * cols)

for (let i = 0; i < items.length; i++) {
  items[i] = String.fromCharCode(65 + i) // set array values to letters A through L
}

const grid = new Grid<string>(rows, cols, items)
```

In the `Grid` object, the `x` coordinate would be `0` for the first column, `1`, for the second column, and `2` for the
third column. Likewise, the `y` coordinate would be `0` for the first row, `1` for the second row, `2` for the third
row, and `3` for the fourth row.

|   | `0` | `1` | `2` |
|---|---|---|---|
| `0` | A | B | C |
| `1` | D | E | F |
| `2` | G | H | I |
| `3` | J | K | L |

To get grid coordinates of `E`:

```typescript
const xy = grid.coordsOf('E')

expect(xy).toEqual({ x: 1, y: 1 })
```

To get the array index of `E`:

```typescript
const index = grid.indexOf('E')

expect(index).toEqual(4)
```

To get `E` using its grid coordinates:

```typescript
const valueAtCoords = grid.get({ x: 1, y: 1 })

expect(valueAtCoords).toBe('E')
```

To get `E` using its array index:

```typescript
const valueAtIndex = grid.get(4)

expect(valueAtIndex).toBe('E')
```

To change the value of `E` using its grid coordinates:

```typescript
grid.set({ x: 1, y: 1 }, 'e')

expect(grid.get(4)).toBe('e')
expect(grid.get({ x: 1, y: 1 })).toBe('e')
```

To change the value of `E` using its array index:

```typescript
grid.set(4, 'e')

expect(grid.get(4)).toBe('e')
expect(grid.get({ x: 1, y: 1 })).toBe('e')
```

To get all the values adjacent to `E` by its coordinate:

```typescript
const adjacentByCoords = grid.getAdjacent({ x: 1, y: 1 })

expect(adjacentByCoords).toEqual(['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I'])
```

To get all the items adjacent to `E` by its array index:

```typescript
const adjacentByIndex = grid.getAdjacent(4)

expect(adjacentByIndex).toEqual(['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I'])
```

To get all adjacent coordinates of `E` by its grid coordinate:

```typescript
const adjacentCoords = grid.getAdjacentCoords({ x: 1, y: 1 })

expect(adjacentCoords).toEqual([
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
])
```

To get all adjacent indices of `E` by its array index:

```typescript
const adjacentIndices = grid.getAdjacentIndices(4)

expect(adjacentIndices).toEqual([0, 1, 2, 3, 5, 6, 7, 8])
```

To get the coordinate of `E` by its array index:

```typescript
const xy = grid.getCoords(4)
const invalidXY = grid.getCoords(40)

expect(xy).toEqual({ x: 1, y: 1 })
expect(invalidXY).toEqual({ x: -1, y: -1 })
```

To get the index of `E` by its grid coordinate:

```typescript
const index = grid.getIndex({ x: 1, y: 1 })
const invalidIndex = grid.getIndex({ x: 10, y: 10 })

expect(index).toBe(4)
expect(invalidIndex).toBe(-1)
```

To check if a coordinate is within the range of the grid:

```typescript
const validXY = grid.isValidCoords({ x: 1, y: 1 })
const invalidXY = grid.isValidCoords({ x: 10, y: 10 })

expect(validXY).toBe(true)
expect(invalidXY).toBe(false)
```

To check if an array index is within the range of the grid:

```typescript
const validIndex = grid.isValidIndex(4)
const invalidIndex = grid.isValidIndex(40)

expect(validIndex).toBe(true)
expect(invalidIndex).toBe(false)
```

The `items` property is the array used to store data in the grid, and can be directly accessed:

```typescript
const allItems = grid.items.map((item) => item)
const notEmpty = grid.items.filter((item) => item !== undefined)
```

Avoid directly modifying the `items` array; use the `get` and `set` methods instead.

## API Reference

### Constructor

`Grid()`

Creates a new `Grid` object. Requires two numeric arguments: `rows` and `cols`. Accepts an array as an optional third
argument. If provided, the array elements will be used to populate the `items` array of the `Grid` instance.

### Static Methods

`Grid.isGridCoords()`

Returns `true` if the argument implements the [GridCoords](#GridCoords) interface, or `false` otherwise.

`Grid.isEqualCoords()`

Returns `true` if both arguments implement the [GridCoords](#GridCoords) interface and have equal `x` and `y` values.

### Instance Properties

`Grid.prototype.rows`

Read-only value that reflects the number of rows in the grid.

`Grid.prototype.cols`

Read-only value that reflects the number of columns in the grid.

`Grid.prototype.size`

Computed value that equals the number of rows multiplied by the number of columns in the grid.

`Grid.prototype.items`

Array used to store items in the grid. Avoid directly modifying the array; use the `get` and `set` methods instead.

### Instance Methods

`Grid.prototype.coordsOf()`

Returns the grid coordinate of the item provided as an argument if present in the grid, or `{ x: -1, y: -1 }` otherwise.
This uses [Array.prototype.indexOf()][1] under the hood, so it behaves the same way.

`Grid.prototype.get()`

Returns the item located at the grid coordinate or array index provided as an argument.

`Grid.prototype.getAdjacent()`

Returns an array of up to eight items located around the grid coordinate or array index provided as an argument. Items
at the corners of a grid will only have three adjacent items; and items along the edges of the grid will only have five.

`Grid.prototype.getAdjacentCoords()`

Returns an array of up to eight grid coordinates adjacent to the coordinate provided as an argument. Items at the
corners of a grid will only have three adjacent coordinates; and items along the edges of the grid will only have five.

`Grid.prototype.getAdjacentIndices()`

Returns an array of up to eight array indices adjacent to the index provided as an argument. Items at the corners of a
grid will only have three adjacent indices; and items along the edges of the grid will only have five.

`Grid.prototype.getCoords()`

Returns the grid coordinate of the array index provided as an argument if valid, or `{ x: -1, y: -1 }` otherwise.

`Grid.prototype.getIndex()`

Returns the array index of the grid coordinate provided as an argument if valid, or `-1` otherwise.

`Grid.prototype.indexOf()`

Returns the array index of the item provided as an argument if present in the grid, or `-1` otherwise. This uses
[Array.prototype.indexOf()][1] under the hood, so it behaves the same way.

`Grid.prototype.isValidCoords()`

Returns `true` if the argument implements the [GridCoords](#GridCoords) interface and is within the range of the grid
`items` array, or `false` otherwise.

`Grid.prototype.isValidIndex()`

Returns `true` if the argument is within the range of the grid `items` array.

`Grid.prototype.set()`

Sets the value of the item located at the grid coordinate or array index provided as the first argument, using the value
of the second argument.

### Interfaces

`GridCoords`

Any object that contains `x` and `y` properties with numeric values implements the `GridCoords` interface.

```typescript
interface GridCoords {
  x: number
  y: number
}
```

## Running Tests

```shell
yarn test
# OR
npm test
```

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf