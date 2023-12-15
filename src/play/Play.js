import React from 'react';
import PlayContainer from '../play/PlayContainer';
import {data} from '../misc/locations';
import { number_of_rounds } from '../misc/const';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Play(){
  const { state } = useLocation();
  // get a number of random photos just once, so that it is remembered what photo
  // is shown in each of the rounds
    useEffect (() => {
      get_random_photos(data, number_of_rounds);
    }, []);
    const get_random_photos =(data, number) => {
      const random_photos = [];
      const usedIndexes = new Set();
      
      while (random_photos.length < number) {
          const random_index = Math.floor(Math.random() * data.length);

          if (usedIndexes.has(random_index)) {
          continue;
          }

          usedIndexes.add(random_index);

          if (data[random_index].images.length === 0) {
          continue;
          }

          const random_images = data[random_index].images;
          const random_image_index = Math.floor(Math.random() * random_images.length);
          random_photos.push(random_images[random_image_index]);
      }

      return random_photos;
    }
    
    return <div>
        <PlayContainer randomPhotos = {get_random_photos(data, number_of_rounds)} >
        </PlayContainer>
      </div>
}

export default Play;