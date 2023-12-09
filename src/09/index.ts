type History = number[];
type Predictons = number[][];

function parseData(input: string): History[] {
    return input.split('\n').map((line) => {
        return line
            .trim()
            .split(' ')
            .map((item) => Number(item));
    });
}

function getPredictions(histories: History[]): Predictons[] {
    return histories.map((history) => {
        return predict(history);
    });
}

function hasAllZeros(prediction: number[]) {
    let allZeros = false;

    if (prediction.length > 0) {
        for (let item of prediction) {
            if (item !== 0) {
                return false;
            }
        }
        allZeros = true;
    }

    return allZeros;
}

function predict(history: History): Predictons {
    const results: Predictons = [];
    let prediction: number[] = [];
    let prev = [...history];

    while (!hasAllZeros(prediction)) {
        prediction = [];
        for (let i = 0; i < prev.length - 1; i++) {
            // absolute value?
            const diff = prev[i + 1] - prev[i];
            prediction.push(diff);
        }
        results.push(prediction);
        prev = [...prediction];
    }

    return [history, ...results];
}

function getNextValue(predictions: Predictons): number {
    let prev = 0;
    let next = Number.MIN_SAFE_INTEGER;

    for (let i = predictions.length - 1; i >= 0; i--) {
        next = predictions[i][0] - prev;
        prev = next;
    }
    return next;
}

export function solvePuzzle(input: string) {
    const histories = parseData(input);
    const predictions = getPredictions(histories);
    // console.log(JSON.stringify(predictions));

    return predictions.reduce((acc, val) => {
        return acc + getNextValue(val);
    }, 0);
}
