# Storybook Angular CLI helper

Functions to configure Storybook server which based Angular CLI project.

## Install

```sh
cd your-prj-angular-cli-created
npm install --save-dev `@storybook/cli`
./node_modules/.bin/getstorybook
npm install --save-dev `@quramy/storybook-angular-cli-helper`
```

```js
/* .storybook/webpack.config.js */
const applyStorybookDefaultConfig = require('@storybook/angular/dist/server/config/defaults/webpack.config');
const { applyAngularCliConfig } = require('@quramy/storybook-angular-cli-helper');

module.exports = (baseConfig, env) =>
  applyAngularCliConfig(applyStorybookDefaultConfig(baseConfig, env));
```

## Features

- Merge Angular CLI's webpack configuration
  - Styles
    - [x] Load `*.component.css`
    - [x] Load `*.component.scss`
    - [x] Load global css
  - [x] Assets

## Example

See https://github.com/Quramy/storybook-ng-css .

## License

MIT. See LICENSE file under this repository.
