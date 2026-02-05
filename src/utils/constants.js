// Platform constants
export const PLATFORM_CHESSCOM = 'chesscom';
export const PLATFORM_LICHESS = 'lichess';

// Color constants
export const COLOR_WHITE = 'white';
export const COLOR_BLACK = 'black';
export const COLOR_BOTH = 'both';

// API Endpoints
export const CHESSCOM_API_BASE = 'https://api.chess.com/pub';
export const LICHESS_API_BASE = 'https://lichess.org/api';

// Validation rules
export const VALIDATION_RULES = {
  [PLATFORM_CHESSCOM]: {
    minLength: 3,
    maxLength: 25,
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessage: 'Username must be 3-25 characters and contain only letters, numbers, dashes, and underscores'
  },
  [PLATFORM_LICHESS]: {
    minLength: 2,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessage: 'Username must be 2-30 characters and contain only letters, numbers, dashes, and underscores'
  }
};

// API request limits
export const MAX_GAMES_TO_FETCH = 200;
export const RECENT_MONTHS_TO_FETCH = 6;

// Error messages
export const ERROR_MESSAGES = {
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_NOT_FOUND: 'Username not found on',
  NETWORK_ERROR: 'Network error. Please check your connection',
  NO_GAMES_FOUND: 'No games found for this user',
  RATE_LIMIT: 'API rate limit exceeded. Please wait and try again',
  PARSE_ERROR: 'Error parsing game data',
  UNKNOWN_ERROR: 'An unexpected error occurred'
};
