import { useState } from 'react';
import { fetchGames, getGameStats } from '../services/gamesFetcher';

/**
 * Custom hook for fetching chess games
 * @returns {Object} - State and methods for game fetching
 */
export function useGamesFetch() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    games: null,
    stats: null,
  });

  /**
   * Fetch games from the specified platform
   * @param {Object} formData - Form data with platform, username, and color
   * @returns {Promise<Array>} - Fetched games
   */
  const fetchGamesData = async (formData) => {
    setState({
      loading: true,
      error: null,
      games: null,
      stats: null,
    });

    try {
      const games = await fetchGames(formData);

      const stats = getGameStats(games, formData.username);

      setState({
        loading: false,
        error: null,
        games,
        stats,
      });

      return games;
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';

      setState({
        loading: false,
        error: errorMessage,
        games: null,
        stats: null,
      });

      throw error;
    }
  };

  /**
   * Reset the state
   */
  const reset = () => {
    setState({
      loading: false,
      error: null,
      games: null,
      stats: null,
    });
  };

  return {
    loading: state.loading,
    error: state.error,
    games: state.games,
    stats: state.stats,
    fetchGames: fetchGamesData,
    reset,
  };
}
