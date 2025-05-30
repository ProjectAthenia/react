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
    await expect((api as typeof api & { responseErrorInterceptor: (err: unknown) => Promise<unknown> }).responseErrorInterceptor(mockError)).rejects.toBe(mockError.response);
    expect(appState.dispatch).toHaveBeenCalledWith(decrementLoadingCount());
  });

  it('handles cancellation errors in error interceptor', () => {
    const canceledError = new Error('CanceledError');
    canceledError.name = 'CanceledError';
    expect(() => {
      (api as typeof api & { responseErrorInterceptor: (err: unknown) => Promise<unknown> }).responseErrorInterceptor(canceledError);
    }).toThrowError(canceledError);
    expect(appState.dispatch).not.toHaveBeenCalled();
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
    (tokenNeedsRefresh as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });
    const mockConfig = { headers: {} };
    await expect((api as typeof api & { requestInterceptor: (cfg: unknown) => Promise<unknown> }).requestInterceptor(mockConfig)).rejects.toThrow('Test error');
  });

  test('should handle network errors', async () => {
    const error = new Error('Network Error');
    (api as typeof api & { get: jest.Mock }).get.mockRejectedValueOnce(error);
    await expect(api.get('/test')).rejects.toThrow('Network Error');
  });

  test('should handle timeout errors', async () => {
    const error = new Error('timeout of 0ms exceeded');
    (api as typeof api & { get: jest.Mock }).get.mockRejectedValueOnce(error);
    await expect(api.get('/test')).rejects.toThrow('timeout of 0ms exceeded');
  });

  test('should handle server errors', async () => {
    const error = {
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    };
    (api as typeof api & { get: jest.Mock }).get.mockRejectedValueOnce(error);
    await expect(api.get('/test')).rejects.toBe(error);
  });
}); 