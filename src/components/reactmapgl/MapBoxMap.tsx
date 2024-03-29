// Install map libre and create a base map, gzip and minify the project
import React, { useState, useMemo, FunctionComponent, useRef, Profiler } from "react";
import Map, {
    Popup,
    Layer,
    Source,
    MapLayerMouseEvent,
    MapRef,
    Marker,
} from "react-map-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
import {
    airportLayerProps,
    airportGeoJson,
    generateLineString,
    createRandomPlanes,
} from "../../utils/utils";

type MapProps = {
    baseLayer: string;
};

const MapBoxMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
    let msRender = 0
    const [planeFeatures, setPlaneFeatures] = useState(createRandomPlanes(10000));
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

    const planeCollection = {
        type: "FeatureCollection",
        features: planeFeatures,
    };
    const planeSource: any = {
        id: "planeMarkerSource",
        type: "geojson",
        data: planeCollection,
    };

    const planeLayer: any = {
        id: "airplaneMarkerLayer",
        type: "symbol",
        layout: {
            "icon-image": "airplaneImage",
            "icon-size": 1.8,
        },
    };

    const generateAirportLineString = (e) => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            const planeRouteSource = map.getSource("planeRoute");

            const geoJson = generateLineString(
                [e.target._lngLat.lng, e.target._lngLat.lat],
                [-122.14625730869646, 37.58590328083136],
                0
            );
            if (planeRouteSource) {
                map.removeSource("planeRoute");
                map.removeLayer("planeLayer");
            }
            map.addSource("planeRoute", geoJson);
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

    const mapRef = useRef<MapRef>();
    const onMapLoad = ({ target: map }) => {
        map.loadImage("/airport.png", (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage("airportImage", image);
        });
        map.loadImage("/airplane.png", (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage("airplaneImage", image, { sdf: true });
        });
        const geoJson = generateLineString(
            [-83.9, 34.27],
            [-122.14625730869646, 37.58590328083136],
            0
        );
        map.addSource("planeRoute", geoJson);
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
    const addPlanes = (n: number): any =>
        setPlaneFeatures(createRandomPlanes(n));

        const handleRender = (id: string, phase: string, actualDuration: any) => {
            console.log(
                `The ${id} interaction took ` +
                    `${actualDuration}ms to render (${phase})`
            );
            msRender += actualDuration
            console.log(msRender,'accumulative')
            // Would log “The ComposeButton interaction
            // took 25.2999999970197678ms to render (update)”
        };
    return (
        <>
        <Profiler id="MapBox" onRender={handleRender}>
            <Map
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
                mapboxAccessToken={process.env.MAPBOX_TOKEN}
                projection="globe"
            >
                <button
                    style={{ position: "absolute" }}
                    onClick={() => addPlanes(10000)}
                >
                    Click me to add 10000 planes
                </button>
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
                <Source {...planeSource}>
                    <Layer {...planeLayer} />
                </Source>
            </Map>
            </Profiler>
        </>
    );
};

export default MapBoxMap;
