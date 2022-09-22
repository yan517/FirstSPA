import React, { useCallback, useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '10px'
  };

const zoomLv = 16;  
  

export default function GMap(props) {

  const [center, setCenter] = useState({
    lat: 47.61317,
    lng: -122.33393});


  useEffect(()=>{
    setCenter({
      lat: props.display.lat,
      lng: props.display.lng})
  } ,[props]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: ""
      })
      
      const [map, setMap] = useState(null)
    
      const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        map.setZoom(16);  
        setMap(map)
      }, [])
    
      const onUnmount = useCallback(function callback(map) {
        setMap(null)
      }, [])

  return isLoaded ?(
     <GoogleMap
        zoom={zoomLv}
        mapContainerStyle={containerStyle}
        center={center}
        defaultZoom={zoomLv}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={center} />
      </GoogleMap>
    ) : <></>
}
