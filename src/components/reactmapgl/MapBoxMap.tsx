// Install map libre and create a base map, gzip and minify the project
import { map } from 'leaflet';
import React, {useState, useMemo, FunctionComponent, useRef} from 'react';
import Map, {Popup, Layer, Source,MapLayerMouseEvent, MapRef} from "react-map-gl"
// import 'mapbox-gl/dist/mapbox-gl.css';
import {airportLayerProps, airportGeoJson} from '../../utils/utils'


type MapProps = {
	baseLayer: string,
}

const MapBoxMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
    const [selectedAirport, setSelectedAirport] = useState<{
        longitude: number;
        latitude: number;
        name: string;
        type: string;
    } | null>(null);

	const AerisLayer:any = {			
		id: 'aerisweather-layers',
		type: 'raster',
		source: 'aerisweather-layers',
		minzoom: 0,
		maxzoom: 8
	}

	const AerisSource:any = {	
		id:"aerisweather-layer",
		type: 'raster',
		tiles: [
			`https://maps1.aerisapi.com/${process.env['AERIS_ID']}_${process.env['AERIS_SECRET']}/radar-global/{z}/{x}/{y}/20160601174100.png`,
		],
		tileSize: 256,
		attribution: '<a href="https://www.aerisweather.com/">AerisWeather</a>'
	}

	const mapRef = useRef<MapRef>()
    const onMapLoad = ({target:map}) => {
        map.loadImage("/airport.png", (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage("airportImage", image);
        });
    };

	const renderMarkers = useMemo<any>(() => airportGeoJson(),[])	
	
    const onMapClick = (event: MapLayerMouseEvent) => {
        const selectedFeatures = mapRef.current.queryRenderedFeatures(
            event.point,
            {
                layers: ["airport-markers"],
            }
        );
        if (selectedFeatures.length) {
            setSelectedAirport({
                longitude: event.lngLat.lng,
                latitude: event.lngLat.lat,
                name: selectedFeatures[0].properties.name,
                type: selectedFeatures[0].properties.name,
            });
        }
    };

	return <>
		<Map
			initialViewState={{
			longitude: -122.4,
			latitude: 37.8,
			zoom: 4
		  }}
			style={{width: '100vw', height: '100vh'}}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			interactiveLayerIds={['airport-markers']}
			onLoad={onMapLoad}
			onClick={onMapClick}
			ref={mapRef}
			mapboxAccessToken={process.env.MAPBOX_TOKEN}
			projection="globe"
		>
                {selectedAirport && (
                    <Popup
                        longitude={selectedAirport.longitude}
                        latitude={selectedAirport.latitude}
                        onClose={() => setSelectedAirport(null)}
                    >
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{selectedAirport.name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Popup>
                )}
								<Source key="AerisSource" {...AerisSource}>
                    <Layer {...AerisLayer} />
                </Source>
		<Source id="AirportSource" type="geojson" data={renderMarkers}>
          <Layer {...airportLayerProps()} />
        </Source>
		</Map>
	</>
}

export default MapBoxMap