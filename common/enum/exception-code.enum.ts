export enum ExceptionCodeEnum {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,

  UserNotFound = 1010,
  UserWrongCredentials = 1011,
  UserAlreadyExists = 1012,
  UserAdminConfigNotFound = 1013,
  UserCreationError = 1016,
  UserNotUpdated = 1017,
  UserRestoreNotFound = 1018,
  UserRestoreExpired = 1019,
  UserDestroyingError = 1020,

  BalanceNotFound = 2000,
  AccountCreationError = 2001,
  BalanceNotUpdated = 2002,

  OrderNotFound = 3000,
  OrderCreationError = 3001,
  LimitPriceNotSet = 3002,
  AccountNotFound = 3003,
  InsufficientFunds = 3004,
  HoldingNotFound = 3005,
  OrderAlreadyClosed = 3006,
  OrderCancelError = 3007,
  OrderTypeUnknown = 3008,
  OrderExpired = 3009,

  AuthError = 4001,
  AlreadyVerified = 4004,
  TwoFactorVerificationNeeded = 4005,

  StrategyNotFound = 5000,
  StrategyProcessingError = 5001,

  UnknownClientType = 6009,

  SendMailError = 8000,
  OneTimePasswordAlreadySent = 8001,

  UndefinedException = 9000,
  AxiosError = 9002,
  ServerResponseTimeout = 9003,
}
