import { transformFileSync, transform } from 'babel-core';
import { expect } from 'chai';

import plugin from '../src/main';

describe('make lazy without options', () => {
  const simpleTransform = (text) => {
    return transform(text, {
      presets: ['env'],
      plugins: [[plugin]],
    }).code;
  };

  it('prefaces a single line import with bundle-loader?lazy!', () => {
    expect(
      simpleTransform('import hello from "testing"')
    ).to.contain(
      'require("bundle-loader?lazy!testing")'
    );
  });

  it('prefaces multiple lines of imports with bundle-loader?lazy!', () => {
    const result = simpleTransform(`
      import hello from "testing";
      import yo from "yo";
      import meow from "./meow";
    `);
    expect(result).to.contain('require("bundle-loader?lazy!testing")');
    expect(result).to.contain('require("bundle-loader?lazy!yo")');
    expect(result).to.contain('require("bundle-loader?lazy!./meow")');
  });
});

describe('make lazy with options', () => {
  const fileTransform = (actualFile) => {
    return transformFileSync(actualFile, {
      presets: ['env'],
      plugins: [[plugin, { paths: ['fixtures\/urls\.js'] }]],
    }).code;
  };

  it('prefaces all imports in the file with laziness', () => {
    const result = fileTransform(`${__dirname}/fixtures/urls.js`);
    expect(result).to.contain('require(\'bundle-loader?lazy!./testing\')');
    expect(result).to.contain('require(\'bundle-loader?lazy!./testing2\')');
    expect(result).to.contain('require(\'bundle-loader?lazy!./testing3\')');
  });

  it('does not preface anything since the paths do not match', () => {
    const result = fileTransform(`${__dirname}/fixtures/testing.js`);
    expect(result).not.to.contain('bundle-loader?lazy!');
  });
});

describe('make lazy with exceptions', () => {
  const fileTransform = (actualFile) => {
    return transformFileSync(actualFile, {
      presets: ['env'],
      plugins: [[plugin, {
        paths: ['fixtures\/testing\.js'],
        moduleExceptions: ['testing3'],
      }]],
    }).code;
  };

  it('does not preface when there is an exception', () => {
    const result = fileTransform(`${__dirname}/fixtures/testing.js`);
    expect(result).to.contain('bundle-loader?lazy!./testing2');
    expect(result).not.to.contain('bundle-loader?lazy!./testing3');
    expect(result).to.contain('require(\'./testing3\')');
  });
});
