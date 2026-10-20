import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import './i18n';
import App from './App';

/** Static prerender: waits for every lazy section, so the HTML is complete. */
export async function render(): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk as Uint8Array));
  return Buffer.concat(chunks).toString('utf8');
}
