import axios from 'axios';
import { storeReceivedToken, tokenNeedsRefresh } from './AuthManager';
import { appState } from '../data/AppContext';
import { decrementLoadingCount, incrementLoadingCount } from '../data/session/session.actions';

// Import the mocked api
import api from './api';

// Mock dependencies
jest.mock('axios');
jest.mock('./AuthManager');
jest.mock('../data/AppContext');
jest.mock('../data/session/session.actions');

// Mock the API module itself
jest.mock('./api', () => {
  // Get the actual interceptor functions by running a simulation
  let requestInterceptor: any;
  let responseInterceptor: any;
  let responseErrorInterceptor: any;
  
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn((fn) => {
          requestInterceptor = fn;
          return 0;
        }),
      },
      response: {
        use: jest.fn((fn, errFn) => {
          responseInterceptor = fn;
          responseErrorInterceptor = errFn;
          return 0;
        }),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  
  const mockCreateFn = jest.fn().mockReturnValue(mockAxiosInstance);
  (axios.create as jest.Mock) = mockCreateFn;
  
  // Run the real api.ts code to set up interceptors
  jest.requireActual('./api');
  
  // Expose interceptors and mock instance for testing
  (mockAxiosInstance as any).requestInterceptor = requestInterceptor;
  (mockAxiosInstance as any).responseInterceptor = responseInterceptor;
  (mockAxiosInstance as any).responseErrorInterceptor = responseErrorInterceptor;
  
  return mockAxiosInstance;
});

describe('api service', () => {
  const mockTokenData = {
    token: 'test-token',
    receivedAt: Date.now() - 1000 * 60 * 30 // 30 minutes ago
  };

  const mockNewTokenData = {
    token: 'new-test-token',
    receivedAt: Date.now()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock appState
    (appState as any) = {
      dispatch: jest.fn(),
      state: {
        persistent: {
          tokenData: mockTokenData
        }
      }
    };
  });

  it('adds authorization header with token when making requests', async () => {
    // Set up the test
    (tokenNeedsRefresh as jest.Mock).mockReturnValue(false);
    
    const mockConfig = { headers: {} };
    
    // Call the request interceptor
    const result = await (api as any).requestInterceptor(mockConfig);
    
    // Verify
    expect(result.headers['Authorization']).toBe(`Bearer ${mockTokenData.token}`);
    expect(appState.dispatch).toHaveBeenCalledWith(incrementLoadingCount());
  });

  it('refreshes token when needed and adds new token to request', async () => {
    // Set up the test
    (tokenNeedsRefresh as jest.Mock).mockReturnValue(true);
    
    // Mock axios post for the refresh request
    const mockRefreshAxios = axios.create();
    (mockRefreshAxios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'new-test-token' }
    });
    (axios.create as jest.Mock).mockReturnValueOnce(mockRefreshAxios);
    
    // Mock token storage
    (storeReceivedToken as jest.Mock).mockResolvedValueOnce(mockNewTokenData);
    
    const mockConfig = { headers: {} };
    
    // Call the request interceptor
    const result = await (api as any).requestInterceptor(mockConfig);
    
    // Verify
    expect(result.headers['Authorization']).toBe(`Bearer ${mockNewTokenData.token}`);
    expect(appState.dispatch).toHaveBeenCalledWith(incrementLoadingCount());
  });

  it('decrements loading count on successful response', () => {
    const mockResponse = { data: 'test data' };
    
    // Call the response interceptor
    const result = (api as any).responseInterceptor(mockResponse);
    
    // Verify
    expect(appState.dispatch).toHaveBeenCalledWith(decrementLoadingCount());
    expect(result).toBe(mockResponse);
  });

  it('decrements loading count on error response', async () => {
    const mockError = {
      response: { data: 'error data' }
    };
    
    // Call the error interceptor
    try {
      await (api as any).responseErrorInterceptor(mockError);
      fail('Should have thrown an error');
    } catch (error) {
      // Verify
      expect(appState.dispatch).toHaveBeenCalledWith(decrementLoadingCount());
      expect(error).toBe(mockError.response);
    }
  });

  it('handles cancellation errors in error interceptor', async () => {
    const canceledError = {
      name: 'CanceledError',
    };
    
    // Call the error interceptor
    try {
      await (api as any).responseErrorInterceptor(canceledError);
      fail('Should have thrown an error');
    } catch (error) {
      // Verify cancellation errors are rethrown without decrementLoadingCount
      expect(error).toBe(canceledError);
      expect(appState.dispatch).not.toHaveBeenCalled();
    }
  });

  it('handles case when tokenData is not available', async () => {
    // Set up the test with null tokenData
    (appState as any).state.persistent.tokenData = null;
    
    const mockConfig = { headers: {} };
    
    // Call the request interceptor
    const result = await (api as any).requestInterceptor(mockConfig);
    
    // Verify
    expect(result.headers['Authorization']).toBeUndefined();
    expect(appState.dispatch).toHaveBeenCalledWith(incrementLoadingCount());
  });

  it('handles errors in the request interceptor', async () => {
    // Set up the test to throw an error
    (tokenNeedsRefresh as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const mockConfig = { headers: {} };
    
    // Call the request interceptor and expect it to throw
    try {
      await (api as any).requestInterceptor(mockConfig);
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toBe('Test error');
    }
  });
}); 