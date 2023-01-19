// Install map libre and create a base map, gzip and minify the project
import React, {useState, FunctionComponent } from 'react';
import maplibregl, { Event } from 'maplibre-gl';
import Map, {Marker} from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerSet from '../../../USAirports.json';

type MapProps = {
	baseLayer: string,
}

const MapLibreMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
	
	const renderMarkers = () => Object.keys(MarkerSet).map((ident)=>(
		<Marker onClick={(e) => handleMarkerClick(e,MarkerSet[ident])} longitude={MarkerSet[ident].longitude_deg} latitude={MarkerSet[ident].latitude_deg} key={ident}><img src="airport.png" width="16px" height="16px"></img> </Marker>
	))
	
	const handleMarkerClick = (e,airport) => {
		const { originalEvent:{x, y} } = e
		setSelectedAirport({...airport, coords:{x,y}})
	}
	const [selectedAirport,setSelectedAirport] = useState(null)
	console.log(selectedAirport)

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
		>			
		{renderMarkers()}
		{selectedAirport && (
			<div style={{width:"50px", height:'50px', backgroundColor:'grey',opacity:'.67', left: selectedAirport.coords.x, top: selectedAirport.coords.y}}></div>
		)}
		</Map>
	</>
}

export default MapLibreMap