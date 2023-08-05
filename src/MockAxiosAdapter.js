import axios from 'axios';

class MockAxiosAdapter {
  constructor() {
    this.delay = 0;
    this.response = null;
  }

  setDelay(ms) {
    this.delay = ms;
  }

  setResponse(response) {
    this.response = response;
  }

  async delayResponse() {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    return this.response;
  }

  async request(config) {
    const status = 200; // Success status code
    const responseData = this.response;
    const response = { data: responseData, status, statusText: 'OK', headers: {}, config };
    return this.delayResponse().then(() => response);
  }
}

// Create the custom Axios instance with the integrated mock adapter
const axiosInstanceWithMock = axios.create();
const mockAdapter = new MockAxiosAdapter();

// Set the default adapter to the custom mock adapter
axiosInstanceWithMock.defaults.adapter = mockAdapter;

export default axiosInstanceWithMock;
