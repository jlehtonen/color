import { Color } from "./color.js";

test.each([
  "#000000",
  "#ffffff",
  "#ff0000",
  "#d27c65",
  "#2f3529",
  "#b3ffd3",
  "#66815f",
  "#ff0000fe",
  "#ff000000",
  "#ff0000a0",
  "#ff0000ff",
])("Unmodified color returns same hex compressed (hex = %s)", (hex) => {
  expect(Color.fromHex(hex).hex).toBe(Color.compressHex(hex));
});

test.each([
  ["#000000", 0],
  ["#000000", 100],
  ["#000000", 55],
  ["#ffffff", 94],
  ["#adadad", 241],
  ["#666666", 10],
  ["#222222", 97],
  ["#222222", 0.3],
  ["#222222aa", 0.3],
  ["#222e", 0.3],
])(
  "Setting the hue of grayscale hex returns the same hex compressed (hex = %s, h = %s)",
  (hex, h) => {
    expect(Color.fromHex(hex).h(h).hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#000000", 0],
  ["#000000", 10],
  ["#000000", 50],
  ["#ffffff", 94],
  ["#adadad", -123],
  ["#666666", -34],
  ["#222222", 947],
  ["#222222", 0.1],
  ["#222222aa", 10],
  ["#222e", -5],
])(
  "Shifting hue of grayscale hex returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(Color.fromHex(hex).dh(shift).hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#ff0000", 10],
  ["#3b644b", 34],
  ["#fc7e59", 87],
  ["#150baf", -341],
  ["#150baf", 99],
  ["#150baf", 101],
  ["#30912f", 50],
])(
  "Shifting hue of non-grayscale hex returns different hex (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).not.toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#ff0000", 0],
  ["#3b644b", 100],
  ["#fc7e59", 200],
  ["#150baf", -300],
  ["#000000", -300],
  ["#0f0f", 100],
  ["#0f00", 200],
  ["#0f08", 200],
  ["#00ff0088", 200],
])(
  "Shifting hue by multiple of 100 returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#ff0000", 10],
  ["#3b644b", 34],
  ["#fc7e59", 87],
  ["#150baf", -341],
  ["#ffffff", 29],
  ["#000000", -547],
  ["#0f0f", 100],
  ["#0f00", 200],
  ["#0f08", 200],
  ["#00ff0088", 200],
])(
  "Shifting and then unshifting hue returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift).dh(-shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#ff0000", 0],
  ["#3b644b", 100],
  ["#fc7e59", 200],
  ["#150baf", -300],
  ["#0f0f", 100],
  ["#0f00", 200],
  ["#0f08", 200],
  ["#00ff0088", 200],
])(
  "Shifting hue by multiple of 100 returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

describe("Color.isGrayscaleHex", () => {
  test.each([
    "#fff",
    "#aaa",
    "#aaa0",
    "#aaaf",
    "#000000",
    "#ffffff",
    "#adadad",
    "#666666",
    "#222222",
    "#22222212",
    "#222222ff",
    "#22222200",
  ])("returns true on grayscale hex (hex = %s)", (hex) => {
    expect(Color.isGrayscaleHex(hex)).toBe(true);
  });

  test.each(["#f00", "#aab", "#f000", "#baaf", "#000010", "#ffffef"])(
    "returns false on non-grayscale hex (hex = %s)",
    (hex) => {
      expect(Color.isGrayscaleHex(hex)).toBe(false);
    }
  );
});

test.each([
  "#000000",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
  "#0f0f",
  "#0f00",
  "#0f08",
  "#00ff0088",
])("Setting saturation to zero returns grayscale hex (hex = %s)", (hex) => {
  const newHex = Color.fromHex(hex).s(0).hex;
  expect(Color.isGrayscaleHex(newHex)).toBe(true);
});

test.each([
  ["#000000", 123],
  ["#ffffff", 6],
  ["#adadad", 334],
  ["#666666", 0.5],
  ["#222222", -23],
  ["#e0e0e0", 67],
  ["#121212", 100],
  ["#121212", 0],
  ["#121212", 1],
  ["#aaaf", 100],
  ["#0000", 200],
  ["#6668", 200],
  ["#ffffff88", 200],
])(
  "Setting saturation of grayscale hex returns the same hex compressed (hex = %s, s = %s)",
  (hex, s) => {
    expect(Color.fromHex(hex).s(s).hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#00ffff",
  "#ff00ff",
  "#ffff00",
  "#ffff00ff",
  "#ffff0000",
  "#ffff00aa",
  "#ff0a",
])(
  "Setting saturation to 100 returns maximally saturated hex compressed (hex = %s)",
  (hex) => {
    const mutedColor = Color.fromHex(hex).ds(-12.34);
    expect(mutedColor.s(100).hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#ff0000", 99],
  ["#00ff00", 90],
  ["#0000ff", -100],
  ["#00ffff", 0],
  ["#ff00ff", 50],
  ["#ffff00", 10],
  ["#ffff00ff", 10],
  ["#ffff0000", 10],
  ["#ffff00aa", 10],
  ["#ff0a", 10],
])(
  "Setting saturation to <100 returns less than maximally saturated color (hex = %s, s = %s)",
  (hex, s) => {
    const mutedColor = Color.fromHex(hex).ds(-12.34);
    expect(mutedColor.s(s).hex).not.toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#000000", 123],
  ["#ffffff", 6],
  ["#adadad", -334],
  ["#666666", 0.5],
  ["#222222", -23],
  ["#e0e0e0", 67],
  ["#121212", 100],
  ["#121212", 0],
  ["#aaaf", 100],
  ["#0000", 43],
  ["#6668", -16],
  ["#ffffff88", 200],
])(
  "Shifting saturation of grayscale hex returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(Color.fromHex(hex).ds(shift).hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  "#000000",
  "#000001",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
  "#ffff00ff",
  "#ffff0000",
  "#ffff00aa",
  "#ff0a",
  "#f0f",
])("Shifting saturation by 0 returns the same hex compressed (hex = %s)", (hex) => {
  expect(Color.fromHex(hex).ds(0).hex).toBe(Color.compressHex(hex));
});

test.each([
  ["#ff0000", 10],
  ["#00ff00", 34],
  ["#0000ff", 87],
  ["#0000ff", 1],
  ["#0000ff", 0],
  ["#ffff00ff", 10],
  ["#ffff0000", 10],
  ["#ffff00aa", 10],
  ["#ff0a", 10],
])(
  "Increasing saturation of maximally saturated hex returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).ds(shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  ["#a04fbd", -10],
  ["#aaba8f", 12],
  ["#998231", 1],
  ["#ad5776", -20],
  ["#9c6e5d", 15],
  ["#7cc97b", 0],
  ["#7cc97bff", 21],
  ["#7cc97b00", 2],
  ["#7cc97baa", -1],
  ["#7cba", 10],
])(
  "Shifting and then unshifting saturation returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).ds(shift).ds(-shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

// Lightness

test.each([
  ["#000000", "#000", 0],
  ["#000000", "#000", -10],
  ["#ffffff", "#000", -1],
  ["#ffffff", "#000", -10],
  ["#adadad", "#000", -10],
  ["#adadae", "#000", -10],
  ["#ff0000", "#000", -100],
  ["#ff0000", "#000", -10],
  ["#00ff00", "#000", -0.1],
  ["#0000ff", "#000", -0],
  ["#e4bd40", "#000", -0.0001],
  ["#f1bccd", "#000", -345935],
  ["#1de831", "#000", 0],
  ["#fc1a71", "#000", 0],
  ["#ffff00ff", "#000", -10],
  ["#ffff0000", "#0000", -10],
  ["#ffff00aa", "#000a", -10],
  ["#ffff0035", "#00000035", -10],
  ["#ff0a", "#000a", -10],
])(
  "Setting lightness to <= 0 returns black (hex = %s, l = %s)",
  (inputHex, outputHex, l) => {
    expect(Color.fromHex(inputHex).l(l).hex).toBe(outputHex);
  }
);

test.each([
  ["#000000", "#fff", 100],
  ["#ffffff", "#fff", 101],
  ["#adadad", "#fff", 100.1],
  ["#ff0000", "#fff", 1000],
  ["#00ff00", "#fff", 100.00001],
  ["#0000ff", "#fff", 123],
  ["#e4bd40", "#fff", 45634],
  ["#f1bccd", "#fff", 6734],
  ["#1de831", "#fff", 2349],
  ["#fc1a71", "#fff", 234],
  ["#ffff00ff", "#fff", 100],
  ["#ffff0000", "#fff0", 100],
  ["#ffff00aa", "#fffa", 100],
  ["#ffff0035", "#ffffff35", 100],
  ["#ff0a", "#fffa", 100],
])(
  "Setting lightness to >= 100 returns white (hex = %s, l = %s)",
  (inputHex, outputHex, l) => {
    expect(Color.fromHex(inputHex).l(l).hex).toBe(outputHex);
  }
);

test.each([
  ["#000000", 1.21],
  ["#ffffff", 1.567],
  ["#adadad", 10],
  ["#ff0000", 2],
  ["#00ff00", 99],
  ["#0000ff", 99.5],
  ["#e4bd40", 90],
  ["#f1bccd", 89],
  ["#1de831", 50],
  ["#fc1a71", 25.2341],
])(
  "Setting lightness to value in the interval [1.21, 99.5] returns hex that's not black or white (hex = %s, l = %s)",
  (hex, l) => {
    expect(["#000", "#fff"]).not.toContain(Color.fromHex(hex).l(l).hex);
  }
);

test.each([
  ["#000000", 100],
  ["#ffffff", 101],
  ["#adadad", 23],
  ["#555555", -76],
  ["#aaaaaa", 50],
  ["#232323", 0],
  ["#aaaf", 100],
  ["#0000", 43],
  ["#6668", -16],
  ["#ffffff88", 200],
])(
  "Setting lightness of a grayscale hex returns grayscale hex (hex = %s, l = %s)",
  (hex, l) => {
    expect(Color.isGrayscaleHex(Color.fromHex(hex).l(l).hex)).toBe(true);
  }
);

test.each([
  ["#000000", 12],
  ["#ffffff", -45],
  ["#adadad", 100],
  ["#555555", 10],
  ["#aaaaaa", -123],
  ["#232323", 0],
  ["#aaaf", 100],
  ["#0000", 43],
  ["#6668", -16],
  ["#ffffff88", 200],
])(
  "Shifting lightness of a grayscale hex returns grayscale hex (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(Color.isGrayscaleHex(Color.fromHex(hex).dl(shift).hex)).toBe(true);
  }
);

test.each([
  "#000000",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
  "#ffff00ff",
  "#ffff0000",
  "#ffff00aa",
  "#ffff0035",
  "#ff0a",
])("Shifting lightness by 0 returns the same hex compressed (hex = %s)", (hex) => {
  expect(Color.fromHex(hex).dl(0).hex).toBe(Color.compressHex(hex));
});

test.each([0, 1, 10, 34, 100, 1000, 123123])(
  "Increasing lightness of white returns white (shift = %s)",
  (shift) => {
    expect(Color.fromHex("#ffffff").dl(shift).hex).toBe("#fff");
  }
);

test.each([0, -1, -10, -34, -100, -1000, -123123])(
  "Decreasing lightness of black returns black (shift = %s)",
  (shift) => {
    expect(Color.fromHex("#000000").dl(shift).hex).toBe("#000");
  }
);

test.each([
  ["#a04fbd", -10],
  ["#aaba8f", 12],
  ["#998231", 1],
  ["#ad5776", -20],
  ["#9c6e5d", 15],
  ["#7cc97b", 0],
])(
  "Shifting and then unshifting lightness returns the same hex compressed (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dl(shift).dl(-shift);
    expect(color.hex).toBe(Color.compressHex(hex));
  }
);

