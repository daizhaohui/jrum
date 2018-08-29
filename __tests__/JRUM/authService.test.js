import AuthService from '../../jrum/services/authService';


var auth;

beforeEach(() => {
  auth = new AuthService([{
      type: 't1',
      code: 't01',
      authority: [1, 2]
    },
    {
      type: 't1',
      code: 't02',
      authority: 'read'
    },
    {
      type: 't1',
      code: 't03',
      authority: ['read', 'write']
    },
    {
      type: 1,
      code: 101,
      authority: 0
    },
    {
      type: 1,
      code: 101,
      authority: 1
    },
    {
      type: 1,
      code: 102,
      authority: 1
    },
    {
      type: 1,
      code: 103,
      authority: [1, 2, 3]
    }
  ]);
});

afterEach(() => {

});

test("authService:getAuthority", () => {

  var authority = auth.getAuthority(1, 101);
  expect(authority + '').toBe('0,1');
  authority = auth.getAuthority('t1', 't01');
  expect(authority + '').toBe('1,2');
  authority = auth.getAuthority('t1', 't03');
  expect(authority + '').toBe('read,write');
  authority = auth.getAuthority(1, 102);
  expect(authority).not.toBe(1);
  expect(authority + '').toBe('1');
});

test("authService:hasAuthority", () => {

  expect(auth.hasAuthority(1, 101, 1)).toBe(true);
  expect(auth.hasAuthority(1, 101, 3)).not.toBe(true);
  expect(auth.hasAuthority('t1', 't01', 'read')).toBe(false);
  expect(auth.hasAuthority('t1', 't02', 'read')).toBe(true);
  expect(auth.hasAuthority('t1', 't03', 'write')).toBe(true);
  expect(auth.hasAuthority('t1', 't03', 'read')).toBe(true);

});

test("authService:ha or|and Authority", () => {
  expect(auth.hasAndAuthority(1, 101, [0, 1])).toBe(true);
  expect(auth.hasAndAuthority(1, 101, [0, 2])).toBe(false);
  expect(auth.hasOrAuthority(1, 101, [0, 2])).toBe(true);
  expect(auth.hasOrAuthority(1, 101, [3, 2])).toBe(false);
});