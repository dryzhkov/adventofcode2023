import { solvePuzzle, solvePuzzlePart2 } from './index';
import { sampleData, realData } from './data';

describe('part 1', () => {
    it('sample', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(true).toBe(true);
    });
});