test.each([
  "#000",
  "#fff",
  "#ABC",
  "#aBc",
  "#AbC",
  "#123",
  "#f00",
  "#aaa",
  "#0000",
  "#000f",
  "#ffff",
  "#fff0",
  "#1234",
  "#f005",
  "#aaaa",
  "#000000",
  "#ffffff",
  "#123456",
  "#11ff00",
  "#bababa",
  "#00000000",
  "#000000ff",
  "#ffffffff",
  "#ffffff00",
  "#12345678",
  "#3553e912",
  "#AAAAAAAA",
  "#ABCABCBA",
  "#FEaF123f",
])("Color.isValidHex returns true on valid hex colors (hex = %s)", (hex) => {
  expect(Color.isValidHex(hex)).toBeTruthy();
});

test.each([
  "",
  " ",
  "\n",
  "#",
  "0",
  "f",
  "#1",
  "#0",
  "#a",
  "#f",
  "#ff",
  "#fff\t",
  "#fff\n",
  "#fff#",
  "##fff",
  "##123",
  " #f00",
  "#f00 ",
  " #f00 ",
  "####",
  "0x000",
  "0xf00",
  "#ffg",
  "#00000g",
  "0x123",
  "#1231231",
  "#1231231i",
  " #123123",
  "#123123 ",
  "0x123123aa",
])("Color.isValidHex returns false on invalid hex colors (hex = %s)", (hex) => {
  expect(Color.isValidHex(hex)).not.toBeTruthy();
});

