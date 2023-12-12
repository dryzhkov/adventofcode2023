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

function getUnoccupiedRegions(universe: Universe) {
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

    return {
        rows: Array.from(unoccupiedRow),
        cols: Array.from(unoccupiedCol)
    };
}

export function solvePuzzle(input: string) {
    const universe = parseData(input);

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

    console.log('number of galaxies: ' + galaxies.length);
    // 3. calculate shortest path for every pair of galaxies after expension
    const pairs: GalaxyPair[] = [];
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            pairs.push({
                first: galaxies[i],
                second: galaxies[j],
                distance: calculateDistance(
                    galaxies[i].x,
                    galaxies[i].y,
                    galaxies[j].x,
                    galaxies[j].y
                )
            });
        }
    }

    extrapolateDistances(universe, pairs);

    // 4. sum up shortest paths
    return pairs.reduce((acc, val) => acc + val.distance, 0);
}

function extrapolateDistances(universe: Universe, pairs: GalaxyPair[]) {
    const expansionRate = 1000000 - 1;

    const emptyRegions = getUnoccupiedRegions(universe);
    console.log('empty regions: ' + emptyRegions.rows.length + emptyRegions.cols.length);

    pairs.forEach((pair) => {
        let emptyRegionsInBetween = 0;
        emptyRegions.rows.forEach((row) => {
            if (isBetween(pair.first.x, pair.second.x, row)) {
                emptyRegionsInBetween += 1;
            }
        });

        emptyRegions.cols.forEach((col) => {
            if (isBetween(pair.first.y, pair.second.y, col)) {
                emptyRegionsInBetween += 1;
            }
        });

        if (emptyRegionsInBetween > 0) {
            pair.distance = expansionRate * emptyRegionsInBetween + pair.distance;
        }
    });
}

function isBetween(first, second, value) {
    if (first <= value && value <= second) {
        return true;
    }

    if (second <= value && value <= first) {
        return true;
    }

    return false;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
