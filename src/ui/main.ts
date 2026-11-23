import { SPECMAN_WEB_VERSION } from '../core/index.ts';

const app = document.getElementById('app')!;
app.textContent = `Specman Web ${SPECMAN_WEB_VERSION}`;
