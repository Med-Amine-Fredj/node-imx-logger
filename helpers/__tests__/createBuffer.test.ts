import createBuffer from "../createBuffer";

describe("createBuffer function", () => {
  it("creates a Buffer from a valid input", () => {
    const input = "test string";
    const result = createBuffer(input);
    expect(result).toBeInstanceOf(Buffer);
  });

  it("handles error and constructs the correct error payload", () => {
    const invalidInput = { key: "value" };
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const result = createBuffer(invalidInput);

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Buffer);
  });
});
