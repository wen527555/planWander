import { Autocomplete, LoadScript } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const LocationSearch: React.FC<{ onPlaceSelected: (place: Place) => void }> = ({ onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location && place.name) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onPlaceSelected({
          id: place.place_id || '',
          name: place.name || '',
          lat: lat,
          lng: lng,
        });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} libraries={['places']}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <SearchInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a place"
          style={{ width: '100%', padding: '8px' }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default LocationSearch;

const SearchInput = styled.input`
  width: 90%;
  padding: 10px;
  background-color: #f3f4f5;
  border: none;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
`;
