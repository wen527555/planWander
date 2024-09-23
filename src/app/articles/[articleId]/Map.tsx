import { LngLatBounds } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  number: number;
}

interface Route {
  color: string;
  type: string;
  coordinates: [number, number][];
}

interface MapComponentProps {
  places: Place[];
  routes: Route[];
  visiblePlace: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ places = [], routes = [], visiblePlace }) => {
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5,
  });

  const handleMapLoad = () => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      setIsMapLoaded(true);
    }
  };

  const handleStyleLoad = () => {
    setIsMapLoaded(true);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      if (map.isStyleLoaded()) {
        setIsMapLoaded(true);
      } else {
        map.on('style.load', handleStyleLoad);
        return () => {
          map.off('style.load', handleStyleLoad);
        };
      }
    }
  }, [mapRef]);

  useEffect(() => {
    if (mapRef.current && isMapLoaded && places.length > 0) {
      const bounds = new LngLatBounds();
      places.forEach((place) => bounds.extend([place.lng, place.lat]));
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [places, isMapLoaded]);

  const handleViewStateChange = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  //   console.log('visiblePlace', visiblePlace);
  useEffect(() => {
    if (visiblePlace && isMapLoaded && mapRef.current) {
      const place = places.find((p) => p.id === visiblePlace);
      if (place) {
        // console.log('place', place);
        mapRef.current.flyTo({
          center: [place.lng, place.lat],
          zoom: 14,
          speed: 1.2,
          curve: 1,
        });
      }
    }
  }, [visiblePlace, places, isMapLoaded]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        {...viewState}
        onMove={handleViewStateChange}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/wen527555/cm1em7bjb03te01rbf9st4jza"
        onLoad={handleMapLoad}
        ref={mapRef}
      >
        {isMapLoaded &&
          places?.map((place, index) => (
            <Marker
              key={index}
              longitude={place.lng}
              latitude={place.lat}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: `${place.color}`,
                //   backgroundColor: visiblePlace === place.id ? '#ff0000' : `${place.color}`, // 放大時變為紅色
                width: visiblePlace === place.id ? '50px' : '32px',
                height: visiblePlace === place.id ? '50px' : '32px',
                borderRadius: '50%',
                border: `2px solid #ffff`,
                //   width: '32px',
                //   height: '32px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '15px',
              }}
            >
              {place.number}
            </Marker>
          ))}
        {isMapLoaded &&
          routes?.map((route, index) => (
            <Source
              key={`route-${index}`}
              id={`route-${index}`}
              type="geojson"
              data={{
                type: 'Feature',
                geometry: {
                  type: route.type,
                  coordinates: route.coordinates,
                },
              }}
            >
              <Layer
                key={`route-${index}`}
                id={`route-${index}`}
                type="line"
                paint={{
                  'line-color': route.color,
                  'line-width': 5,
                }}
              />
            </Source>
          ))}
      </Map>
    </div>
  );
};

export default MapComponent;
