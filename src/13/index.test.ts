import { solvePuzzle } from './index';
import { sampleData, realData } from './data';

describe('part 2', () => {
    xit('sampleData', () => {
        const answer = solvePuzzle(sampleData);
        console.log(answer);
        expect(answer).toBe(answer);
    });

    it('realData', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(answer).toBe(31954);
    });
});
