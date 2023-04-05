import React, { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM.js";

import Collection from "ol/Collection";
import { Style, Stroke, Icon } from "ol/style";
import Feature from "ol/Feature";

import { Point, LineString } from "ol/geom";
import "maplibre-gl/dist/maplibre-gl.css";
import { transform } from "ol/proj";
import { airportGeoJson, generateLineString } from "../../utils/utils";

function OLMap() {
    // set intial state

    const [map, setMap] = useState();
    const [selectedCoord, setSelectedCoord] = useState();
    const [planes, setPlanes] = useState([
        new Feature({
            geometry: new Point([-83.9, 34.27]),
        }),
    ]);
    // pull refs
    const mapElement = useRef();

    // create state ref that can be accessed in OpenLayers onclick callback function
    //  https://stackoverflow.com/a/60643670
    const mapRef = useRef();
    mapRef.current = map;

    const createPlanes = (planeCount) => {
        for (let i = 0; i < planeCount; i++) {
            push(
                new Feature({
                    geometry: new Point([
                        (Math.random() * (180 - -180) + -180).toFixed(3) * 1,
                        (Math.random() * (180 - -180) + -180).toFixed(3) * 1,
                    ]),
                })
            );
        }
    }

    // initialize map on first render - logic formerly put into componentDidMount
    useEffect(() => {
        // Airports
        let data = airportGeoJson();
        let convertedData = data.features.map(
            (f) =>
                new Feature({
                    geometry: new Point([
                        Number(f.geometry.coordinates[0]),
                        Number(f.geometry.coordinates[1]),
                    ]),
                })
        );
        var airportCollection = new Collection(convertedData);
        const airportSource = new VectorSource({
            features: airportCollection,
        });
        const initalAirportLayer = new VectorLayer({
            source: airportSource,
            style: new Style({
                image: new Icon({
                    src: "/airport.png",
                    scale: 0.05,
                }),
            }),
        });

        //Airplanes
        let planeData = planes;
        for (let i = 0; i < 10000; i++) {
            planeData.push(
                new Feature({
                    geometry: new Point([
                        (Math.random() * (180 - -180) + -180).toFixed(3) * 1,
                        (Math.random() * (180 - -180) + -180).toFixed(3) * 1,
                    ]),
                })
            );
        }

        var planeCollection = new Collection(planeData);
        const planeSource = new VectorSource({
            features: planeCollection,
        });
        const planeLayer = new VectorLayer({
            source: planeSource,
            style: new Style({
                image: new Icon({
                    src: "/airplane.svg",
                    scale: 1.5,
                }),
            }),
        });

        // LineString
        let lineData = new Feature({
            geometry: new LineString(
                generateLineString(
                    [-83.9,34.27, ],
                    [-122.1462,37.5859 ],
                    0
                ).data.geometry.coordinates
            ),
            name: "Line",
        });
        

        const lineSource = new VectorSource({
            features: [lineData],
        });
        const lineLayer = new VectorLayer({
            source: lineSource,
            style: new Style({
                stroke: new Stroke({
                    color: "green",
                    width: 1,
                }),
            }),
        });

        // create map
        const initialMap = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                initalAirportLayer,
                planeLayer,
                lineLayer,
            ],
            view: new View({
                projection: "EPSG:4326",
                center: [-122.4, 37.8],
                zoom: 4,
            }),
            controls: [],
        });

        // set map onclick handler
        initialMap.on("click", handleMapClick);
        // apply(initialMap, 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',);

        // save map and vector layer references to state
        setMap(initialMap);
    }, []);

    // map click handler
    const handleMapClick = (event) => {
        if (mapRef.current) {
            const clickedCoord = mapRef.current.getCoordinateFromPixel(
                event.pixel
            );

            // transform coord to EPSG 4326 standard Lat Long
            const transormedCoord = transform(
                clickedCoord,
                "EPSG:3857",
                "EPSG:4326"
            );

            // set React state
            setSelectedCoord(transormedCoord);

        }
        // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
        //  https://stackoverflow.com/a/60643670
    };
    // render component
    return (
        
        <div>
            <button onClick={(e) => {}}>Click me to add 10000</button>
            <div
                ref={mapElement}
                className="map-container"
                style={{ height: "90%", width: "100%", position: "absolute" }}
            ></div>
        </div>
    );
}

export default OLMap;