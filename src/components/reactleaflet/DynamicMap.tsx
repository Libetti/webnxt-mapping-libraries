// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent, useRef, useEffect} from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'
import { Icon, GeoJSON,} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { airportGeoJson } from "../../utils/utils";



const DynamicMap: FunctionComponent<{}> = () => {
	const mapRef = useRef()

	useEffect(() => {
		if(!mapRef.current){
			return
		}
		const AirportIcon = new Icon({
			iconUrl: "/airport.png",
			iconSize: [26, 26],
			popupAnchor: [0, -15],
			shadowAnchor: [13, 28]
		})
	
		const parksGeojson = new GeoJSON(airportGeoJson(), {
			pointToLayer: (feature, latlng) => {
			let label = String(feature.properties.name)
			  return L.marker(latlng, {
				icon: AirportIcon
			  }).bindTooltip(label, {permanent:true, opacity: .7}).openTooltip();
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
		  parksGeojson.addTo(mapRef.current);
	}, [])
	

	return (
		<MapContainer ref={mapRef} center={[37.8, -122.4]} zoom={5} scrollWheelZoom={false} style={{width: '100vw', height: '100vh'}}
		>
			<TileLayer
       			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        		url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      		/>
		</MapContainer>
	)
}

export default DynamicMap