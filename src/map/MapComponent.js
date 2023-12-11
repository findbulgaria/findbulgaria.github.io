import React, { useEffect} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../map/MapComponent.css';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { show_info } from '../misc/const';

function MapComponent({data, setSchoolName,
     setGoToMapAndPhoto, alreadyInMapAndPhoto,
      guessTaken, round, markerToDisplay, playedRounds, mode}){
        const mapContainer = useRef(null);
        const map = useRef(null);
        const [lng] = useState(10);
        const [lat] = useState(20);
        const [zoom] = useState(1);
        // const [API_KEY] = useState('kjQvurI9caYwwtweojCm');
        const currentMarker = useRef(null);
        const answerMarker = useRef(null);
        const isGuessTaken = useRef(guessTaken);
        const lineSource = {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: []
              },
            },
        };
        const lineLayer = {
        id: 'line',
        type: 'line',
        source: 'line-source',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': 'blue', 
            'line-width': 3,
            'line-dasharray': [2, 2],
        },
        };
        const distanceSource = {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {
               distance: 0,
              },
              geometry: {
                type: 'Point',
                coordinates: [],
              },
            },
        }
        const distanceLayer = {
            id: 'distance',
            type: 'symbol',
            source: 'distance-source',
            layout: {
              'text-field':[
                'concat',
                ['to-string', ['get', 'distance']],
                ' km',
              ],
              'text-size': 16,
              'text-anchor': 'top',
            },
            paint: {
              'text-color': 'black',
                'text-halo-color': 'white',
                'text-halo-width': 5,
                'text-halo-blur': 1,
            },
        }
        async function fetchData() {
            if (!map.current || !(map.current instanceof maplibregl.Map) || !map.current.isStyleLoaded()) {
                maptilersdk.config.apiKey = 'kjQvurI9caYwwtweojCm';
                map.current = new maplibregl.Map({
                    container: mapContainer.current,
                    //style: 'https://api.maptiler.com/maps/streets-v2/256/tiles.json?key=kjQvurI9caYwwtweojCm',
                    center: [lng, lat],
                    zoom: zoom,
                    style: 
                    {
                        version: 8,
                        name: "MapLibre Demo Tiles",
                        sprite: "https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite",
                        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                        sources: {
                            '"maplibre-streets":': {
                                type: 'raster',
                                tiles: [
                                    `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilersdk.config.apiKey}`,
                                ],
                                tileSize: 256,
                            },
                        },
                        layers: [
                            {
                                id: 'maptiler-tiles',
                                type: 'raster',
                                source: '"maplibre-streets":',
                            },
                        ],
                    },
                });
                await map.current.once('idle');
                map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
            }
        }
        useEffect(() => {
            let isMounted = true;
            
            // initialize map 
            if(isMounted){
                fetchData();
            }
            // map for the play container without data
            if(mode ==="play" && isMounted){
                // allow marker to be set only if the round is not played yet
                if(round >= playedRounds){
                    map.current.on('click', (e) => {setMarkerOnMap(e)});
                    if(isGuessTaken.current){
                        if(currentMarker.current === null && markerToDisplay[round][0].getLngLat() !== undefined){
                            setCurrentMarkerOnMap();
                        }
                        if(currentMarker.current !== null){
                            evaluateGuess();
                        }
                    }
                
                } else if(round < playedRounds){
                    // show the markers from the previous rounds
                    // allow the user to navigate back to played rounds and see results
                    showPreviousRounds();
                } 
            }

            //map for the partnerschools container with data
            else if(mode === "partner" && isMounted) {
                show_schools(data);
            }
            else{
                
            }
            return () => {
                isMounted = false;
                map.current.remove();
            }
            
        });
        
        const setMarkerOnMap = (e) => {
            if(answerMarker.current === null){
                const marker =  markerToDisplay[round][0]
                .setLngLat([e.lngLat.lng, e.lngLat.lat])
                .addTo(map.current);
                currentMarker.current = marker;
                const coordinates = [
                    markerToDisplay[round][0].getLngLat().toArray(),
                    markerToDisplay[round][1].getLngLat().toArray(),
                ];
                let distance = calculate_distance_in_km(coordinates);
                let points = calculate_points(distance);
                markerToDisplay[round][2] = distance;
                markerToDisplay[round][3] = points;
            }
        }
        const setAnswerMarkerOnMap = () =>{
            answerMarker.current = markerToDisplay[round][1];
            answerMarker.current.addTo(map.current);
            
        }
        const setCurrentMarkerOnMap = () =>{
            currentMarker.current = markerToDisplay[round][0];
            currentMarker.current.addTo(map.current);
        }
        
        const evaluateGuess = async ()=>{
            setAnswerMarkerOnMap();
            const coordinates = [
                markerToDisplay[round][0].getLngLat().toArray(),
                markerToDisplay[round][1].getLngLat().toArray(),
            ];
            isGuessTaken.current = false;
            map.current.flyTo({
                center: markerToDisplay[round][1].getLngLat().toArray(),
                zoom: 3,
                speed: 1.5,
                curve: 1,
                easing(t) {
                  return t;
                },
                essential: true,
            });
            await map.current.once('moveend').then(() => {
                setLayers(coordinates);
            });
            if(show_info){
                setInfoPopup();
            }
            console.log(markerToDisplay);
            
        }
        const showPreviousRounds = async () =>{
            await map.current.once('load');
            if(markerToDisplay[round][0].getLngLat() !== undefined){
                markerToDisplay[round][0].addTo(map.current);
                markerToDisplay[round][1].addTo(map.current);
                map.current.flyTo({
                    center: markerToDisplay[round][1].getLngLat().toArray(),
                    zoom: 3,
                    speed: 1.5,
                    curve: 1,
                    easing(t) {
                      return t;
                    },
                    essential: true,
                });
                setLayers([ markerToDisplay[round][0].getLngLat().toArray(), markerToDisplay[round][1].getLngLat().toArray()]);
                if(show_info){
                    setInfoPopup();
                }
                
            }
            
        }

        const setInfoPopup = ()=>{
            if(markerToDisplay[round][1].getLngLat() !== undefined){
                const school = getSchoolFromGeoCoordinates(markerToDisplay[round][1].getLngLat().lng, markerToDisplay[round][1].getLngLat().lat);
                const popup = new maplibregl.Popup({
                    closeButton: true,
                    closeOnClick: false,
                    anchor: 'bottom-left',
                    offset: [0, -10],
                    className: 'hover-popup'
                }).setHTML(school.info);
                popup.setLngLat(markerToDisplay[round][1].getLngLat()).addTo(map.current);
            }
        }

        const setLayers = async (coordinates) =>{
            lineSource.data.geometry.coordinates = coordinates;
            map.current.addSource('line-source', lineSource);
            map.current.addLayer(lineLayer);
            var midpoint = [(coordinates[0][0] + coordinates[1][0]) / 2,(coordinates[0][1] + coordinates[1][1]) / 2] ;
            const offset =0;
            midpoint[1] = midpoint[1] + offset;
            distanceSource.data.geometry.coordinates = midpoint;
            distanceSource.data.properties.distance = markerToDisplay[round][2];
            map.current.addSource('distance-source', distanceSource);
            map.current.addLayer(distanceLayer);
            await map.current.once('load');
        }
        const calculate_points = (distance) =>{
            if (distance < 100.0) {
                return 5;
            } if (distance < 300.0) {
                return 4;
            }  if (distance < 500.0) {
                return 3;
            }  if (distance < 800.0) {
                return 2;
            }  if( distance < 1000.0){
                return 1;
            }
            return 0;
            
        }
        // https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api?hl=en
        // calculation help
        // test https://www.movable-type.co.uk/scripts/latlong.html
        const calculate_distance_in_km = (coordinates) =>{
            const radius = 6378.14;
            var guess_lat_radians =  coordinates[0][1]* Math.PI / 180;
            var answer_lat_radians = coordinates[1][1]* Math.PI / 180;
            var difference_latitudes = answer_lat_radians - guess_lat_radians;
            var difference_longitudes = (coordinates[0][0] - coordinates[1][0]) * Math.PI / 180;
            var distance = 2*radius*Math.asin(
                Math.sqrt(
                    Math.sin(difference_latitudes/2)*Math.sin(difference_latitudes/2)+
                    Math.cos(guess_lat_radians)*Math.cos(answer_lat_radians)*
                    Math.sin(difference_longitudes/2)*Math.sin(difference_longitudes/2)
                    )
                );
            distance = distance.toFixed(2);
            return distance;
         }
            
        // place the marker from the data
        // this is relevant for the partnerschools container
        const show_schools = (data) =>{
            data.forEach((school)=>
            {
                const popup = new maplibregl.Popup({
                    closeButton: true,
                    closeOnClick: true,
                    anchor: 'bottom-left',
                    offset: [0, -10],
                    className: 'hover-popup'
                }).setHTML(school.school);

                const marker = new maplibregl.Marker();
                // or maybe it is because some chrome extension -> inkognito mode works fine
                //https://stackoverflow.com/questions/72494154/a-listener-indicated-an-asynchronous-response-by-returning-true-but-the-messag
                marker.setLngLat([school.long,school.lat]).setPopup(popup)
                .addTo(map.current);
                marker.getElement().addEventListener('click', ()=>{
                    
                    const schoolName = getSchoolNameFromGeoCoordinates(marker.getLngLat().lng, marker.getLngLat().lat);
                    setSchoolName(schoolName);
                    if(!alreadyInMapAndPhoto){
                        setGoToMapAndPhoto(true);
                    }
                }, false);
            });
        };

        const getSchoolNameFromGeoCoordinates = (lng, lat) => {
            let name = "";
            data.forEach((school) => {
                if (school.long === lng && school.lat === lat) {
                    name = school.school;
                }
            });
            return name;
        };
        const getSchoolFromGeoCoordinates = (lng, lat) => {
            let schoolRes = {};
            data.forEach((school) => {
                if (school.long === lng && school.lat === lat) {
                    schoolRes = school;
                }
            });
            return schoolRes;
        }
        
        return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map"/>
        </div>
        );
}
export default MapComponent;