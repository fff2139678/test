module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'], // 运行测试前可执行的脚本（比如注册enzyme的兼容）
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    // '^.+\\.css$': '<rootDir>/__test__/css-transform.js',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], //转换时需忽略的文件
  moduleNameMapper: {
    '\\.(css|less|scss|png)$': 'identity-obj-proxy',
    'bcomponents(.*)$': '<rootDir>/bcomponents/$1',
    'xcomponents(.*)$': '<rootDir>/xcomponents/$1',
    'services(.*)$': '<rootDir>/services/$1',
  },
};
