// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';
import Map, {Marker} from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerSet from '../../../USAirports.json';


type MapProps = {
	baseLayer: string,
}

const renderMarkers = () => Object.keys(MarkerSet).map((ident)=>(
	<Marker longitude={MarkerSet[ident].longitude_deg} latitude={MarkerSet[ident].latitude_deg}><img src="airport.png" width="16px" height="16px"></img> </Marker>
))

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
		>
			{renderMarkers()}
		</Map>
	</>
}

export default MapBoxMap