test.each([
  ["#000", "#000000ff"],
  ["#fff", "#ffffffff"],
  ["#ABC", "#aabbccff"],
  ["#aBc", "#aabbccff"],
  ["#AbC", "#aabbccff"],
  ["#123", "#112233ff"],
  ["#f00", "#ff0000ff"],
  ["#aaa", "#aaaaaaff"],
  ["#0000", "#00000000"],
  ["#000f", "#000000ff"],
  ["#000F", "#000000ff"],
  ["#ffff", "#ffffffff"],
  ["#fff0", "#ffffff00"],
  ["#1234", "#11223344"],
  ["#f005", "#ff000055"],
  ["#aaaa", "#aaaaaaaa"],
  ["#000000", "#000000ff"],
  ["#ffffff", "#ffffffff"],
  ["#123456", "#123456ff"],
  ["#11ff00", "#11ff00ff"],
  ["#bababa", "#bababaff"],
  ["#00000000", "#00000000"],
  ["#000000ff", "#000000ff"],
  ["#ffffffff", "#ffffffff"],
  ["#ffffff00", "#ffffff00"],
  ["#12345678", "#12345678"],
  ["#3553e912", "#3553e912"],
  ["#AAAAAAAA", "#aaaaaaaa"],
  ["#ABCABCBA", "#abcabcba"],
  ["#FEaF123f", "#feaf123f"],
])(
  "Color.expandHex returns correct hex (inputHex = %s, outputHex = %s)",
  (inputHex, outputHex) => {
    expect(Color.expandHex(inputHex)).toBe(outputHex);
  }
);

