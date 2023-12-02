const MaxCubesAllowed = {
    red: 12,
    green: 13,
    blue: 14
};

function parseGames(input: string) {
    const games = input.split('\n').map((line) => {
        let match = /Game ([0-9]+):/.exec(line.trim());
        if (match !== null && match.length === 2) {
            const gameId = Number(match[1]);
            const rawCubes = line.split(':')[1];
            const sets = rawCubes.split(';');

            const totals = {
                red: 0,
                green: 0,
                blue: 0
            };

            let possible = true;
            sets.forEach((set) => {
                match = /([0-9]+) blue/.exec(set);
                if (match && match.length === 2) {
                    totals.blue = Math.max(totals.blue, Number(match[1]));

                    if (Number(match[1]) > MaxCubesAllowed.blue) {
                        possible = false;
                    }
                }

                match = /([0-9]+) red/.exec(set);
                if (match && match.length === 2) {
                    totals.red = Math.max(totals.red, Number(match[1]));

                    if (Number(match[1]) > MaxCubesAllowed.red) {
                        possible = false;
                    }
                }

                match = /([0-9]+) green/.exec(set);
                if (match && match.length === 2) {
                    totals.green = Math.max(totals.green, Number(match[1]));

                    if (Number(match[1]) > MaxCubesAllowed.green) {
                        possible = false;
                    }
                }
            });

            const { red, green, blue } = totals;

            return {
                gameId,
                possible,
                red,
                green,
                blue
            };
        } else {
            throw new Error('cant find game id on line: ' + line);
        }
    });

    return games;
}

export function solvePuzzlePart2(data: string) {
    const games = parseGames(data);
    console.log(games);

    let totalPower = 0;

    games.forEach((game) => {
        const { green, red, blue } = game;
        totalPower += (green > 0 ? green : 1) * (red > 0 ? red : 1) * (blue > 0 ? blue : 1);
    });

    return totalPower;
}

export function solvePuzzle(data: string) {
    const games = parseGames(data);
    let totalIdSum = 0;

    games.forEach((game) => {
        if (game.possible) {
            totalIdSum += game.gameId;
        }
    });

    return totalIdSum;
}
