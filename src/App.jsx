import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HistoryTable from './Components/Table/Table';
import Home from './pages/Home';
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { SnackbarProvider } from "notistack";



const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.goerli],
  [alchemyProvider({ apiKey: "0aHuSlzbd5Vvxqr_oCEYZdSyhn9PhiRI" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "THUNDER SWAP",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
function App() {
  return (
    <div>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>

          <SnackbarProvider>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/History' element={<HistoryTable />} />
            </Routes>

          </SnackbarProvider>

        </RainbowKitProvider>



      </WagmiConfig>



    </div >
  )
}

export default App
