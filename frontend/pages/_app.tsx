import React, {useEffect, useMemo} from 'react'
import type {AppProps} from 'next/app'
import {Router} from 'next/router'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {ToastContainer} from 'react-toastify'
import NProgress from 'nprogress'
import {store, persistor} from '../store/store'
import {Header} from '../components/layout'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
    SolletWalletAdapter,
    SolletExtensionWalletAdapter
} from '@solana/wallet-adapter-wallets';

import { CLUSTER_API, NETWORK } from '../utils/config'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/CubeLoader.css'

export default function App ({Component, pageProps}: AppProps) {
    const network = WalletAdapterNetwork[NETWORK];

    // You can also provide a custom RPC endpoint.
    const endpoint = CLUSTER_API;

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    
    // const wallets = getWalletAdapters({network});
    const wallets = useMemo(
        () => [
        new PhantomWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
        new SolletWalletAdapter({ network }),
        new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

    NProgress.configure({showSpinner: false})
    useEffect(() => {
        Router.events.on('routeChangeStart', (url) => {
            NProgress.start()
        })

        Router.events.on('routeChangeComplete', (url) => {
            NProgress.done(false)
        })
    }, [])

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <Header/>
                            <Component {...pageProps} />
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                draggable={false}
                                closeOnClick
                                pauseOnHover
                            />
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </PersistGate>
        </Provider>
    )
}
