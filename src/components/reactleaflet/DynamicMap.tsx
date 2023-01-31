// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent, useRef, useEffect} from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'
import { Icon, GeoJSON, Marker} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { airportGeoJson } from "../../utils/utils";

const DynamicMap: FunctionComponent<{}> = () => {
	const mapRef = useRef()
	const onMapReady:any = ({target}) => {

		const AirportIcon = new Icon({
			iconUrl: "/airport.png",
			iconSize: [22, 22],
			popupAnchor: [0, -15],
		})
		
		const airportsGeojson = new GeoJSON(airportGeoJson(), {
			pointToLayer: (feature, latlng) => {
			let label = String(feature.properties.name)
			  return new Marker(latlng, {
				icon: AirportIcon,
				title:"hello I am a title"
			  }).bindTooltip(label, {permanent:true, opacity: .7, direction:'bottom', className:"custom_tooltip", offset:[0,10]}).openTooltip();
			},
			onEachFeature: (feature, layer) => {
			  if ( !feature && !feature.properties.name ) return;
			  layer.bindPopup(`<table>
			  <thead>
				  <tr>
					  <th>Name</th>
				  </tr>
			  </thead>
			  <tbody>
				  <tr>
					  <td>${feature.properties.name}</td>
				  </tr>
			  </tbody>
		  </table>`);
			}
		  });
		  airportsGeojson.addTo(target);
	}
	

	return (
		<MapContainer whenReady={onMapReady} ref={mapRef} center={[37.8, -122.4]} zoom={5} scrollWheelZoom={false} style={{width: '100vw', height: '100vh'}}
		>
			<TileLayer
       			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        		url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      		/>
		</MapContainer>
	)
}

export default DynamicMap