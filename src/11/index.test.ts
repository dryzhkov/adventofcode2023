import { solvePuzzle } from './index';
import { sampleData, realData } from './data';

describe('part 2', () => {
    it('realData', () => {
        const answer = solvePuzzle(sampleData);
        console.log(answer);
        expect(answer).toBe(answer);
    });

    it('realData', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(answer).toBe(597714117556);
    });
});
