// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import Map, { LayerProps, Layer } from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
// FIXME: I dunno why but this import only works if I explicitly specify the index export, which is dumb
import { TracksClient, AnimatedSource } from '../../lib/AnimatedSource/index';


// Do we couple the container logic into the map itself and just pass props to change the style?
// Alt -  the container is created in the component that consumes the map.
// Right now we'll wrap it in a div to apply styling globally

// Do we want to use a version with mapbox, do we have a license through collins that has enough seats
// Ideally we can use the base map libre package, federate all the different features of our flight pages out and then
// plug them in as we need them. I.E weather, planes, airports, fuel estimation,

type MapProps = {
	baseLayer: string,


}

// Define the layer that'll contain animated stuff
const pointLayer: LayerProps = {
	id: 'point',
	type: 'circle',
	paint: {
		'circle-radius': 5,
		'circle-color': '#007cbf'
	}
};

// Create the track client instance for the animated source
let airportClient = new TracksClient('-originOrDestination KIAH');

const MapLibreMap: FunctionComponent<MapProps> = ({ baseLayer }) => {
	return <>
		<Map
			mapLib={maplibregl}
			initialViewState={{
				longitude: -95.341389,
				latitude: 29.984444,
				zoom: 8
			  }}
			style={{width: '100vw', height: '100vh'}}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		>
			<AnimatedSource
				// the feature prop doesn't actually do anything right now, it's just illustrative
				features={['plane']}
				tracksClient={airportClient}
			>
				<Layer {...pointLayer} />
			</AnimatedSource>
		</Map>
	</>
}

export default MapLibreMap