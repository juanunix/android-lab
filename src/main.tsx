import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SITE_NAME } from './config/site';
import { getStoredDesignSystem } from './context/ThemeContext';

document.title = `${SITE_NAME} · Android & Jetpack Compose`;
document.documentElement.dataset.theme = getStoredDesignSystem();

createRoot(document.getElementById('root')!).render(<App />);
