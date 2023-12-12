type Space = '.' | '#';
type Universe = Space[][];
type Galaxy = {
    x: number;
    y: number;
    key: string;
};

type GalaxyPair = {
    first: Galaxy;
    second: Galaxy;
    distance: number;
};

function parseData(input: string): Universe {
    return input.split('\n').map((line) => {
        return line.trim().split('');
    }) as Universe;
}

function prnt(universe: Universe) {
    let out = '';
    universe.forEach((row) => {
        row.forEach((col) => {
            out += col;
        });
        out += '\n';
    });

    console.log(out);
}

function expand(universe: Universe) {
    const occupiedRow = new Set<number>();
    const occupiedCol = new Set<number>();
    universe.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === '#') {
                occupiedRow.add(rowIndex);
                occupiedCol.add(colIndex);
            }
        });
    });

    const unoccupiedRow = new Set<number>();
    const unoccupiedCol = new Set<number>();
    for (let i = 0; i < universe.length; i++) {
        if (!occupiedRow.has(i)) {
            unoccupiedRow.add(i);
        }
    }

    const columnLength = universe[0].length;
    for (let i = 0; i < columnLength; i++) {
        if (!occupiedCol.has(i)) {
            unoccupiedCol.add(i);
        }
    }

    Array.from(unoccupiedRow)
        .reverse()
        .forEach((row) => {
            universe.splice(row, 0, new Array(columnLength).fill('.'));
        });

    Array.from(unoccupiedCol)
        .reverse()
        .forEach((col) => {
            universe.forEach((row, index) => {
                row.splice(col, 0, '.');
            });
        });
}

function shortestPathBfs(first: Galaxy, second: Galaxy, universe: Universe): number {
    let steps = 0;
    const queue: { galaxy: Galaxy; distance: number }[] = [{ galaxy: first, distance: 0 }];
    const visited = new Set<string>();

    while (queue.length) {
        const { galaxy, distance } = queue.shift()!;
        const { x, y, key } = galaxy;

        if (visited.has(key)) {
            continue;
        }

        visited.add(key);
        steps = distance;

        if (x === second.x && y === second.y) {
            // found target
            return steps;
        }

        const children: Galaxy[] = [];

        if (x - 1 >= 0) {
            children.push({
                x: x - 1,
                y: y,
                key: `${x - 1}_${y}`
            });
        }
        if (x + 1 < universe.length) {
            children.push({
                x: x + 1,
                y: y,
                key: `${x + 1}_${y}`
            });
        }

        if (y - 1 >= 0) {
            children.push({
                x: x,
                y: y - 1,
                key: `${x}_${y - 1}`
            });
        }

        if (y + 1 < universe[0].length) {
            children.push({
                x: x,
                y: y + 1,
                key: `${x}_${y + 1}`
            });
        }

        const notVisited = children.filter((g) => !visited.has(g.key));

        if (notVisited.length) {
            notVisited.forEach((item) => queue.push({ galaxy: item, distance: distance + 1 }));
        }
    }

    return -1;
}

export function solvePuzzle(input: string) {
    const universe = parseData(input);
    // prnt(universe);

    // 1. expand the universe by doubling unoccupied columns and rows in REVERSE! - start from the end
    expand(universe);
    prnt(universe);
    // 2. find all pairs of galaxies (#)
    const galaxies: Galaxy[] = [];
    universe.forEach((row, i1) => {
        row.forEach((col, i2) => {
            if (universe[i1][i2] === '#') {
                galaxies.push({
                    x: i1,
                    y: i2,
                    key: `${i1}_${i2}`
                });
            }
        });
    });

    // console.log(galaxies);
    // 3. calculate shortest path for every pair of galaxies after expension
    const pairs: GalaxyPair[] = [];
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            pairs.push({
                first: galaxies[i],
                second: galaxies[j],
                distance: -1
            });
        }
    }

    console.log(pairs.length);

    pairs.forEach((pair) => {
        pair.distance = shortestPathBfs(pair.first, pair.second, universe);
    });
    console.log(pairs);

    // 4. sum up shortest paths
    return pairs.reduce((acc, val) => acc + val.distance, 0);
}
