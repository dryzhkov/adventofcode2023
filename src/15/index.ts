import fs from 'fs';

function parseData(): string[] {
    let data = '';
    try {
        data = fs.readFileSync('src/15/real.txt', 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
    }

    return data.split(',');
}

function hash(input: string): number {
    let value = 0;

    input.split('').forEach((char) => {
        const code = char.charCodeAt(0);
        value += code;
        value = value * 17;
        value = value % 256;
    });

    return value;
}

export function solvePuzzle() {
    const sequence = parseData();

    let totalSum = 0;

    sequence.forEach((value) => {
        totalSum += hash(value);
    });

    return totalSum;
}
