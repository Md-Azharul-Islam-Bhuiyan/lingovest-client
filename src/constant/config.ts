const LIVE_API_URL = 'https://lingovest-server.vercel.app/api/v1';
const LOCAL_API_URL = 'http://localhost:5000/api/v1';

export const isLocalEnvironment = (): boolean => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.local')
    );
  }
  return !import.meta.env.PROD;
};

const resolveApiBaseUrl = (): string => {
  // If running in a browser outside of local development (e.g. lingovest.vercel.app, mobile devices),
  // NEVER allow localhost/127.0.0.1 URLs even if accidentally set in environment variables.
  if (typeof window !== 'undefined' && !isLocalEnvironment()) {
    const liveCandidate =
      import.meta.env.VITE_API_BASE_URL_LIVE ||
      import.meta.env.VITE_API_BASE_URL;

    if (
      liveCandidate &&
      typeof liveCandidate === 'string' &&
      !liveCandidate.includes('localhost') &&
      !liveCandidate.includes('127.0.0.1')
    ) {
      return liveCandidate;
    }
    return LIVE_API_URL;
  }

  // If in production build
  if (import.meta.env.PROD) {
    const liveCandidate =
      import.meta.env.VITE_API_BASE_URL_LIVE ||
      import.meta.env.VITE_API_BASE_URL;

    if (
      liveCandidate &&
      typeof liveCandidate === 'string' &&
      !liveCandidate.includes('localhost') &&
      !liveCandidate.includes('127.0.0.1')
    ) {
      return liveCandidate;
    }
    return LIVE_API_URL;
  }

  // Local development
  return (
    import.meta.env.VITE_API_BASE_URL_LOCAL ||
    import.meta.env.VITE_API_BASE_URL ||
    LOCAL_API_URL
  );
};

export const API_BASE_URL = resolveApiBaseUrl();
