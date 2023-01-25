// Install map libre and create a base map, gzip and minify the project
import React, {useState, useMemo, FunctionComponent, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import Map, {Popup, Layer, Source, MapLayerMouseEvent, MapRef} from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import {airportLayerProps, airportGeoJson} from '../../utils/utils'
import * as mapsgl from '@aerisweather/mapsgl';
import '@aerisweather/mapsgl/dist/mapsgl.css';
// import AirportIcon from "../../../public/airport.png"

type MapProps = {
	baseLayer: string,
}

const MapLibreMap: FunctionComponent<MapProps> = ({ baseLayer }) => {

	const weatherLayer:any = {
		id: 'WeatherLayer',
		type: 'raster',
		  paint: {
		  'raster-opacity': 0.5
		},
		'background-opacity': 0.9,
		minzoom: 0,
		maxzoom: 22,
	};

	const [selectedAirport,setSelectedAirport] = useState<{longitude:number,latitude:number, name: string, type: string} | null>(null)
	const mapRef = useRef<MapRef>()
	const onMapLoad = () => {
		mapRef.current.loadImage(
			"/airport.png",
			(error, image) => {
				if (error) throw error;
				 
				// Add the image to the map style.
				mapRef.current.addImage('airportImage', image);
				 
			}
		)
		console.log(window.navigator)

		// const account = new mapsgl.Account('key', 'secret');3
		// const controller = new mapsgl.MapboxMapController(mapRef.current.getMap(), { account });
		// controller.on('load', () => {
		// 	// do stuff, like add weather layers
		// 	controller.addWeatherLayer('accum-precip-1hr');
		// });
	}
	const renderMarkers = useMemo<any>(() => airportGeoJson(),[])	

	const onMapClick = (event: MapLayerMouseEvent) => {
		const selectedFeatures = mapRef.current.queryRenderedFeatures(event.point, {
			layers: ['airport-markers']
		});
		if(selectedFeatures.length){
			setSelectedAirport({longitude: event.lngLat.lng, latitude:event.lngLat.lat , name: selectedFeatures[0].properties.name, type:selectedFeatures[0].properties.name ,})
		}
	}

	return <>
		<Map
			mapLib={maplibregl}
			initialViewState={{
				longitude: -122.4,
				latitude: 37.8,
				zoom: 4
			}}
			style={{width: '100vw', height: '100vh'}}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			interactiveLayerIds={["airport-markers"]}
			onLoad={onMapLoad}
			onClick={onMapClick}
			ref={mapRef}
		>			
		{selectedAirport && (
			<Popup longitude={selectedAirport.longitude} latitude={selectedAirport.latitude} onClose={() => setSelectedAirport(null)}><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>{selectedAirport.name}</td></tr></tbody></table></Popup>
		)}
		<Source key="AirportSource" type="geojson" data={renderMarkers}>
          <Layer {...airportLayerProps()} />
        </Source>
		</Map>
	</>
}

export default MapLibreMap