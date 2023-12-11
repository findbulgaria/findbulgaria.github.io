import React from 'react';
import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ColorRing } from 'react-loader-spinner'
import Instructions from './instructions/Instructions';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  BrowserRouter,
  HashRouter,
} from "react-router-dom";
import Main from './main/Main';
import Partnerchools from './show-schools/Partnerschools';
import MapAndPhoto from './show-schools/MapAndPhoto';
import Play from './play/Play';
import Dialog from '@mui/material/Dialog';
import MdHelpOutline  from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import EndGame from './end-game/EndGame';
import Error404 from './errors/Error404';
import { EndResultProvider } from './misc/EndResultContext';
import * as texts from './misc/texts';
import { Backdrop, IconButton } from '@mui/material';
//import { Button } from 'react-bootstrap';

function App() {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    setTimeout(()=>{
      setLoad(false);
    },3000);
  },[]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      width: '100%',
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <EndResultProvider>
      <div className="App">
        {load ?(
          <div className='loading'>
            <ColorRing
              visible={true}
              height="60"
              width="60"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={['red','#E95A0C', '#B52483', '#000000', '#F2F2F2']}
            />
          </div>  
          ):(
            <div>
              <div className='logo'>
                <img src="logo.jpg" alt="logo" style={{
                  width: "80px",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                }}></img>
              </div>
              <div className='title-and-instructions'>
                <div className='title'>
                  <h2>{texts.title}
                  </h2>
                  <h3>{texts.second_title}</h3>
                </div>
                <div className='action-menu-instructions'>
                  
                  <Tooltip title={texts.instructions_tooltip} 
                  placement='left' open={true} arrow>
                    <IconButton 
                    color="primary" 
                    size="large" 
                    aria-label="instructions-button"
                      onClick={()=>{setOpen(!open)}}>
                      <MdHelpOutline fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Backdrop open={open}>
                    <BootstrapDialog open={open} onClose={handleClose} aria-labelledby="customized-dialog-title">
                      <Instructions close = {handleClose} />
                    </BootstrapDialog>
                  </Backdrop>
                
              </div>
                
              </div>
  
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/instructions" element={<Instructions />} />
                  <Route path="/show-schools" element={<Partnerchools />} />
                  <Route path="/play" element={<Play />} />
                  <Route path='/show-schools/MapAndPhoto' element={<MapAndPhoto />} />
                  <Route path="/end-game" element={<EndGame />} />
                  <Route path="/error404" element={<Error404 />} />
                </Routes>
              </HashRouter>
            </div>
          )
        }
      </div>
    </EndResultProvider>
  );
}

export default App;
