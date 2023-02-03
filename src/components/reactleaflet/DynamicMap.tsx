// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent, useRef } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { Icon, GeoJSON, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { airportGeoJson, generateLineString } from "../../utils/utils";

const DynamicMap: FunctionComponent<{}> = () => {
    const mapRef = useRef();
    const onMapReady: any = ({ target }) => {
        const AirportIcon = new Icon({
            iconUrl: "/airport.png",
            iconSize: [22, 22],
            popupAnchor: [0, -15],
        });

        const AirplaneIcon = new Icon({
            iconUrl: "/airplane.svg",
            iconSize: [24, 36],
        });

        const AirplaneMarker = new Marker([34.27, -83.9], {
            icon: AirplaneIcon,
        });

        const airportsGeojson = new GeoJSON(airportGeoJson(), {
            pointToLayer: (feature, latlng) => {
                let label = String(feature.properties.name);
                return new Marker(latlng, {
                    icon: AirportIcon,
                })
                    .bindTooltip(label, {
                        permanent: true,
                        opacity: 0.7,
                        direction: "bottom",
                        className: "custom_tooltip",
                        offset: [0, 10],
                    })
                    .openTooltip();
            },
            onEachFeature: (feature, layer) => {
                if (!feature && !feature.properties.name) return;
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
            },
        });
        AirplaneMarker.addTo(target);
        airportsGeojson.addTo(target);
    };

    return (
        <MapContainer
            whenReady={onMapReady}
            ref={mapRef}
            center={[37.8, -122.4]}
            zoom={5}
            scrollWheelZoom={false}
            style={{ width: "100vw", height: "100vh" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={`https://maps1.aerisapi.com/${process.env["AERIS_ID"]}_${process.env["AERIS_SECRET"]}/radar-global/{z}/{x}/{y}/20160601174100.png`}
            />
            <Polyline
                pathOptions={{ color: "lime" }}
                positions={
                    generateLineString(
                        [-83.9, 34.27],
                        [-122.14625730869646, 37.58590328083136],
                        0
                    ).data.geometry.coordinates
                }
            />
        </MapContainer>
    );
};

export default DynamicMap;