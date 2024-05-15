/* eslint-disable import/no-named-as-default */
import { expect } from 'chai';
import dbClient from '../../utils/db';

describe('+ DBClient utility', () => {
  before(async function () {
    this.timeout(10000);
    await Promise.all([
      dbClient.usersCollection(),
      dbClient.filesCollection(),
    ]).then(([usersCollection, filesCollection]) => Promise.all([
      usersCollection.deleteMany({}),
      filesCollection.deleteMany({}),
    ]));
  });

  it('+ Client is alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('+ nbUsers returns the correct value', async () => {
    expect(await dbClient.nbUsers()).to.equal(0);
  });

  it('+ nbFiles returns the correct value', async () => {
    expect(await dbClient.nbFiles()).to.equal(0);
  });
});
