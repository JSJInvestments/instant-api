import assert from 'assert';
import { Actions, Controller, FirebaseRepository } from '../src/index';

describe('InstantAPI', () => {
  it('Actions class should exist', () => {
    assert.equal(typeof Actions, 'function');
  });

  it('Controller class should exist', () => {
    assert.equal(typeof Controller, 'function');
  });

  it('FirebaseRepository class should exist', () => {
    assert.equal(typeof FirebaseRepository, 'function');
  });
});
