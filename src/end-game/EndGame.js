import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { number_of_rounds } from '../misc/const';
import { useEndResult } from '../misc/EndResultContext';
import * as texts from '../misc/texts';
import './EndGame.css';

function EndGame(){
    const navigate = useNavigate();
    const { endResultForEndGame } = useEndResult();
    return (
       <div className='end-game'>
            <div className='end-game-content'>
                <h2>{texts.end_game_h2}</h2>
                <h3>{texts.end_game_h3}</h3>
                <p>{texts.end_game_p1} <b>{number_of_rounds}</b> {texts.end_game_p2} <b>{endResultForEndGame}</b> {texts.end_game_p3} <b>{number_of_rounds*5} </b>{texts.end_game_p4}</p>
                <Button  variant ="contained"
                style ={{
                    position: "relative",
                    margin: "10px",
                    width: "fit-content",
                }}
                onClick={()=>{
                    navigate('/play',  { state: { refresh: true } });
                  }}>
                    {texts.play_again}
                </Button>
                <Button  variant ="outlined" color="secondary"
                style ={{
                    position: "relative",
                    margin: "10px",
                    width: "fit-content",
                }}
                onClick={()=>{
                    navigate('/')
                  }}>
                    <ArrowBack />
                    {texts.back_to_main}
                </Button>
            </div>
       </div>
    )
}
export default EndGame;