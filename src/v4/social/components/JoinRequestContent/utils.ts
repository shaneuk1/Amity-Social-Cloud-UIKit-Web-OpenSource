const UUID_SUFFIX_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-([0-9a-fA-F]{12})$/;

type JoinRequestIdentifierSource = Pick<Amity.JoinRequest, 'userId'> &
  Partial<Pick<Amity.JoinRequest, 'requestorId' | 'requestorPublicId'>> & {
    user?: Pick<Amity.User, 'userId' | 'userPublicId'> | null;
  };

export const formatUserIdSuffix = (userId?: string | null) => {
  const normalizedUserId = userId?.trim();

  if (!normalizedUserId) return undefined;

  const uuidMatch = normalizedUserId.match(UUID_SUFFIX_REGEX);

  if (uuidMatch) {
    return uuidMatch[1];
  }

  return normalizedUserId.length <= 12 ? normalizedUserId : normalizedUserId.slice(-12);
};

export const getJoinRequestUserIdentifier = (joinRequest: JoinRequestIdentifierSource) => {
  const identifiers = [
    joinRequest.user?.userId,
    joinRequest.userId,
    joinRequest.requestorId,
    joinRequest.user?.userPublicId,
    joinRequest.requestorPublicId,
  ];

  return identifiers.find((identifier) => identifier?.trim());
};
