import { AppRegistry } from 'react-native';
import { createRoot } from 'react-dom/client';
import App from './src/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The web root element is missing.');
}

AppRegistry.registerComponent('ERP', () => App);
createRoot(rootElement).render(<App />);
