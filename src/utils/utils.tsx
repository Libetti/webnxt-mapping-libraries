import MarkerSet from "../../USAirports.json";
import bezier from "@turf/bezier-spline";
import midpoint from "@turf/midpoint";
import { lineString } from "@turf/helpers";

export function airportGeoJson(): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    return {
        type: "FeatureCollection",
        features: Object.keys(MarkerSet).map((airport) => {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        MarkerSet[airport].longitude_deg,
                        MarkerSet[airport].latitude_deg,
                    ],
                },
                properties: {
                    name: MarkerSet[airport].name,
                    type: MarkerSet[airport].type,
                },
            };
        }),
    };
}

export function airportLayerProps(): any {
    return {
        id: "airport-markers",
        type: "symbol",
        layout: {
            "icon-image": "airportImage",
            "icon-size": 0.04,
            "text-field": ["get", "name"],
            // get the year from the source"s "year" property
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 1.25],
            "text-anchor": "top",
        },
    };
}

export function generateLineString(
    planeCoords: [number, number],
    airportCoords: [number, number],
    steps: number
): any {
    const coords = lineString([
        planeCoords,
        midpoint(planeCoords, airportCoords).geometry.coordinates,
        airportCoords,
    ]);
    const feature = bezier(coords);
    return {
        type: "geojson",
        data: feature,
    };
}

export function createRandomPlanes(num: number): any {
    return Array.from({ length: num }, (i) => {
        i;
    }).map(() => {
        const coords = [
            (Math.random() * (180 - -180) + -180).toFixed(3),
            (Math.random() * (180 - -180) + -180).toFixed(3),
        ];
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coords,
            },
        };
    });
}
