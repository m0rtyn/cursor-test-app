import React from 'react';
import { Provider } from 'react-redux';
import { store } from './providers/store';
import MainPage from '../pages/main/MainPage';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Theme appearance="dark">
        <MainPage />
      </Theme>
    </Provider>
  );
};

export default App;