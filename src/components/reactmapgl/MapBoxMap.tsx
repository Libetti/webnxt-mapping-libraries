// Install map libre and create a base map, gzip and minify the project
import React, {useState, useMemo, FunctionComponent, useRef} from 'react';
import Map, {Popup, Layer, Source} from "react-map-gl"
// import 'mapbox-gl/dist/mapbox-gl.css';
import {airportLayerProps, airportGeoJson} from '../../utils/utils'
import * as mapsgl from '@aerisweather/mapsgl';
import '@aerisweather/mapsgl/dist/mapsgl.css';


type MapProps = {
	baseLayer: string,
}

const MapBoxMap: FunctionComponent<MapProps> = ({ baseLayer }) => {


	// const weatherLayer:any = {
	// 	id: 'WeatherLayer',
	// 	type: 'raster',
	// 	  paint: {
	// 	  'raster-opacity': 0.5
	// 	},
	// 	'background-opacity': 0.9,
	// 	minzoom: 0,
	// 	maxzoom: 22,
	//   };

	const [selectedAirport,setSelectedAirport] = useState(null)
	const mapRef = useRef<any>()
	const onMapLoad = () => {
		mapRef.current.loadImage(
			"/airport.png",
			(error, image) => {
				if (error) throw error;
				 
				// Add the image to the map style.
				mapRef.current.addImage('airportImage', image);
				 
			}
		)
		// const account = new mapsgl.Account('ket', 'secret');
		// const controller = new mapsgl.MapboxMapController(mapRef.current, { account });
		// controller.on('load', () => {
		// 	// do stuff, like add weather layers
		// 	controller.addWeatherLayer('accum-precip-1hr');
		// });
	}
	const renderMarkers = useMemo<any>(() => airportGeoJson(),[])	
	
	const onMapClick = (e) => {
		console.log(e)
	}
	return <>
		<Map
			initialViewState={{
			longitude: -122.4,
			latitude: 37.8,
			zoom: 4
		  }}
			style={{width: '100vw', height: '100vh'}}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			interactiveLayerIds={['AirportMarkers']}
			onLoad={onMapLoad}
			onClick={onMapClick}
			ref={mapRef}
			mapboxAccessToken={process.env.MAPBOX_TOKEN}
			projection="globe"
		>
			{selectedAirport && (
			<Popup longitude={selectedAirport.longitude_deg} latitude={selectedAirport.latitude_deg} ><table><thead><th>Name</th></thead><tbody><td>{selectedAirport.name}</td></tbody></table></Popup>
		)}
		<Source id="AirportMarkers" type="geojson" data={renderMarkers}>
          <Layer {...airportLayerProps()} />
        </Source>
		</Map>
	</>
}

export default MapBoxMap