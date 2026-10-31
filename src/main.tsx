import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SITE_NAME } from './config/site';

document.title = `${SITE_NAME} · Android & Jetpack Compose`;

createRoot(document.getElementById('root')!).render(<App />);
