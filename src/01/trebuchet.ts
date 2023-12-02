const validDigits = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
};

function replace(line: string) {
    for (let i = 0; i < line.length; i++) {
        for (const [key, value] of Object.entries(validDigits)) {
            if (line.substr(i).startsWith(key)) {
                line = line.replace(key, value + '');
            }
        }
    }

    return line;
}

export function solvePuzzlePart2(input: string) {
    const results: string[] = [];
    input.split('\n').forEach((line) => {
        line = replace(line.trim());
        results.push(line);
    });

    return solvePuzzle(results.join('\n'));
}

export function solvePuzzle(input: string) {
    const numbers: number[] = [];
    input.split('\n').forEach((line) => {
        let firstNumber: string | undefined = undefined;
        let lastNumber: string | undefined = undefined;
        for (const letter of line.trim()) {
            const n = Number(letter);
            if (!Number.isNaN(n)) {
                if (firstNumber === undefined) {
                    firstNumber = letter;
                } else {
                    lastNumber = letter;
                }
            }
        }
        if (firstNumber !== undefined) {
            if (lastNumber === undefined) {
                lastNumber = firstNumber;
            }

            numbers.push(Number(firstNumber + lastNumber));
        } else {
            throw new Error('no number found: ' + line);
        }
    });

    return numbers.reduce((acc, value) => acc + value, 0);
}
