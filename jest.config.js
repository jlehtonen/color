/**  @type {import('@jest/types').Config.ProjectConfig} */
const config = {
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
};

export default config;
