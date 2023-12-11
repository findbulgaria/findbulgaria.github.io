import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../map/MapComponent';
import './Partnerschools.css';
import {data} from '../misc/locations';
import { useState } from 'react';
import MapAndPhoto from '../show-schools/MapAndPhoto';
import { ArrowBack } from '@mui/icons-material';
import * as texts   from '../misc/texts';

function Partnerschools(){
    const navigate = useNavigate();
    const [schoolName, setSchoolName] = useState(null);
    const [goToMapAndPhoto, setGoToMapAndPhoto] = useState(false);

    return (
    !goToMapAndPhoto ? (
      <div className='partnerschools-container'>
        <div className ="note"><span>{texts.partnerschools_note}</span></div>

        <div className='big-map'>
          <MapComponent data={data} setSchoolName={setSchoolName}
           setGoToMapAndPhoto={setGoToMapAndPhoto} alreadyInMapAndPhoto={false}
           mode = "partner"/>
        </div>
        <Button variant='outlined' color="secondary"
              style = {{
                margin: "10px",
                width: "fit-content",
                position: "relative"
              }}
            onClick={()=>{
                navigate('/')
              }}>
                <ArrowBack />
                {texts.back_to_main}
          </Button>
      </div>
      ) : (
        <div className='map-and-photo'>
          <MapAndPhoto propSchoolName={schoolName} />
        </div>
      )
      
    
    )
}
export default Partnerschools;