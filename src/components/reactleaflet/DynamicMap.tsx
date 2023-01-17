// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DynamicMap: FunctionComponent<{}> = () => {
	return (
		<MapContainer center={[37.8, -122.4]} zoom={5} scrollWheelZoom={false} style={{width: '100vw', height: '100vh'}}
		>
			<TileLayer
       			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        		url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      		/>
		</MapContainer>
	)
}

export default DynamicMap