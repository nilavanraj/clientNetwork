import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {addPlugin} from 'react-native-flipper';

const mockAxios = axios.create();
const RequestTypes = ['post', 'put', 'patch'];
console.log('mockAxios', mockAxios);
// const mockAPI = new MockAdapter(mockAxios);
let conectionEvent = null;
const pendingResponse = [];

// Mock responses
let mockResponses = {};

addPlugin({
  getId() {
    return 'NetworkScanner';
  },
  onConnect(connection) {
    conectionEvent = connection;
    console.log("I'm connected!", pendingResponse);
    while (pendingResponse.length) {
      conectionEvent.send('updateResponse', pendingResponse.shift());
    }
    connection.send('onPingApi', {data: 'sss'});

    connection.receive('onPingApi', newData => {
      console.log('onPingApi', newData);
      mockResponses = newData;
    });
  },
  onDisconnect() {
    console.log("I'm disconnected!");
  },
  runInBackground() {
    console.log('runInBackground');
    return true;
  },
});
const findMatchingRequests = (url, method) => {
  try {
    const matches = [];
    if (mockResponses)
      for (const request of mockResponses?.requests) {
        if (request?.url === url && request?.method === method) {
          matches.push(request);
        }
      }

    return matches;
  } catch (error) {
    console.log('error error', mockResponses);
  }
};
let isMockingenble = false;

function mockNow() {
  const mockAPI = new MockAdapter(mockAxios);
  mockAPI.onAny().reply(config => {
    if (config?.url) {
      let result = findMatchingRequests(config?.url, config?.method);
      // if( RequestTypes.includes(method))
      // result = result.filter(item=>item.request==config.request)

      if (result?.length) {
        const temp = result[0].responseVariations[result[0].variant];
        console.log('mockAPI.onAny 1', temp.body);
        return [temp.status, temp.body];
      }
    }

    mockAPI.restore();
    isMockingenble = false;
    return mockAxios(config);
  });
}
mockAxios.interceptors.request.use(req => {
  if (!isMockingenble) {
    // mockNow();
    isMockingenble = true;
  }

  return req;
});
mockAxios.interceptors.response.use(config => {
  if (conectionEvent) {
    conectionEvent.send('updateResponse', res);
  } else pendingResponse.push(res);

  return new Promise((resolve, reject) => {
    const res = {
      data: 'custom dataxxxwww',
      status: 200,
      statusText: 'OK',
      headers: {'content-type': 'text/plain; charset=utf-8'},
      config,
      request: {},
    };
    setTimeout(() => {
      return resolve(res);
    }, 5000);
  });
});

const API_REQUEST = 'API_REQUEST';
const API_SUCCESS = 'API_SUCCESS';
const API_FAILURE = 'API_FAILURE';

// Action creators
const apiRequest = () => ({type: API_REQUEST});
const apiSuccess = data => ({type: API_SUCCESS, payload: data});
const apiFailure = error => ({type: API_FAILURE, payload: error});

// API thunk
export const apiThunk = number => {
  return async dispatch => {
    dispatch(apiRequest());

    try {
      // Make the API call using the modified axios instance
      const response = await mockAxios.get(
        'https://reqres.in/api/users?page=' + number,
      );
      console.log('response', response);
      // Dispatch success action with the received data
      dispatch(apiSuccess(response.data));
    } catch (error) {
      console.log('-------------------------', error);

      // Dispatch failure action with the error message
      dispatch(apiFailure(error.message));
    }
  };
};

export const apiPostThunk = postData => {
  return async dispatch => {
    dispatch(apiRequest());

    try {
      // Make the API call using the modified axios instance for POST request
      const response = await mockAxios.post(
        'https://dummy.restapiexample.com/api/v1/create',
        postData,
      );
      console.log('dispatch response', response);
      // dispatch(apiSuccess(response.data));
    } catch (error) {
      dispatch(apiFailure(error.message));
    }
  };
};
// Reducer (optional)
const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_REQUEST:
      return {...state, loading: true, error: null};
    case API_SUCCESS:
      return {...state, loading: false, data: action.payload};
    case API_FAILURE:
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};
