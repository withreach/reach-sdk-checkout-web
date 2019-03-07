module.exports = {
    transformIgnorePatterns: ['node_modules/'],
    transform: {
        '^.+\\.js?$': 'babel-jest'
    },
    verbose: false,
    globals: {
        NODE_ENV: 'test',
        BABEL_ENV: 'test'
    },
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['js', 'json', 'jsx'],
    // moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: ['/node_modules/'],
    rootDir: '../',
    testURL: 'https://localhost:3033',
    collectCoverage: true,
    coverageReporters: ["json", "html"]
};
