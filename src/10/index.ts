type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Grid = Tile[][];
type Position = {
    x: number;
    y: number;
    key: string;
};
type MoveDirection = 'up' | 'down' | 'left' | 'right';

const tileMoveMap: Record<Tile, Set<MoveDirection>> = {
    S: new Set(['up', 'down', 'left', 'right']),
    L: new Set(['up', 'right']),
    7: new Set(['down', 'left']),
    '|': new Set(['up', 'down']),
    '-': new Set(['left', 'right']),
    J: new Set(['left', 'up']),
    F: new Set(['right', 'down']),
    '.': new Set()
};

function parseData(input: string): Grid {
    return input.split('\n').map((line) => {
        return line.trim().split('');
    }) as Grid;
}

function find(tile: Tile, grid: Grid): Position {
    let x = -1,
        y = -1;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === tile) {
                x = i;
                y = j;
                break;
            }
        }
    }

    return {
        x,
        y,
        key: `${x}_${y}`
    };
}

function findLongestPath(grid: Grid, start: Position): number {
    let longestStep = 0;
    const visited = new Set<string>();
    const queue: { p: Position; step: number }[] = [{ p: start, step: 0 }];

    const getValidChildren = (p: Position): Position[] => {
        const result: Position[] = [];
        // check north
        const north = p.x - 1;
        if (
            north >= 0 &&
            tileMoveMap[grid[p.x][p.y]].has('up') &&
            tileMoveMap[grid[north][p.y]].has('down')
        ) {
            result.push({
                x: north,
                y: p.y,
                key: `${north}_${p.y}`
            });
        }
        // check south
        const south = p.x + 1;
        if (
            south < grid.length &&
            tileMoveMap[grid[p.x][p.y]].has('down') &&
            tileMoveMap[grid[south][p.y]].has('up')
        ) {
            result.push({
                x: south,
                y: p.y,
                key: `${south}_${p.y}`
            });
        }

        // check west
        const west = p.y - 1;
        if (
            west >= 0 &&
            tileMoveMap[grid[p.x][p.y]].has('left') &&
            tileMoveMap[grid[p.x][west]].has('right')
        ) {
            result.push({
                x: p.x,
                y: west,
                key: `${p.x}_${west}`
            });
        }

        // check east
        const east = p.y + 1;
        if (
            east < grid[0].length &&
            tileMoveMap[grid[p.x][p.y]].has('right') &&
            tileMoveMap[grid[p.x][east]].has('left')
        ) {
            result.push({
                x: p.x,
                y: east,
                key: `${p.x}_${east}`
            });
        }

        return result;
    };

    while (queue.length) {
        const { p: current, step } = queue.shift()!;
        if (!visited.has(current.key)) {
            // visit
            visited.add(current.key);
            longestStep = step;
            const children = getValidChildren(current).filter((p) => !visited.has(p.key));
            if (children.length) {
                // console.log(current, children);
                children.forEach((tile) => queue.push({ p: tile, step: step + 1 }));
            }
        }
    }
    return longestStep;
}

export function solvePuzzle(input: string) {
    const grid = parseData(input);
    const start = find('S', grid);

    if (start.x === -1 || start.y === -1) {
        throw new Error('start not found');
    }

    const longestPath = findLongestPath(grid, start);
    console.log(grid, start);

    return longestPath;
}