test.each([
  ["#000000ff", "#000"],
  ["#000000FF", "#000"],
  ["#000000Ff", "#000"],
  ["#000000fF", "#000"],
  ["#00000012", "#00000012"],
  ["#00000000", "#0000"],
  ["#aaaaaaff", "#aaa"],
  ["#123456ff", "#123456"],
  ["#123456fe", "#123456fe"],
  ["#121212ff", "#121212"],
  ["#112233ff", "#123"],
  ["#112233ee", "#123e"],
  ["#112233AA", "#123a"],
  ["#11aA33Ee", "#1a3e"],
  ["#000000", "#000"],
  ["#fFffFf", "#fff"],
  ["#fffF", "#fff"],
  ["#ff0000ff", "#f00"],
  ["#fe0000ff", "#fe0000"],
  ["#aaBBccff", "#abc"],
  ["#aaBBcc55", "#abc5"],
  ["#aaBBcc56", "#aabbcc56"],
  ["#2e67df33", "#2e67df33"],
  ["#120000aa", "#120000aa"],
])(
  "Color.compressHex returns correct hex (inputHex = %s, outputHex = %s)",
  (inputHex, outputHex) => {
    expect(Color.compressHex(inputHex)).toBe(outputHex);
  }
);

describe("Color.rgba", () => {
  test.each([
    ["#000", { r: 0, g: 0, b: 0, a: 1 }],
    ["#fff", { r: 1, g: 1, b: 1, a: 1 }],
    ["#f00", { r: 1, g: 0, b: 0, a: 1 }],
    ["#ff0", { r: 1, g: 1, b: 0, a: 1 }],
    ["#ff0f", { r: 1, g: 1, b: 0, a: 1 }],
    ["#ff00", { r: 1, g: 1, b: 0, a: 0 }],
    ["#000000", { r: 0, g: 0, b: 0, a: 1 }],
    ["#00000000", { r: 0, g: 0, b: 0, a: 0 }],
    ["#ff0000", { r: 1, g: 0, b: 0, a: 1 }],
    ["#ff000000", { r: 1, g: 0, b: 0, a: 0 }],
    ["#fe0000", { r: 254 / 255, g: 0, b: 0, a: 1 }],
  ])("returns correct rgba (hex = %s, rgba = %s)", (hex, rgba) => {
    expect(Color.fromHex(hex).rgba).toEqual(rgba);
  });
});

