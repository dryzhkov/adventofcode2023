type Platform = Cell[][];
enum Cell {
    EmptySpace = '.',
    SquareRock = '#',
    RoundRock = 'O'
}

type Direction = 'north' | 'west' | 'south' | 'east';

function parseData(input: string): Platform {
    return input.split('\n').map((row) => {
        return row
            .trim()
            .split('')
            .map((value) => {
                switch (value) {
                    case '.':
                        return Cell.EmptySpace;
                    case '#':
                        return Cell.SquareRock;
                    case 'O':
                        return Cell.RoundRock;
                    default:
                        throw new Error('invalid value: ' + value);
                }
            });
    });
}

function printData(platform: Platform) {
    let out = '';
    platform.forEach((row) => {
        row.forEach((col) => {
            out += col;
        });
        out += '\n';
    });

    console.log(out);
}

export function solvePuzzle(input: string) {
    const platform = parseData(input);
    const cycle: Direction[] = ['north', 'west', 'south', 'east'];

    let c = 1;
    while (c <= 1000) {
        cycle.forEach((direction) => {
            tilt(platform, direction);
        });
        c++;
        console.log(c);
    }

    printData(platform);

    return calculateLoad(platform);
}

function tilt(platform: Platform, direction: Direction) {
    if (direction === 'north') {
        for (let i = 0; i < platform.length; i++) {
            for (let j = 0; j < platform[i].length; j++) {
                if (platform[i][j] === Cell.EmptySpace) {
                    let curRow = i;
                    while (curRow < platform.length && platform[curRow][j] === Cell.EmptySpace) {
                        curRow++;
                    }

                    if (curRow < platform.length) {
                        if (platform[curRow][j] === Cell.RoundRock) {
                            platform[i][j] = Cell.RoundRock;
                            platform[curRow][j] = Cell.EmptySpace;
                        }
                    }
                }
            }
        }
    } else if (direction === 'south') {
        for (let i = platform.length - 1; i >= 0; i--) {
            for (let j = 0; j < platform[i].length; j++) {
                if (platform[i][j] === Cell.EmptySpace) {
                    let curRow = i;
                    while (curRow >= 0 && platform[curRow][j] === Cell.EmptySpace) {
                        curRow--;
                    }

                    if (curRow >= 0) {
                        if (platform[curRow][j] === Cell.RoundRock) {
                            platform[i][j] = Cell.RoundRock;
                            platform[curRow][j] = Cell.EmptySpace;
                        }
                    }
                }
            }
        }
    } else if (direction === 'west') {
        for (let i = 0; i < platform.length; i++) {
            for (let j = 0; j < platform[i].length; j++) {
                if (platform[i][j] === Cell.EmptySpace) {
                    let curCol = j;
                    while (curCol < platform[i].length && platform[i][curCol] === Cell.EmptySpace) {
                        curCol++;
                    }

                    if (curCol < platform[i].length) {
                        if (platform[i][curCol] === Cell.RoundRock) {
                            platform[i][j] = Cell.RoundRock;
                            platform[i][curCol] = Cell.EmptySpace;
                        }
                    }
                }
            }
        }
    } else if (direction === 'east') {
        for (let i = 0; i < platform.length; i++) {
            for (let j = platform.length - 1; j >= 0; j--) {
                if (platform[i][j] === Cell.EmptySpace) {
                    let curCol = j;
                    while (curCol >= 0 && platform[i][curCol] === Cell.EmptySpace) {
                        curCol--;
                    }

                    if (curCol >= 0) {
                        if (platform[i][curCol] === Cell.RoundRock) {
                            platform[i][j] = Cell.RoundRock;
                            platform[i][curCol] = Cell.EmptySpace;
                        }
                    }
                }
            }
        }
    } else {
        throw new Error('invalid direction: ' + direction);
    }
}

function calculateLoad(platform: Platform): number {
    let totalSum = 0;

    for (let i = 0; i < platform.length; i++) {
        for (let j = 0; j < platform[i].length; j++) {
            if (platform[i][j] === Cell.RoundRock) {
                totalSum += platform.length - i;
            }
        }
    }

    return totalSum;
}
