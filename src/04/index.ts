type Card = {
    title: string;
    index: number;
    winning: Set<number>;
    numbers: number[];
    count: number;
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

function parseData(input: string): Card[] {
    return input.split('\n').map((line, index) => {
        const [left, right] = line.trim().split(':');

        const [winningRaw, numbersRaw] = right.trim().split('|');

        const parseNumbers = (input: string): number[] => {
            return input
                .trim()
                .split(' ')
                .map((i) => {
                    const text = i.trim();
                    if (text !== '') {
                        return Number(text);
                    }
                })
                .filter(notEmpty);
        };

        return {
            title: left.trim(),
            index,
            count: 1,
            winning: new Set(parseNumbers(winningRaw)),
            numbers: parseNumbers(numbersRaw)
        };
    });
}
export function solvePuzzle(data: string) {
    const cards = parseData(data);
    let totalPoints = 0;
    cards.forEach((card) => {
        let matched = 0;
        card.numbers.forEach((num) => {
            if (card.winning.has(num)) {
                matched++;
            }
        });

        totalPoints += matched > 0 ? Math.pow(2, matched - 1) : 0;
    });
    return totalPoints;
}

export function solvePuzzlePart2(data: string) {
    const cards = parseData(data);

    cards.forEach((card, index) => {
        let matched = 0;

        card?.numbers.forEach((num) => {
            if (card.winning.has(num)) {
                matched++;
            }
        });

        if (matched > 0) {
            for (let i = index + 1; i <= card.index + matched; i++) {
                cards[i].count += card.count;
            }
        }
    });

    return cards.reduce((acc, val) => {
        return acc + val.count;
    }, 0);
}
