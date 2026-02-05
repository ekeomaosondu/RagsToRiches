import { fetchChessComGames } from './api/chessComApi';
import { fetchLichessGames } from './api/lichessApi';
import { PLATFORM_CHESSCOM, PLATFORM_LICHESS } from '../utils/constants';

/**
 * Unified interface for fetching games from different platforms
 * @param {Object} params - Fetch parameters
 * @param {string} params.platform - Chess platform (chesscom or lichess)
 * @param {string} params.username - Username
 * @param {string} params.color - Color filter (white, black, or both)
 * @param {string} params.accessToken - Optional OAuth access token for Lichess
 * @returns {Promise<Array>} - Array of game objects
 */
export async function fetchGames({ platform, username, color, accessToken = null }) {
  if (!platform) {
    throw new Error('Platform is required');
  }

  if (!username || username.trim() === '') {
    throw new Error('Username is required');
  }

  if (!color) {
    throw new Error('Color is required');
  }

  const trimmedUsername = username.trim();

  if (platform === PLATFORM_CHESSCOM) {
    return await fetchChessComGames(trimmedUsername, color);
  } else if (platform === PLATFORM_LICHESS) {
    return await fetchLichessGames(trimmedUsername, color, accessToken);
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Get statistics from fetched games
 * @param {Array} games - Array of game objects
 * @param {string} username - Username to get stats for
 * @returns {Object} - Statistics object
 */
export function getGameStats(games, username) {
  if (!games || games.length === 0) {
    return {
      total: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      asWhite: 0,
      asBlack: 0,
    };
  }

  const stats = {
    total: games.length,
    wins: 0,
    losses: 0,
    draws: 0,
    asWhite: 0,
    asBlack: 0,
  };

  const usernameLower = username.toLowerCase();

  games.forEach(game => {
    // Count by color
    if (game.userColor === 'white') {
      stats.asWhite++;
    } else if (game.userColor === 'black') {
      stats.asBlack++;
    }

    // Count results
    const isWhite = game.white.toLowerCase() === usernameLower;
    const result = game.result;

    if (result === '1-0') {
      if (isWhite) stats.wins++;
      else stats.losses++;
    } else if (result === '0-1') {
      if (isWhite) stats.losses++;
      else stats.wins++;
    } else {
      stats.draws++;
    }
  });

  return stats;
}
