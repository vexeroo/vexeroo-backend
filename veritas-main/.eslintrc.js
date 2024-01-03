module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:ordered-imports/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'import',
    'jest',
    'ordered-imports',
    'promise',
    'unicorn',
  ],
  rules: {
    /**
     * Global rules
     */
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    'eslint-comments/disable-enable-pair': 'off',
    'import/no-unresolved': [2, { ignore: ['prisma-.*$'] }],
    'object-curly-spacing': [2, 'always'],
    // See configuration in https://www.npmjs.com/package/eslint-plugin-ordered-imports#configuration
    'ordered-imports/ordered-imports': [
      'error',
      {
        'group-ordering': [
          {
            name: 'framework libraries',
            match: '^(@nestjs/|nest-|nestjs-).*',
            order: 20,
          },
          {
            name: 'other monorepo libraries',
            match: '^(lib|svc|ui|util)-.*/src',
            order: 30,
          },
          {
            name: 'server source code',
            match: '^[$]\\/.*$',
            order: 40,
          },
          {
            name: 'test source code',
            match: '^#\\/.*$',
            order: 50,
          },
          {
            name: 'relative imports',
            match: '^\\.*/.*$',
            order: 60,
          },
          { name: 'third party', match: '.*', order: 10 },
        ],
      },
    ],
    'max-len': [
      'error',
      {
        code: 100,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2,
      },
    ],
    'no-self-assign': 'off',
    semi: ['error', 'always'],
    'unicorn/filename-case': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-null': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          args: true,
          req: true,
          Req: true,
          res: true,
          Res: true,
        },
      },
    ],
  },
  overrides: [
    {
      /**
       * JavaScript rules
       */
      files: ['**/*.js'],
      extends: ['eslint:recommended', 'plugin:node/recommended'],
    },
    {
      /**
       * TypeScript rules
       */
      files: ['**/*.ts'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          modules: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'ordered-imports'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
          },
        ],
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_+$' }],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowAny: true }],
      },
    },
    {
      /**
       * Jest rules
       */
      files: ['**/__tests__/*.{j,t}s', '**/test/**/*.{j,t}s', '**/{unit,integration}/setup.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'jest/expect-expect': [
          'error',
          {
            assertFunctionNames: ['expect', 'request.*.expect'],
          },
        ],
      },
    },
    {
      /**
       * JavaScript configuration file rules
       */
      files: ['**/*.config.{j,t}s', '**/.eslintrc.js', 'plugins/**/*.js'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'node/no-extraneous-require': 'off',
        'node/no-unpublished-require': 'off',
        'prefer-const': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  settings: {
    jest: {
      version: 'latest',
    },
  },
};
