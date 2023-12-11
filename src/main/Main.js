import React from 'react';
import './Main.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
// import { Map } from 'react-map-gl';
// import maplibregl from 'maplibre-gl';
// import { NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import {mapStyle} from '../misc/const';
import * as texts from '../misc/texts';
import MapComponent from '../map/MapComponent';

function Main() {
  const navigate = useNavigate();

  return (
    
    <div className="Main">
      <div id="map-container">
        <div className='big-map'>
          <MapComponent />
        </div>
        <div className ="buttons">
          <Button 
            variant ="contained"
            style={{
              margin: "10px",
            }}
            onClick={()=>{
              navigate('/play', { state: { key: Math.random() } })
            }}
          >
            {texts.start_play}
          </Button>
          <Button 
            variant ="contained"
            style={{
              margin: "10px",
            }}
            onClick={()=>{
              navigate('/show-schools')
            }}
          >{texts.show_partnerschools}</Button>
        </div>
      </div>
    </div>
  );
}

export default Main;
