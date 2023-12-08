type RaceData = {
    times: number[];
    distances: number[];
};

const sampleData: RaceData = {
    times: [7, 15, 30],
    distances: [9, 40, 200]
};

const realData: RaceData = { times: [62, 73, 75, 65], distances: [644, 1023, 1240, 1023] };

function getNumberOfWaysToWin(time: number, distance: number): number {
    let possibleWins = 0;
    let maxDistance = time;
    for (let i = 0; i <= time; i++) {
        let potentialDistance = i * maxDistance;
        if (potentialDistance > distance) {
            possibleWins++;
        }
        maxDistance--;
    }
    return possibleWins;
}

export function solvePuzzle() {
    const { times, distances } = realData;
    let total = 1;

    times.forEach((time, index) => {
        total *= getNumberOfWaysToWin(time, distances[index]);
    });

    return total;
}

export function solvePuzzlePart2() {
    return getNumberOfWaysToWin(62737565, 644102312401023);
}
