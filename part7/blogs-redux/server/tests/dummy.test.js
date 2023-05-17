const dummy = require('../utils/list_helper').dummy

test('dummy return one', () => {
  expect(dummy([])).toBe(1)
})