// module imports
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// store imports
import { store } from './app/store';

// component imports
import App from './App';


test('renders learn react link', () => {
    const { getByText } = render(
        <Provider store={store}>
            <App />
        </Provider>
    );

    expect(getByText(/learn/i)).toBeInTheDocument();
});
