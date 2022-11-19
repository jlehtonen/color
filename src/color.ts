import { okhslToSrgb, srgbToOkhsl } from "./okhsl.js";

export class Color {
  private readonly _h: number;
  private readonly _s: number;
  private readonly _l: number;
  private readonly _a: number;

  constructor(h: number, s: number, l: number, a = 100) {
    if (s === 0) {
      this._h = 0;
      this._s = 0;
      this._l = l;
    } else if (l === 0) {
      this._h = 0;
      this._s = 0;
      this._l = 0;
    } else if (l === 1) {
      this._h = 0;
      this._s = 0;
      this._l = 1;
    } else {
      this._h = h;
      this._s = this.clamp(0, s, 100);
      this._l = this.clamp(0, l, 100);
    }
    this._a = a;
  }

  get hex(): string {
    const hex = this.hslToHex();
    if (hex === undefined) {
      throw new Error(
        `Invalid color: ${JSON.stringify({ h: this._h, s: this._s, l: this._l })}`
      );
    }

    const alpha256 = Math.round((this._a / 100) * 255);
    if (alpha256 === 255) {
      return Color.compressHex(hex);
    }

    const alpha = alpha256.toString(16).padStart(2, "0");
    return Color.compressHex(`${hex}${alpha}`);
  }

  get rgba() {
    return Color.rgbaFromHex(this.hex);
  }

  static fromHex(hex: string) {
    const { h, s, l, a } = Color.parseHex(hex);
    if (Color.isGrayscaleHex(hex)) {
      return new Color(0, 0, l, a);
    }
    return new Color(h, s, l, a);
  }

  h(h: number) {
    return new Color(h, this._s, this._l, this._a);
  }

  s(s: number) {
    if (this._s === 0) {
      return this;
    }
    return new Color(this._h, this.clamp(0, s, 100), this._l, this._a);
  }

  l(l: number) {
    return new Color(this._h, this._s, this.clamp(0, l, 100), this._a);
  }

  a(a: number) {
    return new Color(this._h, this._s, this._l, this.clamp(0, a, 100));
  }

  dh(dh: number) {
    return this.h(this._h + dh);
  }

  ds(ds: number) {
    return this.s(this._s + ds);
  }

  dl(dl: number) {
    return this.l(this._l + dl);
  }

  da(da: number) {
    return this.a(this._a + da);
  }

  static isValidHex(hex: string) {
    return [4, 5, 7, 9].includes(hex.length) && hex.match(/^#[0-9a-f]+$/i);
  }

  static expandHex(hex: string) {
    if (!Color.isValidHex(hex)) {
      throw new Error(`Invalid hex: ${hex}`);
    }

    if (hex.length === 4) {
      const r = hex.slice(1, 2).toLowerCase();
      const g = hex.slice(2, 3).toLowerCase();
      const b = hex.slice(3, 4).toLowerCase();
      return `#${r}${r}${g}${g}${b}${b}ff`;
    }

    if (hex.length === 5) {
      const r = hex.slice(1, 2).toLowerCase();
      const g = hex.slice(2, 3).toLowerCase();
      const b = hex.slice(3, 4).toLowerCase();
      const a = hex.slice(4, 5).toLowerCase();
      return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
    }

    if (hex.length === 7) {
      return `${hex.toLowerCase()}ff`;
    }

    return hex.toLowerCase();
  }

  static compressHex(hex: string) {
    if (!Color.isValidHex(hex)) {
      throw new Error(`Invalid hex: ${hex}`);
    }

    if (hex.length === 9) {
      const r = hex.slice(1, 3).toLowerCase();
      const g = hex.slice(3, 5).toLowerCase();
      const b = hex.slice(5, 7).toLowerCase();
      const a = hex.slice(7, 9).toLowerCase();
      if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1] && a[0] === a[1]) {
        const alpha = a[0] === "f" ? "" : a[0];
        return `#${r[0]}${g[0]}${b[0]}${alpha}`;
      }

      if (a === "ff") {
        return hex.slice(0, 7).toLowerCase();
      }

      return hex.toLowerCase();
    }

    if (hex.length === 7) {
      const r = hex.slice(1, 3).toLowerCase();
      const g = hex.slice(3, 5).toLowerCase();
      const b = hex.slice(5, 7).toLowerCase();

      if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1]) {
        return `#${r[0]}${g[0]}${b[0]}`;
      }

      return hex.toLowerCase();
    }

    if (hex.length === 5 && hex[4].toLowerCase() === "f") {
      return hex.slice(0, 4).toLowerCase();
    }

    return hex.toLowerCase();
  }

  static isGrayscaleHex = (hex: string) => {
    const expandedHex = Color.expandHex(hex);
    const r = expandedHex.slice(1, 3);
    const g = expandedHex.slice(3, 5);
    const b = expandedHex.slice(5, 7);
    return r === g && g === b;
  };

  private static rgbaFromHex(hex: string) {
    const expandedHex = Color.expandHex(hex);
    const r = parseInt(expandedHex.slice(1, 3), 16) / 255;
    const g = parseInt(expandedHex.slice(3, 5), 16) / 255;
    const b = parseInt(expandedHex.slice(5, 7), 16) / 255;
    const a = parseInt(expandedHex.slice(7, 9), 16) / 255;
    return { r, g, b, a };
  }

  private hslToHex() {
    const rgb = this.hslToRgb();
    if (rgb === undefined) {
      throw new Error(`Invalid color: ${JSON.stringify(this.hsla())}`);
    }
    return Color.hexFromRgb(rgb.r, rgb.g, rgb.b);
  }

  private hslToRgb() {
    const [r, g, b] = okhslToSrgb(this._h / 100, this._s / 100, this._l / 100);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error(`Invalid color: ${JSON.stringify(this.hsla())}`);
    }
    return { r, g, b };
  }

  private static hexFromRgb(r: number, g: number, b: number) {
    const r8 = Math.max(Math.min(Math.round(r), 255), 0);
    const g8 = Math.max(Math.min(Math.round(g), 255), 0);
    const b8 = Math.max(Math.min(Math.round(b), 255), 0);
    return "#" + ((1 << 24) + (r8 << 16) + (g8 << 8) + b8).toString(16).slice(1);
  }

  private clamp(low: number, value: number, high: number) {
    return Math.min(Math.max(value, low), high);
  }

  private static parseHex(hex: string) {
    const expandedHex = Color.expandHex(hex);
    const { r, g, b, a } = Color.rgbaFromHex(expandedHex);
    const okhsl = Color.okhslFromRgb(r, g, b);
    if (okhsl === undefined) {
      throw new Error(`Invalid hex: ${hex}`);
    }
    return { ...okhsl, a: a * 100 };
  }

  private static okhslFromRgb(r: number, g: number, b: number) {
    if (r === 0 && g === 0 && b === 0) {
      return { h: 0, s: 0, l: 0 };
    }
    const [h, s, l] = srgbToOkhsl(r * 255, g * 255, b * 255);
    if (isNaN(h) || isNaN(s) || isNaN(l)) {
      return undefined;
    }
    return { h: h * 100, s: s * 100, l: l * 100 };
  }

  private hsla() {
    return { h: this._h, s: this._s, l: this._l, a: this._a };
  }
}
