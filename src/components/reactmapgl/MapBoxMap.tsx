// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';
import Map from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';


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