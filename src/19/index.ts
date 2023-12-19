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
    // console.log(workflows);

    parts.forEach((part) => {
        part.state = processPart(part, workflows);
    });

    // console.log(parts);

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
