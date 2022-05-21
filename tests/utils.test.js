const { sliceArray, millisToTime } = require("../lib/utils");

describe('sliceArray', () => {
  const array = ['A', 'B', 'C', 'D', 'E', 'F'];
  const expectedResult1 = [['A', 'B'], ['C', 'D'], ['E', 'F']];
  const expectedResult2 = [['A', 'B', 'C', 'D'], ['E', 'F']];
  it("slices array into equal parts", () => {
    expect(sliceArray(array,2)).toEqual(expect.arrayContaining(expectedResult1));
  });
  it("slices array into parts, even when there are leftover elements", () => {
    expect(sliceArray(array,4)).toEqual(expect.arrayContaining(expectedResult2));
  });
});

describe('millisToTime', () => {
  it("converts milliseconds to human-readable time", () => {
    expect(millisToTime(0)).toBe("0:00");
    expect(millisToTime(30000)).toBe("0:30");
    expect(millisToTime(60000)).toBe("1:00");
    expect(millisToTime(3599000)).toBe("59:59");
    expect(millisToTime(3600000)).toBe("1:00:00");
    expect(millisToTime(7199000)).toBe("1:59:59");
    expect(millisToTime(7200000)).toBe("2:00:00");
  });

  it('throws on bad parameters', () => {
    expect(() => millisToTime(1.5)).toThrow();
    expect(() => millisToTime(1.5)).toThrowError(/^Bad parameter!$/);
    expect(() => millisToTime(-1)).toThrow();
    expect(() => millisToTime(-1)).toThrowError(/^Bad parameter!$/);
    expect(() => millisToTime("one")).toThrow();
    expect(() => millisToTime("one")).toThrowError(/^Bad parameter!$/);
  });
});