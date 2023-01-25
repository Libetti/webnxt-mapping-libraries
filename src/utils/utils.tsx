import MarkerSet from "../../USAirports.json";

export function airportGeoJson():any {
	return {
		"type":"FeatureCollection",
		"features": Object.keys(MarkerSet).map((airport) => {
			return {
				"type":"Feature",
				"geometry":{
					"type": "Point",
					"coordinates": [MarkerSet[airport].longitude_deg, MarkerSet[airport].latitude_deg]
				},
				"properties":{
					"name":MarkerSet[airport].name,
					"type":MarkerSet[airport].type
				},
			}
		})
	}
}

export function airportLayerProps():any {
	return {
		"id":"airport-markers",
		"type":"symbol",
		"layout": {
			"icon-image": 'airportImage',
			"icon-size" : .04,
			"text-field": ["get", "name"],
			// get the year from the source"s "year" property
			"text-font": [
				"Open Sans Semibold",
				"Arial Unicode MS Bold"
			],
			"text-size":12,
			"text-offset": [0, 1.25],
			"text-anchor": "top"
		}
	}
}