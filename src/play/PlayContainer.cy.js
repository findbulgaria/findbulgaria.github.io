import React from 'react'
import PlayContainer from './PlayContainer'
import {data} from '../misc/locations';
import { BrowserRouter, Router } from 'react-router-dom';
import Play from './Play';
import MapComponent from '../map/MapComponent';
import { EndResultProvider } from '../misc/EndResultContext';
describe('<PlayContainer />', () => {
  it('mounts with random images', () => {
    
    const random_photos = [data[0].images[0], data[1].images[1]]
    cy.mount(
    <BrowserRouter>
      <EndResultProvider>
        <Play>
          <PlayContainer randomPhotos={random_photos}/>
        </Play>
      </EndResultProvider>
    </BrowserRouter>)
  }) 
})