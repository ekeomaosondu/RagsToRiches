import axios from 'axios';
import { Chess } from 'chess.js';
import {
  CHESSCOM_API_BASE,
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_BOTH,
  MAX_GAMES_TO_FETCH,
  RECENT_MONTHS_TO_FETCH,
  ERROR_MESSAGES
} from '../../utils/constants';

/**
 * Fetch games from Chess.com API
 * @param {string} username - Chess.com username
 * @param {string} color - Color filter (white, black, or both)
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchChessComGames(username, color) {
  try {
    // Step 1: Get list of monthly archives
    const archivesUrl = `${CHESSCOM_API_BASE}/player/${username}/games/archives`;
    const archivesResponse = await axios.get(archivesUrl);

    if (!archivesResponse.data || !archivesResponse.data.archives) {
      throw new Error(ERROR_MESSAGES.NO_GAMES_FOUND);
    }

    const archives = archivesResponse.data.archives;

    if (archives.length === 0) {
      throw new Error(ERROR_MESSAGES.NO_GAMES_FOUND);
    }

    // Step 2: Get recent months (up to RECENT_MONTHS_TO_FETCH)
    const recentArchives = archives.slice(-RECENT_MONTHS_TO_FETCH);

    // Step 3: Fetch games from recent archives
    const gamesPromises = recentArchives.map(archiveUrl =>
      axios.get(archiveUrl).catch(err => {
        console.error(`Failed to fetch archive ${archiveUrl}:`, err);
        return { data: { games: [] } };
      })
    );

    const gamesResponses = await Promise.all(gamesPromises);

    // Step 4: Flatten all games from all archives
    let allGames = [];
    gamesResponses.forEach(response => {
      if (response.data && response.data.games) {
        allGames = allGames.concat(response.data.games);
      }
    });

    if (allGames.length === 0) {
      throw new Error(ERROR_MESSAGES.NO_GAMES_FOUND);
    }

    // Step 5: Filter by color and parse
    const filteredGames = filterGamesByColor(allGames, username, color);

    // Step 6: Limit to MAX_GAMES_TO_FETCH
    const limitedGames = filteredGames.slice(-MAX_GAMES_TO_FETCH);

    // Step 7: Parse and structure games
    const parsedGames = limitedGames.map(game => parseChessComGame(game, username));

    return parsedGames.filter(game => game !== null);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`${ERROR_MESSAGES.USERNAME_NOT_FOUND} Chess.com`);
    }
    if (error.response && error.response.status === 429) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT);
    }
    if (error.message) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
}

/**
 * Filter games by color
 * @param {Array} games - Array of Chess.com games
 * @param {string} username - Username to check color for
 * @param {string} color - Color filter
 * @returns {Array} - Filtered games
 */
function filterGamesByColor(games, username, color) {
  if (color === COLOR_BOTH) {
    return games;
  }

  return games.filter(game => {
    const usernameLower = username.toLowerCase();
    const isWhite = game.white && game.white.username &&
                    game.white.username.toLowerCase() === usernameLower;
    const isBlack = game.black && game.black.username &&
                    game.black.username.toLowerCase() === usernameLower;

    if (color === COLOR_WHITE) {
      return isWhite;
    } else if (color === COLOR_BLACK) {
      return isBlack;
    }
    return false;
  });
}

/**
 * Parse Chess.com game object
 * @param {Object} game - Chess.com game object
 * @param {string} username - Username
 * @returns {Object|null} - Parsed game object
 */
function parseChessComGame(game, username) {
  try {
    const chess = new Chess();

    // Load PGN if available
    if (game.pgn) {
      chess.loadPgn(game.pgn);
    }

    const usernameLower = username.toLowerCase();
    const isWhite = game.white && game.white.username &&
                    game.white.username.toLowerCase() === usernameLower;

    return {
      id: game.uuid || game.url,
      url: game.url,
      pgn: game.pgn || '',
      white: game.white?.username || 'Unknown',
      black: game.black?.username || 'Unknown',
      whiteRating: game.white?.rating || 0,
      blackRating: game.black?.rating || 0,
      result: game.white?.result || 'unknown',
      timeControl: game.time_control || 'unknown',
      endTime: game.end_time || Date.now() / 1000,
      userColor: isWhite ? 'white' : 'black',
      moves: chess.history(),
      fen: chess.fen(),
    };
  } catch (error) {
    console.error('Error parsing Chess.com game:', error);
    return null;
  }
}
