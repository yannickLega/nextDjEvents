import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocode from "react-geocode";

export default function EventMap({ event }) {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState({
    latitude: 46.0,
    longitude: 2.0,
    zoom: 14,
  });

  useEffect(() => {
    //get latitude & longitude from address
    Geocode.fromAddress(event.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({ ...viewport, latitude: lat, longitude: lng });
        setLoading(false);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

  if (loading) return false;

  return (
    <Map
      initialViewState={{ ...viewport }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      onViewportChange={(vp) => setViewport(vp)}
      style={{ width: "100%", height: 500 }}
    >
      <Marker key={event.id} latitude={lat} longitude={lng} color="red" />
    </Map>
  );
}
