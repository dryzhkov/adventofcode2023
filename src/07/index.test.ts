import { solvePuzzle, solvePuzzlePart2 } from './index';
import { sampleData, realData } from './data';

describe('part 1', () => {
    it('sample', () => {
        const answer = solvePuzzle(realData);
        console.log(answer);
        expect(true).toBe(true);
    });

    xdescribe('part 2', () => {
        it('sample', () => {
            const answer = solvePuzzlePart2();
            console.log(answer);
            expect(true).toBe(true);
        });
    });
});
