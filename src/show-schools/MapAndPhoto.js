import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MapComponent from '../map/MapComponent';
import {data} from '../misc/locations';
import { useState } from 'react';
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import './MapAndPhoto.css';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { memo } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { MdOpenInNew, MdPlace } from "react-icons/md";
import { ArrowBack } from '@mui/icons-material';
import * as texts from '../misc/texts';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function MapAndPhoto({propSchoolName}){
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
      }));
      const Info = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        boxShadow:'none'
      }));
        const [schoolName, setSchoolName] = useState(propSchoolName);
        const selectedSchool = data.find((school) => school.school === schoolName);
        const navigate = useNavigate();

    return (
        <div className="map-and-photo">
             <Stack direction="row" spacing={2} sx ={{paddingLeft:'10px',paddingRight:'10px'}}>
                   
                <Item sx={{
                        width: '50%',
                        height: '75vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <ImageGallery items={selectedSchool.images} thumbnailPosition='left' />
                    <Container style = {{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"center",
                        alignItems:"center",
                        width:"100%",
                        flexWrap:"wrap",}}>
                        <Info sx={{
                            display:"flex",
                            }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <h4>{selectedSchool.school}
                                                <a href={selectedSchool.website !== "" ? selectedSchool.website : "/error404" } target="_blank" rel="noreferrer">
                                                    <MdOpenInNew />
                                                </a>
                                            </h4>
                                            <p className="place"><MdPlace />{selectedSchool.place}, {selectedSchool.land}</p>
                                        </td>
                                        <td>
                                            <div className ="courses-of-study">
                                                <h4>{texts.for_these_courses_of_study}</h4>
                                                <p>{selectedSchool.course_of_study}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Info>
                    </Container>
                </Item>

                <Item sx={{
                    width: '50%',
                    height:'75vh',
                }}>
                    <div className="small-map">
                        <MapComponent data={data} setSchoolName={setSchoolName}
                         setGoToMapAndPhoto={()=> {}} alreadyInMapAndPhoto={true}
                         mode ="partner"/>
                    </div>
                </Item>

            </Stack>
            <Button  variant ="outlined" color="secondary"
            style ={{
                position: "relative",
                margin: "5px",
                width: "fit-content",
            }}
            onClick={()=>{
                navigate('/')
              }}>
                <ArrowBack />
                {texts.back_to_main}
            </Button>
        </div>
    )
}
export default memo(MapAndPhoto);