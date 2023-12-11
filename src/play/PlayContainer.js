import React, {useEffect, useRef, useState} from 'react';
import {Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import MapComponent from '../map/MapComponent';
import './PlayContainer.css'
import ImageGallery from "react-image-gallery";
import {data} from '../misc/locations';
import { number_of_rounds } from '../misc/const';
import { ArrowBack } from '@mui/icons-material';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEndResult } from '../misc/EndResultContext';
import * as texts from '../misc/texts';
import {toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function PlayContainer({randomPhotos}){
    const navigate = useNavigate();
    //const MemoizedMapComponent = React.memo(MapComponent);
    const {setEndResultForEndGame}  = useEndResult();
    const [endResult, setEndResult] = useState(0);

    //styling of the Item container
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    const [refresh, setRefresh] = useState(false);

    //navigation between rounds
    const [curr,setCurr] = useState(0);
    const [playedRounds,setPlayedRounds] = useState(0);
    const [photoToShow, setPhotoToShow] = useState(randomPhotos ? [randomPhotos[curr]] : []);
    const get_next_round = () => {
        if (curr < number_of_rounds-1){
            setCurr(curr + 1);
            setPlayedRounds(getPlayedRounds());
            setPhotoToShow([randomPhotos[curr + 1]]);
            guessTaken.current = false;
        }
        else{
            setEndResultForEndGame(endResult);
            initialize_mainlist();
            setRefresh(!refresh);
            navigate('/end-game');
        }
        
    }
    const get_previous_round = () =>{
        if (curr > 0){
            setCurr(curr-1);
            setPhotoToShow([randomPhotos[curr-1]]);
        }
    }
    // answer
    const answer = useRef({lng: 0, lat: 0});
    const guessTaken = useRef(false);
    const [takenRounds, setTakenRounds] = useState([null]);
    
    // take the image that is being shown
    // return the coordinates that are corresponding to this image
    const get_current_image_coordinates = (round)=>{
        var school_long = 0;
        var school_lat = 0;
        data.forEach((school)=>{
            school.images.forEach((image)=>{
                if(image.original === randomPhotos[round].original){
                    school_long = school.long;
                    school_lat= school.lat;
                }
            })
        })
        return {lng: school_long, lat: school_lat};
    }

    //keeps count of the taken rounds and regulates if the evaluation should be triggered
    const take_guess = () =>{
        if (markerToDisplay[curr] && markerToDisplay[curr][0].getLngLat() !== undefined){
            answer.current = get_current_image_coordinates(curr);
            if (!takenRounds.includes(curr)) {
                setTakenRounds([...takenRounds, curr]);
            }
            guessTaken.current=true;
            setEndResult(endResult + markerToDisplay[curr][3]);
        }
    }
    
    const mainlist =  [];
    useEffect(() => {
        initialize_mainlist();
    }, [refresh]);
    
    const initialize_mainlist = () =>{
        // for each round we create an array of array.
        // it knows the answer to each round.
        // it will save the guess for each round
        // it allows to save the answers and guesses of prevoius rounds that are already played
        mainlist.length = 0;
        for (let round = 0; round < number_of_rounds; round++) {
            var guessMarker = new maplibregl.Marker({ "color": "blue" });
            var answerCoordinates = get_current_image_coordinates(round);
            var answerMarker = new maplibregl.Marker({ "color": "red" }).setLngLat(answerCoordinates);
            var distance = 0;
            var points = null;
            const innerList = [guessMarker, answerMarker, distance, points];
            mainlist.push(innerList);
        }
    }
    //this array will communicate with the map component, so that it will be changed from it.
    // we give the map component the array with the answers
    // the map componentn will save the guesses
    const [markerToDisplay, setMarkerToDisplay] = useState(mainlist);
    const getPlayedRounds = () =>{
        var filtered = markerToDisplay.filter(round => round[0].getLngLat() !== undefined);
        return filtered.length;
    }
    const notified = useRef(false);
    const notify = ()=>{
        toast.warn(texts.warning, 
        {
            position: toast.POSITION.TOP_CENTER,
        }
        );   
        notified.current = true;
    }
    const handleGoBack = () =>{
        if(notified.current){
            navigate('/');
        }
        else {
            notify();
        }
        
    }

    return (
        <div className="play-container">
            <div className="content">
                <Stack direction="row" spacing={4} style = {{padding:'5px'}}>
                    <Item sx={{
                            width: '50%',
                        }}
                        >
                            <ImageGallery items = {photoToShow}
                             showThumbnails={false}
                             showPlayButton={false}
                             showFullscreenButton={false}
                             disableKeyDown = {true} 
                             stopPropagation={true}
                             showNav={false}/>
                            <div className="buttons-rounds">
                                <Button variant ="text"
                                    onClick={get_previous_round}
                                    disabled = {curr === 0}
                                    style = {{
                                        opacity: curr === 0 ? 0.7 : 1,
                                    }}>
                                    {texts.prev_round}
                                </Button>
                                <Button variant ="text"
                                    onClick={get_next_round}
                                    disabled = {!takenRounds.includes(curr)}
                                    style = {{
                                        opacity: !takenRounds.includes(curr) ? 0.7 : 1,
                                }}>
                                    {curr === number_of_rounds-1 ? texts.end_game: texts.next_round}
                                </Button>
                            </div>

                            <div className="progress">
                                <span>{texts.round} {curr+1}/{number_of_rounds}, </span>
                                <span>{texts.number_of_points} {endResult}</span>
                            </div>
                        <Button variant ="contained"
                        onClick={take_guess}
                        style = {{
                            margin: "5px",
                            position: "relative",
                        }}
                        disabled = {guessTaken.current || curr !== playedRounds}>
                            {texts.take_guess}
                        </Button>
                    </Item>
                    <Item sx={{
                        width: '50%',
                    }}>
                        <MapComponent 
                            alreadyInMapAndPhoto={true}
                            guessTaken={guessTaken.current} 
                            markerToDisplay ={markerToDisplay} 
                            data = {data}
                            round={curr}
                            playedRounds = {playedRounds}
                            mode = "play"/>
                    </Item>
                </Stack>
                <div className='buttons'>
                    <Button variant ="outlined" color="secondary"
                        onClick={handleGoBack}
                        style = {{
                            margin: "5px",
                        }}>
                        <ArrowBack />
                        {texts.back_to_main}
                    </Button>
                    <ToastContainer autoClose = {5000} limit ={1}/>
                </div>
            </div>
            
        </div>
    )
}
export default PlayContainer;