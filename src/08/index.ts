type Turn = 'L' | 'R';

type DessertMap = Record<string, string[]>;

function parseData(input: string): { turns: Turn[]; map: DessertMap } {
    const blocks = input.split('\n\n');

    const turns = blocks[0].trim().split('') as Turn[];

    const map = {};

    blocks[1].split('\n').forEach((line) => {
        const pieces = line.split('=');
        const [left, right] = pieces[1].split(',');
        map[pieces[0].trim()] = [
            left.trim().substring(1),
            right.trim().substring(0, right.trim().length - 1)
        ];
    });

    return {
        turns,
        map
    };
}

function gcd(a: number, b: number) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(numbers: number[]) {
    // Helper function to find the LCM of two numbers
    function lcmTwoNumbers(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    // Iterate through the array and find the LCM step by step
    let result = 1;
    for (let i = 0; i < numbers.length; i++) {
        result = lcmTwoNumbers(result, numbers[i]);
    }

    return result;
}

function getSteps(turns: Turn[], map: DessertMap): number {
    let totalSteps = 0;

    const getNextTurn = (): Turn => {
        return turns[totalSteps % turns.length];
    };

    const starts = Object.keys(map).filter((key) => key.endsWith('A'));

    const finished = () => {
        for (let start of starts) {
            if (!start.endsWith('Z')) {
                return false;
            }
        }
        return true;
    };

    console.log(starts);

    const steps: number[] = new Array(starts.length).fill(0);

    while (!finished()) {
        const turn = getNextTurn();
        if (turn === undefined) {
            throw new Error('undefined turn');
        }

        for (let i = 0; i < starts.length; i++) {
            if (!starts[i].endsWith('Z')) {
                starts[i] = turn === 'L' ? map[starts[i]][0] : map[starts[i]][1];

                if (starts[i].endsWith('Z') && steps[i] === 0) {
                    steps[i] = totalSteps + 1;
                }
            }
        }

        totalSteps++;
    }

    console.log(starts);
    console.log(steps);

    return lcm(steps);
}

export function solvePuzzle(input: string) {
    const { turns, map } = parseData(input);

    const steps = getSteps(turns, map);

    return steps;
}
