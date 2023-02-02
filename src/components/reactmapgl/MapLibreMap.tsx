// Install map libre and create a base map, gzip and minify the project
import React, { useState, useMemo, FunctionComponent, useRef } from "react";
import maplibregl from "maplibre-gl";
import Map, {
    Popup,
    Layer,
    Source,
    MapLayerMouseEvent,
    Marker,
} from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    airportLayerProps,
    airportGeoJson,
    generateLineString,
} from "../../utils/utils";

type MapProps = {
    baseLayer: string;
};

const MapLibreMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
    const [selectedAirport, setSelectedAirport] = useState<{
        longitude: number;
        latitude: number;
        name: string;
        type: string;
    } | null>(null);

    const AerisLayer: any = {
        id: "aerisweather-layers",
        type: "raster",
        source: "aerisweather-layers",
        minzoom: 0,
        maxzoom: 8,
    };

    const AerisSource: any = {
        id: "aerisweather-layer",
        type: "raster",
        tiles: [
            `https://maps1.aerisapi.com/${process.env["AERIS_ID"]}_${process.env["AERIS_SECRET"]}/radar-global/{z}/{x}/{y}/20160601174100.png`,
        ],
        tileSize: 256,
        attribution: '<a href="https://www.aerisweather.com/">AerisWeather</a>',
    };

    const mapRef = useRef<any>();

    const onMapLoad = ({ target: map }) => {
        map.loadImage("/airport.png", (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage("airportImage", image);
        });
    };

    const renderMarkers = useMemo<any>(() => airportGeoJson(), []);

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

    const generateAirportLineString = (e) => {
        if (mapRef.current) {
            const map = mapRef.current.getMap()
            const planeRouteSource = map.getSource("planeRoute")

            const geoJson = generateLineString(
                [e.target._lngLat.lng, e.target._lngLat.lat],
                [-122.14625730869646, 37.58590328083136],
                0
            )
            if(planeRouteSource){
                map.removeSource("planeRoute")
                map.removeLayer("planeLayer")
            }
            map.addSource("planeRoute",geoJson);
            map.addLayer({
                id: "planeLayer",
                type: "line",
                source: "planeRoute",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#11ee11",
                    "line-width": 3,
                },
            });
        }
    };

    return (
        <>
            <Map
                mapLib={maplibregl}
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 4,
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                interactiveLayerIds={["airport-markers"]}
                onLoad={onMapLoad}
                onClick={onMapClick}
                ref={mapRef}
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
                <Source key="AirportSource" type="geojson" data={renderMarkers}>
                    <Layer {...airportLayerProps()} />
                </Source>
                <Marker
                    onClick={generateAirportLineString}
                    longitude={-83.9}
                    latitude={34.27}
                    scale={40}
                >
                    <img
                        style={{ width: "26px", height: "34px" }}
                        src="/airplane.svg"
                    ></img>
                </Marker>
            </Map>
        </>
    );
};

export default MapLibreMap;