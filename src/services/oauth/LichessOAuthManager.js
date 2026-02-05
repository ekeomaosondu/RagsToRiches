import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { getLichessOAuthConfig } from '../../utils/constants';

/**
 * Manager for Lichess OAuth authentication
 */
class LichessOAuthManager {
  constructor() {
    this.oauth = null;
    this.accessToken = null;
    this.username = null;
  }

  /**
   * Initialize OAuth client (lazy initialization)
   */
  initializeOAuthClient() {
    if (!this.oauth) {
      this.oauth = new OAuth2AuthCodePKCE(getLichessOAuthConfig());
    }
    return this.oauth;
  }

  /**
   * Check if user is currently logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!this.accessToken;
  }

  /**
   * Get current access token
   * @returns {string|null}
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Get logged in username
   * @returns {string|null}
   */
  getUsername() {
    return this.username;
  }

  /**
   * Initialize OAuth - check for existing token or returning from OAuth flow
   * @returns {Promise<Object>} - { isLoggedIn, username }
   */
  async initialize() {
    try {
      const oauth = this.initializeOAuthClient();

      // Check if we're returning from OAuth redirect
      const hasAuthCode = window.location.search.includes('code=');

      if (hasAuthCode) {
        // Complete the OAuth flow
        const accessContext = await oauth.getAccessToken();
        this.accessToken = accessContext.token?.value;

        if (this.accessToken) {
          // Fetch username
          await this.fetchUsername();
          return {
            isLoggedIn: true,
            username: this.username
          };
        }
      } else {
        // Check for existing valid token
        const accessToken = await oauth.getAccessToken();
        if (accessToken && accessToken.token) {
          this.accessToken = accessToken.token.value;
          await this.fetchUsername();
          return {
            isLoggedIn: true,
            username: this.username
          };
        }
      }
    } catch (error) {
      console.error('OAuth initialization error:', error);
    }

    return {
      isLoggedIn: false,
      username: null
    };
  }

  /**
   * Fetch the username of the logged-in user
   * @returns {Promise<string>}
   */
  async fetchUsername() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch('https://lichess.org/api/account', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account info');
      }

      const data = await response.json();
      this.username = data.username || data.id;
      return this.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      throw error;
    }
  }

  /**
   * Start the OAuth authorization flow
   * Redirects user to Lichess login page
   */
  async login() {
    try {
      const oauth = this.initializeOAuthClient();
      await oauth.fetchAuthorizationCode();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout and clear tokens
   */
  logout() {
    this.accessToken = null;
    this.username = null;

    // Clear OAuth state
    try {
      localStorage.removeItem('oauth2authcodepkce-state');
      localStorage.removeItem('oauth2authcodepkce-verifier');
    } catch (error) {
      console.error('Error clearing OAuth state:', error);
    }
  }

  /**
   * Refresh the access token
   * @returns {Promise<string>} - New access token
   */
  async refreshToken() {
    try {
      const oauth = this.initializeOAuthClient();
      const accessContext = await oauth.getAccessToken();
      this.accessToken = accessContext.token?.value;
      return this.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
}

// Singleton instance
const lichessOAuthManager = new LichessOAuthManager();

export default lichessOAuthManager;
