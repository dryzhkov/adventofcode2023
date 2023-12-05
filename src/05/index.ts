type GardeningMap = {
    title: string;
    lines: [number, number, number][];
};

function parseData(input: string): { seeds: number[]; maps: GardeningMap[] } {
    const pieces = input.split('\n\n');

    const seeds = pieces
        .shift()!
        .trim()
        .split(':')[1]
        .trim()
        .split(' ')
        .map((i) => Number(i));

    const maps: GardeningMap[] = [];

    pieces.forEach((piece) => {
        const lines = piece.split('\n');
        const map = {
            title: lines.shift()!,
            lines: lines.map((line) => {
                const numbers = line.split(' ');
                if (numbers.length !== 3) {
                    throw new Error('parsing error');
                }

                return [Number(numbers[0]), Number(numbers[1]), Number(numbers[2])] as [
                    number,
                    number,
                    number
                ];
            })
        };

        maps.push(map);
    });

    return {
        seeds,
        maps
    };
}

function getSeedLocation(seed: number, maps: GardeningMap[]): number {
    let source = seed;
    maps.forEach((map) => {
        for (let line of map.lines) {
            const [destinationStart, sourceStart, rangeLength] = line;

            if (source >= sourceStart && source <= sourceStart + rangeLength) {
                // console.log(
                //     map.title +
                //         ' source: ' +
                //         source +
                //         ' destination: ' +
                //         (source - sourceStart + destinationStart)
                // );
                source = source - sourceStart + destinationStart;
                break;
            }
        }
    });

    // console.log('Seed: ' + seed + ' -> Location: ' + source);

    return source;
}
export function solvePuzzle(data: string) {
    const { seeds, maps } = parseData(data);
    // console.log(seeds, JSON.stringify(maps));

    let lowestLocation = Number.MAX_SAFE_INTEGER;
    seeds.forEach((seed) => {
        const currentLocation = getSeedLocation(seed, maps);

        lowestLocation = Math.min(lowestLocation, currentLocation);
    });

    return lowestLocation;
}

export function solvePuzzlePart2(data: string) {
    const { seeds, maps } = parseData(data);
    let lowestLocation = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < seeds.length; i += 2) {
        const seedStart = seeds[i];
        const seedRange = seeds[i + 1];

        let seed = seedStart;
        while (seed <= seedStart + seedRange) {
            let source = seed;

            let lowestRange = Number.MAX_SAFE_INTEGER;
            for (let map of maps) {
                for (let line of map.lines) {
                    const [destinationStart, sourceStart, rangeLength] = line;

                    if (source >= sourceStart && source <= sourceStart + rangeLength) {
                        console.log(
                            map.title +
                                ' source: ' +
                                source +
                                ' destination: ' +
                                (source - sourceStart + destinationStart)
                        );
                        source = source - sourceStart + destinationStart;
                        lowestRange = Math.min(lowestRange, rangeLength);

                        break;
                    }
                }
            }
            console.log(
                'Seed: ' + seed + ' -> Location: ' + source + ' Lowest Range: ' + lowestRange
            );
            lowestLocation = Math.min(lowestLocation, source);

            if (lowestRange === Number.MAX_SAFE_INTEGER) {
                seed++;
            } else {
                seed += lowestRange;
            }
            // seed++;
        }
    }

    return lowestLocation;
}
