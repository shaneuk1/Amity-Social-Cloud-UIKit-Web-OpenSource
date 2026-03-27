import { formatUserIdSuffix, getJoinRequestUserIdentifier } from './utils';

describe('formatUserIdSuffix', () => {
  test('returns the last UUID segment for canonical UUIDs', () => {
    expect(formatUserIdSuffix('123e4567-e89b-12d3-a456-426614174000')).toBe('426614174000');
  });

  test('returns the last 12 characters for non-UUID values', () => {
    expect(formatUserIdSuffix('user-prefix-abcdefghijkl')).toBe('abcdefghijkl');
  });

  test('returns the full value when it is shorter than 12 characters', () => {
    expect(formatUserIdSuffix('abc123')).toBe('abc123');
  });

  test('returns undefined when the value is missing', () => {
    expect(formatUserIdSuffix(undefined)).toBeUndefined();
    expect(formatUserIdSuffix(null)).toBeUndefined();
    expect(formatUserIdSuffix('   ')).toBeUndefined();
  });
});

describe('getJoinRequestUserIdentifier', () => {
  test('prefers the linked userId', () => {
    expect(
      getJoinRequestUserIdentifier({
        userId: 'join-request-user-id',
        requestorId: 'requestor-id',
        user: {
          userId: 'linked-user-id',
          userPublicId: 'linked-user-public-id',
        },
      }),
    ).toBe('linked-user-id');
  });

  test('falls back to join request userId and requester ids', () => {
    expect(
      getJoinRequestUserIdentifier({
        userId: 'join-request-user-id',
      }),
    ).toBe('join-request-user-id');

    expect(
      getJoinRequestUserIdentifier({
        userId: '',
        requestorId: 'requestor-id',
      }),
    ).toBe('requestor-id');
  });

  test('falls back to public ids when direct user ids are missing', () => {
    expect(
      getJoinRequestUserIdentifier({
        userId: '',
        requestorId: '',
        requestorPublicId: 'requestor-public-id',
      }),
    ).toBe('requestor-public-id');

    expect(
      getJoinRequestUserIdentifier({
        userId: '',
        user: {
          userId: '',
          userPublicId: 'linked-user-public-id',
        },
      }),
    ).toBe('linked-user-public-id');
  });
});
