import average from '../src/average';
test('average of positive numbers', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
});

test('average of negative numbers', () => {
    expect(average([-1, -2, -3, -4, -5])).toBe(-3);
});

test('type error', () => {
    expect(() => average("not an array")).toThrow(TypeError);
});