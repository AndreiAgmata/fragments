// tests/unit/memory.test.js
const memory = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('writeFragment() able to create a fragment and readFragment() returns matching fragment', async () => {
    const testData = { ownerId: '1234', id: '1', fragment: 'test fragment' };
    await memory.writeFragment(testData);
    const data = await memory.readFragment('1234', '1');
    expect(data).toBe(testData);
  });

  test('writeFragmentData() able to store test data in a fragment and readFragmentData() returns matching fragment data', async () => {
    const testFragment = { ownerId: '1234', id: '1', fragment: 'test fragment' };
    const testData = 'This is a test Data';
    await memory.writeFragment(testFragment);
    await memory.writeFragmentData(testFragment.ownerId, testFragment.id, testData);
    const data = await memory.readFragmentData('1234', '1');
    expect(data).toBe(testData);
  });
});