test.each([
  ["#000", "#000", 100],
  ["#000", "#0000", -1],
  ["#000", "#0000", -100],
  ["#000", "#0000", -343],
  ["#000", "#000", 100.1],
  ["#000", "#000", 200],
  ["#000", "#000", 100],
  ["#000", "#000", 2354],
  ["#000", "#0000", 0],
  ["#000", "#000000fe", (254 / 255) * 100],
  ["#000", "#00000001", (1 / 255) * 100],
  ["#ff0f", "#ff0", 100],
  ["#ff0f", "#ff00", 0],
  ["#000000", "#000", 100],
  ["#00000000", "#000", 100],
  ["#ff0000ab", "#f00", 100],
  ["#ff0000ab", "#f000", 0],
  ["#2e67df", "#2e67df33", 20],
])(
  "Setting alpha returns correct hex (inputHex = %s, outputHex = %s, a = %s)",
  (inputHex, outputHex, a) => {
    expect(Color.fromHex(inputHex).a(a).hex).toBe(outputHex);
  }
);

test.each([
  ["#000", "#000", 100],
  ["#000", "#0000", -100],
  ["#000", "#0000", -213],
  ["#000", "#000000fe", -(1 / 255) * 100],
  ["#000", "#000000f0", -(15 / 255) * 100],
  ["#000", "#000e", -(17 / 255) * 100],
  ["#0000", "#000", 100],
  ["#0000", "#00000001", (1 / 255) * 100],
])(
  "Shifting alpha returns correct hex (inputHex = %s, outputHex = %s, a = %s)",
  (inputHex, outputHex, a) => {
    expect(Color.fromHex(inputHex).da(a).hex).toBe(outputHex);
  }
);

test.each([
  [{ h: 0, s: 0, l: 0, a: 100 }, "#000"],
  [{ h: 0, s: 100, l: 0, a: 100 }, "#000"],
  [{ h: 0, s: 0, l: 0, a: 0 }, "#0000"],
  [{ h: 0, s: 0, l: 100, a: 100 }, "#fff"],
  [{ h: 0, s: 100, l: 100, a: 100 }, "#fff"],
  [{ h: 0, s: 0, l: 100, a: 0 }, "#fff0"],
  [{ h: 0, s: 0, l: 100 * (254 / 255), a: 100 }, "#fefefe"],
  [{ h: 0, s: 0, l: 100 * (254 / 255), a: 100 * (253 / 255) }, "#fefefefd"],
])("new Color returns correct color (input = %s, hex = %s)", ({ h, s, l, a }, hex) => {
  expect(new Color(h, s, l, a).hex).toBe(hex);
});
