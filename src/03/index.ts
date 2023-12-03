function parseData(input: string): string[][] {
    return input.split('\n').map((line) => {
        return line.trim().split('');
    });
}

function isSymbol(char: string) {
    if (char === '.') {
        return false;
    }

    if (char < '0' || char > '9') {
        return true;
    }

    return false;
}

export function solvePuzzle(data: string) {
    function isAdjucentToSymbol(i: number, j: number) {
        if (i < 0 || j < 0 || i >= engineSchema.length || j >= engineSchema[0].length) {
            return false;
        }
        return isSymbol(engineSchema[i][j]);
    }

    function isValidPartNumber(part: {
        text: string;
        startI: number;
        startJ: number;
        endI: number;
        endJ: number;
    }) {
        const { startI, startJ, endI, endJ } = part;
        // console.log('checking part:' + JSON.stringify(part));

        // check top
        for (let j = startJ - 1; j <= endJ + 1; j++) {
            if (isAdjucentToSymbol(startI - 1, j)) {
                return true;
            }
        }

        // check sides
        if (isAdjucentToSymbol(startI, startJ - 1) || isAdjucentToSymbol(endI, endJ + 1)) {
            return true;
        }

        // check bottom
        for (let j = startJ - 1; j <= endJ + 1; j++) {
            if (isAdjucentToSymbol(startI + 1, j)) {
                return true;
            }
        }
        return false;
    }

    const engineSchema = parseData(data);
    let totalSum = 0;

    for (let i = 0; i < engineSchema.length; i++) {
        let number = {
            text: '',
            startI: -1,
            startJ: -1,
            endI: -1,
            endJ: -1
        };
        for (let j = 0; j < engineSchema[i].length; j++) {
            const current = engineSchema[i][j];

            if (!Number.isNaN(Number(current))) {
                if (number.text === '') {
                    number.startI = i;
                    number.startJ = j;
                }

                number.text += current;

                if (j === engineSchema.length - 1) {
                    const partNumber = Number(number.text);
                    if (Number.isNaN(number.text)) {
                        throw new Error('invalid number: ' + number.text);
                    }

                    number.endI = i;
                    number.endJ = j;

                    if (isValidPartNumber(number)) {
                        // console.log('HERE', number);
                        totalSum += partNumber;
                    }

                    // reset
                    number = {
                        text: '',
                        startI: -1,
                        startJ: -1,
                        endI: -1,
                        endJ: -1
                    };
                }
            } else {
                if (number.text.length > 0) {
                    const partNumber = Number(number.text);
                    if (Number.isNaN(number.text)) {
                        throw new Error('invalid number: ' + number.text);
                    }

                    number.endI = i;
                    number.endJ = j - 1;

                    if (isValidPartNumber(number)) {
                        // console.log('HERE', number);
                        totalSum += partNumber;
                    }

                    // reset
                    number = {
                        text: '',
                        startI: -1,
                        startJ: -1,
                        endI: -1,
                        endJ: -1
                    };
                }
            }
        }
    }

    // console.log(engineSchema);

    return totalSum;
}

type Point = {
    i: number;
    j: number;
};

