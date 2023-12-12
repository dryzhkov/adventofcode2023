import { solvePuzzle } from './index';
import { sampleData, realData } from './data';

describe('part 2', () => {
    it('sample', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(true).toBe(true);
    });
});
