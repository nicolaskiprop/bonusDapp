import React from 'react'
import '../App.css';
import DrawerAppBar from '../Components/Appbar/DrawerAppBar';
import VerticalLinearStepper from '../Components/Stepper/Stepper';
import { Container } from '@mui/material';
import About from '../Components/About/About'

require('dotenv').config()



function Home() {
  return (

    <>

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

   

    </>

  );
}

export default Home;
