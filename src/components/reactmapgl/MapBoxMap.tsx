// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';
import maplibregl from 'maplibre-gl';
import Map from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';


// Do we couple the container logic into the map itself and just pass props to change the style?
// Alt -  the container is created in the component that consumes the map.
// Right now we'll wrap it in a div to apply styling globally

// Do we want to use a version with mapbox, do we have a license through collins that has enough seats
// Ideally we can use the base map libre package, federate all the different features of our flight pages out and then
// plug them in as we need them. I.E weather, planes, airports, fuel estimation,

type MapProps = {
	baseLayer: string,
	isFullscreen: boolean,


}

const MapBoxMap: FunctionComponent<MapProps> = ({ baseLayer, isFullscreen }) => {
	return <>
		<Map
			mapboxAccessToken={"pk.eyJ1IjoibGliZXR0aSIsImEiOiJjbGNpaG1uNTA1ZXJxM3hxbXhlb3M5YzduIn0.tTx3sPlJ5Vg2T7Mn___fOw"}
			initialViewState={{
				longitude: -122.4,
				latitude: 37.8,
				zoom: 4
			  }}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			projection="globe"
		/>
	</>
}

export default MapBoxMap