export function solvePuzzlePart2(data: string) {
    const engineSchema = parseData(data);
    let totalGearRation = 0;

    const visited = {};

    function isOutOfBound(i: number, j: number) {
        return i < 0 || j < 0 || i >= engineSchema.length || j >= engineSchema[0].length;
    }

    function getChildren(startI: number, startJ: number, endI: number, endJ: number): Point[] {
        const children: Point[] = [];
        // check top
        for (let j = startJ - 1; j <= endJ + 1; j++) {
            if (!isOutOfBound(startI - 1, j)) {
                children.push({
                    i: startI - 1,
                    j: j
                });
            }
        }

        // check sides
        if (!isOutOfBound(startI, startJ - 1)) {
            children.push({
                i: startI,
                j: startJ - 1
            });
        }
        if (!isOutOfBound(endI, endJ + 1)) {
            children.push({
                i: endI,
                j: endJ + 1
            });
        }

        // check bottom
        for (let j = startJ - 1; j <= endJ + 1; j++) {
            if (!isOutOfBound(startI + 1, j)) {
                children.push({
                    i: startI + 1,
                    j: j
                });
            }
        }
        return children;
    }

    function isValidPartNumber(part: {
        text: string;
        startI: number;
        startJ: number;
        endI: number;
        endJ: number;
    }) {
        const { startI, startJ, endI, endJ } = part;

        // mark current number as visited
        for (let j = startJ; j <= endJ; j++) {
            visited[`${startI}_${j}`] = true;
        }

        const children = getChildren(startI, startJ, endI, endJ);

        let foundStar: Point | undefined = undefined;
        while (children.length > 0) {
            const p = children.pop();

            if (p === undefined) {
                throw new Error('p is undefined');
            }

            if (engineSchema[p.i][p.j] === '*') {
                foundStar = p;
            }
        }

        if (!foundStar) {
            return false;
        }

        const starChildren = getChildren(foundStar.i, foundStar.j, foundStar.i, foundStar.j);

        while (starChildren.length > 0) {
            const p = starChildren.pop();

            if (p === undefined) {
                throw new Error('p is undefined');
            }

            if (
                visited[`${p.i}_${p.j}`] === undefined &&
                engineSchema[p.i][p.j] >= '0' &&
                engineSchema[p.i][p.j] <= '9'
            ) {
                let numberText = engineSchema[p.i][p.j];
                visited[`${p.i}_${p.j}`] = true;

                let leftJ = p.j - 1;
                let rightJ = p.j + 1;

                while (
                    !isOutOfBound(p.i, leftJ) &&
                    engineSchema[p.i][leftJ] >= '0' &&
                    engineSchema[p.i][leftJ] <= '9'
                ) {
                    numberText = engineSchema[p.i][leftJ] + numberText;
                    visited[`${p.i}_${leftJ}`] = true;
                    leftJ--;
                }

                while (
                    !isOutOfBound(p.i, rightJ) &&
                    engineSchema[p.i][rightJ] >= '0' &&
                    engineSchema[p.i][rightJ] <= '9'
                ) {
                    numberText = numberText + engineSchema[p.i][rightJ];
                    visited[`${p.i}_${rightJ}`] = true;
                    rightJ++;
                }

                if (Number.isNaN(Number(numberText))) {
                    throw new Error('numberText is NAN: ' + numberText);
                }

                totalGearRation += Number(part.text) * Number(numberText);
                return true;
            }
        }

        return false;
    }

    for (let i = 0; i < engineSchema.length; i++) {
        let number = {
            text: '',
            startI: -1,
            startJ: -1,
            endI: -1,
            endJ: -1
        };
        for (let j = 0; j < engineSchema[i].length; j++) {
            const current = engineSchema[i][j];

            if (!Number.isNaN(Number(current))) {
                if (number.text === '') {
                    number.startI = i;
                    number.startJ = j;
                }

                number.text += current;

                if (j === engineSchema.length - 1) {
                    const partNumber = Number(number.text);
                    if (Number.isNaN(number.text)) {
                        throw new Error('invalid number: ' + number.text);
                    }

                    number.endI = i;
                    number.endJ = j;

                    if (isValidPartNumber(number)) {
                        console.log('HERE', number);
                    }

                    // reset
                    number = {
                        text: '',
                        startI: -1,
                        startJ: -1,
                        endI: -1,
                        endJ: -1
                    };
                }
            } else {
                if (number.text.length > 0) {
                    const partNumber = Number(number.text);
                    if (Number.isNaN(number.text)) {
                        throw new Error('invalid number: ' + number.text);
                    }

                    number.endI = i;
                    number.endJ = j - 1;

                    if (isValidPartNumber(number)) {
                        console.log('HERE', number);
                    }

                    // reset
                    number = {
                        text: '',
                        startI: -1,
                        startJ: -1,
                        endI: -1,
                        endJ: -1
                    };
                }
            }
        }
    }

    return totalGearRation;
}
