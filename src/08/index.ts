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

function getSteps(start: string, destination: string, turns: Turn[], map: DessertMap): number {
    let totalSteps = 0;

    const getNextTurn = (): Turn => {
        return turns[totalSteps % turns.length];
    };

    while (start !== destination) {
        const turn = getNextTurn();
        if (turn === undefined) {
            throw new Error('undefined turn');
        }

        start = turn === 'L' ? map[start][0] : map[start][1];
        totalSteps++;
    }

    return totalSteps;
}

export function solvePuzzle(input: string) {
    const { turns, map } = parseData(input);

    const steps = getSteps('AAA', 'ZZZ', turns, map);

    return steps;
}
