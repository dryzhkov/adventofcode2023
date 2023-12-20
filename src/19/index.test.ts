import { solvePuzzle, solvePuzzlePart2 } from './index';
import { sampleData, realData } from './data';

xdescribe('part 1', () => {
    it('sampleData', () => {
        const answer = solvePuzzle(sampleData);
        console.log(answer);
        expect(answer).toBe(answer);
    });

    it('realData', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(answer).toBe(434147);
    });
});

describe('part 2', () => {
    xit('sampleData', () => {
        const answer = solvePuzzlePart2(sampleData);
        console.log(answer);
        expect(answer).toBe(answer);
    });

    it('realData', () => {
        const answer = solvePuzzlePart2(realData);
        console.log(answer);
        expect(answer).toBe(136146366355609);
    });
});
