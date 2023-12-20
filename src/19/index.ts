type Workflows = Map<string, string[]>;

type Part = { categories: Map<Category, number>; state: State };
type Category = 'x' | 'm' | 'a' | 's';
type State = 'A' | 'R' | '';

function parseInput(input: string): { workflows: Workflows; parts: Part[] } {
    const blocks = input.split('\n\n');

    const workflows: Map<string, string[]> = new Map();
    blocks[0]
        .trim()
        .split('\n')
        .forEach((line) => {
            const pieces = line.split('{');
            workflows.set(pieces[0], pieces[1].slice(0, -1).split(','));
        });

    const parts: Part[] = blocks[1]
        .trim()
        .split('\n')
        .map((line) => {
            const pieces = line.slice(1, -1).split(',');
            const categories: Map<Category, number> = new Map();
            categories.set('x', Number(pieces[0].split('=')[1]));
            categories.set('m', Number(pieces[1].split('=')[1]));
            categories.set('a', Number(pieces[2].split('=')[1]));
            categories.set('s', Number(pieces[3].split('=')[1]));
            return {
                categories,
                state: ''
            };
        });
    return {
        workflows,
        parts
    };
}

function processPart(part: Part, workflows: Workflows): State {
    let workflow = 'in';

    while (true) {
        if (workflow === 'R') {
            return 'R';
        } else if (workflow === 'A') {
            return 'A';
        }

        const steps = workflows.get(workflow);

        if (steps === undefined) {
            throw new Error();
        }

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            if (i === steps.length - 1) {
                // last step has no condition
                workflow = step;
            } else {
                if (step.indexOf('<') > -1) {
                    const pieces = step.split('<');
                    const parts = pieces[1].split(':');
                    const category = pieces[0] as Category;
                    const value = Number(parts[0]);
                    const nextWorkflow = parts[1];
                    if (part.categories.get(category)! < value) {
                        workflow = nextWorkflow;
                        break;
                    }
                } else if (step.indexOf('>') > -1) {
                    const pieces = step.split('>');
                    const parts = pieces[1].split(':');
                    const category = pieces[0] as Category;
                    const value = Number(parts[0]);
                    const nextWorkflow = parts[1];
                    if (part.categories.get(category)! > value) {
                        workflow = nextWorkflow;
                        break;
                    }
                } else {
                    throw new Error();
                }
            }
        }
    }
}

export function solvePuzzle(input: string) {
    const { parts, workflows } = parseInput(input);
    parts.forEach((part) => {
        part.state = processPart(part, workflows);
    });

    const acceptedParts = parts.filter((part) => part.state === 'A');

    return acceptedParts.reduce((acc, val) => {
        return (
            acc +
            (val.categories.get('x')! +
                val.categories.get('m')! +
                val.categories.get('a')! +
                val.categories.get('s')!)
        );
    }, 0);
}

type Range = {
    x: [number, number];
    m: [number, number];
    a: [number, number];
    s: [number, number];
};

const MAX_ALLOWED_RANGES: Range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000]
};

export function solvePuzzlePart2(input: string) {
    const { workflows } = parseInput(input);

    const accepted = getAcceptedPaths(workflows, 'in', MAX_ALLOWED_RANGES);

    return accepted.reduce((acc, value) => {
        const xDelta = value.x[1] - value.x[0] + 1;
        const mDelta = value.m[1] - value.m[0] + 1;
        const aDelta = value.a[1] - value.a[0] + 1;
        const sDelta = value.s[1] - value.s[0] + 1;
        return acc + xDelta * mDelta * aDelta * sDelta;
    }, 0);
}

function getAcceptedPaths(workflows: Workflows, workflow: string, range: Range) {
    if (workflow === 'R') {
        return [];
    } else if (workflow === 'A') {
        return [range];
    }

    const steps = workflows.get(workflow);

    if (steps === undefined) {
        throw new Error();
    }

    const ranges: Range[] = [];
    let currentRange: Range | undefined = range;

    for (let i = 0; i < steps.length - 1; i++) {
        if (!currentRange) {
            break;
        }
        const step = steps[i];
        const [conditionRange, remainingRange] = adjust(currentRange, step);
        if (conditionRange) {
            ranges.push(...getAcceptedPaths(workflows, step.split(':')[1], conditionRange));
        }
        currentRange = remainingRange;
    }

    if (currentRange) {
        ranges.push(...getAcceptedPaths(workflows, steps[steps.length - 1], currentRange));
    }

    return ranges;
}

function adjust(range: Range, step: string) {
    if (step.includes('<')) {
        const pieces = step.split('<');
        const rating = pieces[0];
        const target = Number(pieces[1].split(':')[0]);

        if (range[rating][0] >= target) {
            return [undefined, range];
        } else {
            return [
                {
                    ...range,
                    [rating]: [range[rating][0], target - 1]
                },
                {
                    ...range,
                    [rating]: [target, range[rating][1]]
                }
            ];
        }
    } else {
        const pieces = step.split('>');
        const rating = pieces[0];
        const target = Number(pieces[1].split(':')[0]);

        if (range[rating][1] <= target) {
            return [undefined, range];
        } else {
            return [
                {
                    ...range,
                    [rating]: [target + 1, range[rating][1]]
                },
                {
                    ...range,
                    [rating]: [range[rating][0], target]
                }
            ];
        }
    }
}
