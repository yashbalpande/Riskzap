import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getConfiguredCompanyWallet, setConfiguredCompanyWallet, DEFAULT_COMPANY_WALLET } from './services/web3';

// Ensure a runtime default company wallet exists so flows work in dev without
// requiring the admin settings UI to be opened first.
try {
	const current = getConfiguredCompanyWallet();
	if (!current) {
		setConfiguredCompanyWallet(DEFAULT_COMPANY_WALLET);
	}
} catch (e) {
	// non-fatal; ignore in environments without window/localStorage
	// eslint-disable-next-line no-console
	console.debug('runtime init failed', e);
}

createRoot(document.getElementById("root")!).render(<App />);
