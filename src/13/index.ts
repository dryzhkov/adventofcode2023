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

    patterns.forEach((pattern) => {
        const { index: rowLine, smudgeFound: horizontalSmudge } = findHorizontalReflection(pattern);
        if (rowLine !== -1 && horizontalSmudge) {
            summary += (rowLine + 1) * 100;
        } else {
            const { index: colLine } = findVertialReflection(pattern);
            if (colLine !== -1) {
                summary += colLine + 1;
            } else {
                throw new Error('WOOPS');
            }
        }
        // console.log('HERE: ', rowLine, colLine);
    });

    // printData(patterns);

    return summary;
}

function findVertialReflection(pattern: Pattern): { index: number; smudgeFound: boolean } {
    let index = -1;
    let smudgeFound = false;
    for (let i = 0; i < pattern[0].length - 1; i++) {
        index = i;
        let diffCount = 0;
        let diffX = -1;
        let diffY = -1;
        for (let j = 0; j < pattern.length; j++) {
            if (pattern[j][i] !== pattern[j][i + 1]) {
                diffCount++;
                diffX = j;
                diffY = i;
            }
        }

        if (diffCount <= 1) {
            // found potential reflection line, check rows in extending rows
            let first = index - 1;
            let second = index + 2;

            let innderDiffCount = 0;
            // reset diff count
            let innerDiffX = -1;
            let innderDiffY = -1;

            while (first >= 0 && second < pattern[0].length) {
                for (let k = 0; k < pattern.length; k++) {
                    if (pattern[k][first] !== pattern[k][second]) {
                        innderDiffCount++;
                        innerDiffX = k;
                        innderDiffY = first;
                    }
                }

                first--;
                second++;
            }

            if (diffCount === 1 && innderDiffCount === 0) {
                smudgeFound = true;
                // fix smudge
                if (pattern[diffX][diffY] === Cell.Ash) {
                    pattern[diffX][diffY] = Cell.Rock;
                } else {
                    pattern[diffX][diffY] = Cell.Ash;
                }
            } else if (innderDiffCount === 1 && diffCount === 0) {
                smudgeFound = true;
                // fix smudge
                if (pattern[innerDiffX][innderDiffY] === Cell.Ash) {
                    pattern[innerDiffX][innderDiffY] = Cell.Rock;
                } else {
                    pattern[innerDiffX][innderDiffY] = Cell.Ash;
                }
            }

            if (smudgeFound) {
                break;
            }
        }

        index = -1;
    }

    return { index, smudgeFound };
}

function findHorizontalReflection(pattern: Pattern): { index: number; smudgeFound: boolean } {
    let index = -1;
    let smudgeFound = false;
    for (let i = 0; i < pattern.length - 1; i++) {
        index = i;
        let diffCount = 0;
        let diffX = -1;
        let diffY = -1;
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j] !== pattern[i + 1][j]) {
                diffCount++;
                diffX = i;
                diffY = j;
            }
        }

        if (diffCount <= 1) {
            // found potential reflection line
            let first = index - 1;
            let second = index + 2;

            let innderDiffCount = 0;
            // reset diff count
            let innerDiffX = -1;
            let innerDiffY = -1;

            while (first >= 0 && second < pattern.length) {
                for (let k = 0; k < pattern[i].length; k++) {
                    if (pattern[first][k] !== pattern[second][k]) {
                        innderDiffCount++;
                        innerDiffX = first;
                        innerDiffY = k;
                    }
                }

                first--;
                second++;
            }

            if (diffCount === 1 && innderDiffCount === 0) {
                // fix smudge
                if (pattern[diffX][diffY] === Cell.Ash) {
                    pattern[diffX][diffY] = Cell.Rock;
                } else {
                    pattern[diffX][diffY] = Cell.Ash;
                }
                smudgeFound = true;
            } else if (innderDiffCount === 1 && diffCount === 0) {
                smudgeFound = true;
                // fix smudge
                if (pattern[innerDiffX][innerDiffY] === Cell.Ash) {
                    pattern[innerDiffX][innerDiffY] = Cell.Rock;
                } else {
                    pattern[innerDiffX][innerDiffY] = Cell.Ash;
                }
            }

            if (smudgeFound) {
                break;
            }
        }

        index = -1;
    }

    return { index, smudgeFound };
}
