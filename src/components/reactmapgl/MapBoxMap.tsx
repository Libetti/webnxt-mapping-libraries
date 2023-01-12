// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';
import Map from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';

type MapProps = {
	baseLayer: string,
}

const MapBoxMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
	return <>
		<Map
			mapboxAccessToken={process.env.MAPBOX_TOKEN}
			initialViewState={{
				longitude: -122.4,
				latitude: 37.8,
				zoom: 4
			}}
			style={{width: '100vw', height: '100vh'}}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			projection="globe"
		/>
	</>
}

export default MapBoxMap