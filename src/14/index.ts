type Platform = Cell[][];
enum Cell {
    EmptySpace = '.',
    SquareRock = '#',
    RoundRock = 'O'
}

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

    tilt(platform);
    printData(platform);
    return calculateLoad(platform);
}

function tilt(platform: Platform) {
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
