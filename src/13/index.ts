type Pattern = Cell[][];
enum Cell {
    Ash = '.',
    Rock = '#'
}

function parseData(input: string): Pattern[] {
    return input.split('\n\n').map((block) => {
        return block
            .trim()
            .split('\n')
            .map((line) => {
                return line.split('').map((value) => {
                    switch (value) {
                        case '.':
                            return Cell.Ash;
                        case '#':
                            return Cell.Rock;
                        default:
                            throw new Error('invalid value: ' + value);
                    }
                });
            });
    });
}

function printData(patterns: Pattern[]) {
    let out = '';
    patterns.forEach((pattern) => {
        pattern.forEach((row) => {
            row.forEach((col) => {
                out += col;
            });
            out += '\n';
        });
        out += '\n\n';
    });

    console.log(out);
}

export function solvePuzzle(input: string) {
    const patterns = parseData(input);
    let summary = 0;

    // findVertialReflection(patterns[0]);
    patterns.forEach((pattern) => {
        const rowLine = findHorizontalReflection(pattern);
        const colLine = findVertialReflection(pattern);

        if (colLine > -1) {
            summary += colLine + 1;
        }

        if (rowLine > -1) {
            summary += (rowLine + 1) * 100;
        }
    });

    // printData(patterns);

    return summary;
}

function findVertialReflection(pattern: Pattern): number {
    let index = -1;
    for (let i = 0; i < pattern[0].length - 1; i++) {
        index = i;
        for (let j = 0; j < pattern.length; j++) {
            if (pattern[j][i] !== pattern[j][i + 1]) {
                index = -1;
                break;
            }
        }

        if (index !== -1) {
            // found potential reflection line, check rows in extending rows
            let first = index - 1;
            let second = index + 2;
            let same = true;

            while (first >= 0 && second < pattern[0].length) {
                for (let k = 0; k < pattern.length; k++) {
                    if (pattern[k][first] !== pattern[k][second]) {
                        same = false;
                        break;
                    }
                }

                first--;
                second++;
            }

            if (same) {
                break;
            }
        }
    }

    return index;
}

function findHorizontalReflection(pattern: Pattern): number {
    let index = -1;
    for (let i = 0; i < pattern.length - 1; i++) {
        index = i;
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j] !== pattern[i + 1][j]) {
                index = -1;
                break;
            }
        }

        if (index !== -1) {
            // found potential reflection line, check rows in extending rows
            let first = index - 1;
            let second = index + 2;
            let same = true;

            while (first >= 0 && second < pattern.length) {
                for (let k = 0; k < pattern[i].length; k++) {
                    if (pattern[first][k] !== pattern[second][k]) {
                        same = false;
                        break;
                    }
                }

                first--;
                second++;
            }

            if (same) {
                break;
            }
        }
    }

    return index;
}
