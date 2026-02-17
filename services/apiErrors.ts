
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', true);
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR', true);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Invalid response from API') {
    super(message, 'VALIDATION_ERROR', false);
  }
}

export class ApiKeyError extends ApiError {
  constructor(message: string = 'API key is missing or invalid') {
    super(message, 'API_KEY_ERROR', false);
  }
}
