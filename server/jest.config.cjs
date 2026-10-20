module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],

  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
          },
          target: "es2022",
        },
        module: {
          type: "commonjs",
        },
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
