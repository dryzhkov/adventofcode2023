type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

const CARD_RANK: Record<Card, number> = {
    J: 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    T: 9,
    Q: 11,
    K: 12,
    A: 13
};

type CamelCards = {
    hand: Card[];
    bid: number;
    rank: number;
    label: HandLabel;
};

type HandLabel =
    | 'five of a kind'
    | 'four of a kind'
    | 'full house'
    | 'three of a kind'
    | 'two pair'
    | 'one pair'
    | 'high card';

function parseData(input: string): CamelCards[] {
    return input.split('\n').map((line) => {
        const pieces = line.trim().split(' ');

        if (pieces.length !== 2) {
            throw new Error('invalid line: ' + line);
        }

        return {
            hand: pieces[0].split('') as Card[],
            bid: Number(pieces[1]),
            rank: 0,
            label: labelHand(pieces[0])
        };
    });
}

function processHand(hand: string): Record<Card, number> {
    const counts = {};
    hand.split('').forEach((card) => {
        if (counts[card] === undefined) {
            counts[card] = 1;
        } else {
            counts[card]++;
        }
    });

    return counts as Record<Card, number>;
}

function labelHand(hand: string): HandLabel {
    const cardCounts = processHand(hand);
    const jokerCount = cardCounts['J'] !== undefined ? Number(cardCounts['J']) : 0;
    if (Object.keys(cardCounts).length === 1) {
        return 'five of a kind';
    } else if (Object.keys(cardCounts).length === 2) {
        if (Object.keys(cardCounts).some((v) => cardCounts[v] === 4)) {
            if (jokerCount === 1 || jokerCount === 4) {
                // JOKER WTF!
                return 'five of a kind';
            }

            return 'four of a kind';
        } else if (
            Object.keys(cardCounts).some((v) => cardCounts[v] === 3) &&
            Object.keys(cardCounts).some((v) => cardCounts[v] === 2)
        ) {
            if (jokerCount === 3 || jokerCount === 2) {
                // JOKER WTF!
                return 'five of a kind';
            } else if (
                jokerCount === 1 &&
                Object.keys(cardCounts).some((v) => cardCounts[v] === 3)
            ) {
                return 'four of a kind';
            }
            return 'full house';
        } else {
            throw new Error('invalid hand: ' + hand);
        }
    } else if (Object.keys(cardCounts).length === 3) {
        if (Object.keys(cardCounts).some((v) => cardCounts[v] === 3)) {
            if (jokerCount === 3 || jokerCount === 1) {
                return 'four of a kind';
            }

            if (jokerCount === 2 || jokerCount > 3) {
                throw new Error('should not happen but did');
            }
            return 'three of a kind';
        } else if (Object.keys(cardCounts).some((v) => cardCounts[v] === 2)) {
            if (jokerCount === 1) {
                return 'full house';
            } else if (jokerCount === 2) {
                return 'four of a kind';
            }

            if (jokerCount > 2) {
                throw new Error('should not happen but did');
            }
            return 'two pair';
        } else {
            throw new Error('invalid hand: ' + hand);
        }
    } else if (Object.keys(cardCounts).length === 4) {
        if (jokerCount === 1 || jokerCount === 2) {
            return 'three of a kind';
        }

        if (jokerCount > 2) {
            throw new Error('should not happen but did');
        }

        return 'one pair';
    } else {
        if (Object.keys(cardCounts).length !== 5) {
            throw new Error('invalid hand: ' + hand);
        }

        if (jokerCount === 1) {
            return 'one pair';
        }

        if (jokerCount > 1) {
            throw new Error('should not happen but did');
        }

        return 'high card';
    }
}

function rankHands(hands: CamelCards[]) {
    let currentRank = 1;
    const handOrder: HandLabel[] = [
        'high card',
        'one pair',
        'two pair',
        'three of a kind',
        'full house',
        'four of a kind',
        'five of a kind'
    ];

    handOrder.forEach((handType) => {
        const filteredHands = hands
            .filter((hand) => hand.label === handType)
            .sort((one, two) => {
                for (let i = 0; i < one.hand.length; i++) {
                    const diff = CARD_RANK[one.hand[i]] - CARD_RANK[two.hand[i]];
                    if (diff > 0) {
                        return 1;
                    } else if (diff < 0) {
                        return -1;
                    }
                }

                return 0;
            });

        filteredHands.forEach((hand) => {
            hand.rank = currentRank;
            currentRank++;
        });
    });
}

export function solvePuzzle(input: string) {
    const hands = parseData(input);
    rankHands(hands);
    let result = 0;
    hands.forEach((hand) => {
        result += hand.rank * hand.bid;
    });
    // console.log(hands);

    return result;
}

export function solvePuzzlePart2() {
    return 0;
}
