import { FunctionComponent, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { Source } from 'react-map-gl';
import { TracksClient } from './TracksClient';
import { ClockContext } from './ClockComponent';

type FeatureType = 'plane' | 'track' | 'trail';
type FeatureGetter = (tracksClient: TracksClient, timestamp: number) => GeoJSON.GeoJSON;

type AnimationProps = {
    // 'features' could be a list of feature types to add for this source: plane, track, trail, route, etc
    feature: FeatureType,
    tracksClient: TracksClient
};

const featureGetters: Record<FeatureType, FeatureGetter> = {
    plane: (tracksClient, timestamp) => {
        const positions = tracksClient.getPositionsAt(timestamp);
        return {
            type: 'FeatureCollection',
            features: positions.map((position) => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: position.coordinates
                    },
                    properties: {
                        heading: position.heading,
                        ident: position.ident,
                        flightId: position.flightId
                    }
                };
            })
        };
    },
    track: (tracksClient, timestamp) => {
        const tracks = tracksClient.getTracksAt(timestamp);
        return {
            type: 'FeatureCollection',
            features: tracks.map((track) => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: track.map((position) => {
                            return position.coordinates;
                        })
                    },
                    properties: {
                        ident: track.ident,
                        flightId: track.flightId 
                    }
                };
            })
        };
    },
    trail: (tracksClient, timestamp) => {
        const trails = tracksClient.getTrailsAt(timestamp);
        return {
            type: 'FeatureCollection',
            features: trails.map((track) => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: track.map((position) => {
                            return position.coordinates;
                        })
                    },
                    properties: {
                        ident: track.ident,
                        flightId: track.flightId 
                    }
                };
            })
        };
    }
};

export const AnimatedSource: FunctionComponent<PropsWithChildren<AnimationProps>> = ({ children, feature, tracksClient }) => {
    const [flightData, setFlightData] = useState(null);
    const clock = useContext(ClockContext);
	useEffect(() => {
		const animation = window.requestAnimationFrame(() => {
            const timestamp = clock.getTimestamp();
            const geoJson = featureGetters[feature](tracksClient, timestamp);
            setFlightData(geoJson);
		});
		return () => window.cancelAnimationFrame(animation);
	});

    return <>
        <Source type="geojson" data={flightData}>
            {children}
        </Source>
    </>
}