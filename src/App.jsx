import React from 'react'
import './App.css';
import DrawerAppBar from './Components/Appbar/DrawerAppBar';
import VerticalLinearStepper from './Components/Stepper/Stepper';
import { Container } from '@mui/material';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import About from './Components/About/About';

require('dotenv').config()

//configuring the wagmi client needed configurations

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

    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <DrawerAppBar />
          <div className="App">
            <header className="App-header">
              <Container maxWidth='lg'>
                <div style={{ border: "1px solid white", borderRadius: '20px' }}>
                  <About />
                  <div>
                    <VerticalLinearStepper />
                  </div>
                </div>

              </Container>
            </header>
          </div>

        </RainbowKitProvider>
      </WagmiConfig>

    </>

  );
}

export default App;
