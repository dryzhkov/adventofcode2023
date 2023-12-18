import fs from 'fs';

type Sequence = DeleteSequence | SetSequence;

type DeleteSequence = {
    operation: '-';
    label: string;
};

type SetSequence = {
    operation: '=';
    label: string;
    focalLength: number;
};

type Lens = {
    label: string;
    focalLength: number;
};

type Box = Lens[][];

function parseData(): Sequence[] {
    let data = '';
    try {
        data = fs.readFileSync('src/15/real.txt', 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
    }

    return data.split(',').map((value) => {
        if (value.indexOf('-') > -1) {
            const pieces = value.split('-');
            return {
                label: pieces[0],
                operation: '-'
            };
        } else if (value.indexOf('=') > -1) {
            const pieces = value.split('=');
            return {
                label: pieces[0],
                operation: '=',
                focalLength: Number(pieces[1])
            };
        } else {
            throw new Error('invalid sequence: ' + value);
        }
    });
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
    const sequences = parseData();
    const boxes: Box = new Array(256);
    for (let i = 0; i < boxes.length; i++) {
        boxes[i] = [];
    }

    sequences.forEach((sequence) => {
        const index = hash(sequence.label);
        const box = boxes[index];
        const targetIndex = box.findIndex((lens) => lens.label === sequence.label);

        if (targetIndex > -1) {
            if (sequence.operation === '=') {
                box[targetIndex] = {
                    label: sequence.label,
                    focalLength: sequence.focalLength
                };
            } else {
                box.splice(targetIndex, 1);
            }
        } else {
            if (sequence.operation === '=') {
                box.push({
                    label: sequence.label,
                    focalLength: sequence.focalLength
                });
            }
        }
    });

    let focusingPower = 0;

    boxes.forEach((box, boxIndex) => {
        box.forEach((lens, lensIndex) => {
            focusingPower += (1 + boxIndex) * (1 + lensIndex) * lens.focalLength;
        });
    });

    return focusingPower;
}
