import {
  LICHESS_API_BASE,
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_BOTH,
  MAX_GAMES_TO_FETCH,
  ERROR_MESSAGES
} from '../../utils/constants';

/**
 * Fetch games from Lichess API
 * @param {string} username - Lichess username
 * @param {string} color - Color filter (white, black, or both)
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchLichessGames(username, color) {
  try {
    // Build URL with query parameters
    const colorParam = color === COLOR_BOTH ? '' : `&color=${color}`;
    const url = `${LICHESS_API_BASE}/games/user/${username}?max=${MAX_GAMES_TO_FETCH}&pgnInJson=false&clocks=false&evals=false&opening=false${colorParam}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/x-ndjson'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`${ERROR_MESSAGES.USERNAME_NOT_FOUND} Lichess`);
      }
      if (response.status === 429) {
        throw new Error(ERROR_MESSAGES.RATE_LIMIT);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Read response as text (ndjson format - newline-delimited JSON)
    const text = await response.text();

    if (!text || text.trim() === '') {
      throw new Error(ERROR_MESSAGES.NO_GAMES_FOUND);
    }

    // Parse ndjson - each line is a separate JSON object
    const lines = text.trim().split('\n');
    const games = [];

    for (const line of lines) {
      if (line.trim()) {
        try {
          const game = JSON.parse(line);
          const parsedGame = parseLichessGame(game, username);
          if (parsedGame) {
            games.push(parsedGame);
          }
        } catch (error) {
          console.error('Error parsing Lichess game line:', error);
        }
      }
    }

    if (games.length === 0) {
      throw new Error(ERROR_MESSAGES.NO_GAMES_FOUND);
    }

    return games;
  } catch (error) {
    if (error.message.includes(ERROR_MESSAGES.USERNAME_NOT_FOUND) ||
        error.message.includes(ERROR_MESSAGES.NO_GAMES_FOUND) ||
        error.message.includes(ERROR_MESSAGES.RATE_LIMIT)) {
      throw error;
    }
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}

/**
 * Parse Lichess game object
 * @param {Object} game - Lichess game object (from ndjson)
 * @param {string} username - Username
 * @returns {Object|null} - Parsed game object
 */
function parseLichessGame(game, username) {
  try {
    if (!game || !game.players) {
      return null;
    }

    const usernameLower = username.toLowerCase();
    const whitePlayer = game.players.white?.user?.name || game.players.white?.user?.id || 'Unknown';
    const blackPlayer = game.players.black?.user?.name || game.players.black?.user?.id || 'Unknown';

    const isWhite = whitePlayer.toLowerCase() === usernameLower;

    return {
      id: game.id,
      url: `https://lichess.org/${game.id}`,
      pgn: game.pgn || '',
      white: whitePlayer,
      black: blackPlayer,
      whiteRating: game.players.white?.rating || 0,
      blackRating: game.players.black?.rating || 0,
      result: game.winner ? (game.winner === 'white' ? '1-0' : '0-1') : '1/2-1/2',
      status: game.status || 'unknown',
      timeControl: `${game.clock?.initial || 0}+${game.clock?.increment || 0}`,
      createdAt: game.createdAt || Date.now(),
      userColor: isWhite ? 'white' : 'black',
      moves: game.moves ? game.moves.split(' ') : [],
    };
  } catch (error) {
    console.error('Error parsing Lichess game:', error);
    return null;
  }
}
