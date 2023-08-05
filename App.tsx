import React from 'react';
import { Provider } from 'react-redux';
import store from './src/apiReducer';
import Comp from './src/comp'

const App = () => {
  return (
    <Provider store={store}>
      <Comp />
    </Provider>
  );
};

export default App;