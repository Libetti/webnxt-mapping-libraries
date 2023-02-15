// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import Map, { LayerProps, Layer, Marker } from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import { TracksClient, AnimationClock, AnimatedSource } from '../../lib/AnimatedSource';


// Do we couple the container logic into the map itself and just pass props to change the style?
// Alt -  the container is created in the component that consumes the map.
// Right now we'll wrap it in a div to apply styling globally

// Do we want to use a version with mapbox, do we have a license through collins that has enough seats
// Ideally we can use the base map libre package, federate all the different features of our flight pages out and then
// plug them in as we need them. I.E weather, planes, airports, fuel estimation,

type MapProps = {
	baseLayer: string,


}

const onMapLoad = ({ target: map }) => {
	// Load the airliner PNG
	// Note: this is just the existing airliner SVG from fa_web, exported as a monochrome PNG
	map.loadImage('/airliner.png', (error, image) => {
		if (error) throw error;

		// Add the image to the map style. Specify SDF so we can color it later on.
		map.addImage('airliner', image, { sdf: true });
	});
};

// Define the layers that'll contain animated stuff
const planeLayer: LayerProps = {
	id: 'planes',
	type: 'symbol',
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'airliner',
		'icon-rotate': ['get', 'heading'],
		'text-variable-anchor': [
			'top-left',
			'top-right',
			'bottom-right',
			'bottom-left'
		],
		'text-field': ['get', 'ident'],
		'text-radial-offset': 1,
		// this means the icon will show even if we can't figure out how to deconflict its text label
		'text-optional': true
	},
	paint: {
		'icon-color': '#00FF00',
		'icon-halo-color': '#008900',
		'icon-halo-width': 5
	}
};

const trailLayer: LayerProps = {
	id: 'tracks',
	type: 'line',
	layout: {},
	paint: {
		'line-color': '#00FF00',
		'line-width': 1
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
			onLoad={onMapLoad}
		>
			<AnimationClock
				rate={60}
				offset={3600}
			>
				<AnimatedSource
					feature={'trail'}
					tracksClient={airportClient}
				>
					<Layer {...trailLayer} />
				</AnimatedSource>
				
				<AnimatedSource
					feature={'plane'}
					tracksClient={airportClient}
				>
					<Layer {...planeLayer} />
				</AnimatedSource>
			</AnimationClock>
		</Map>
	</>
}

export default MapLibreMap