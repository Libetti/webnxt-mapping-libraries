import { FunctionComponent, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { Source } from 'react-map-gl';
import { TracksClient } from './TracksClient';
import { ClockContext } from './ClockComponent';

type AnimationProps = {
    // 'features' could be a list of feature types to add for this source: plane, track, trail, route, etc
    features: string[],
    tracksClient: TracksClient
};

export const AnimatedSource: FunctionComponent<PropsWithChildren<AnimationProps>> = ({ children, tracksClient }) => {
    const [pointData, setPointData] = useState(null);
    const clock = useContext(ClockContext);
	useEffect(() => {
		const animation = window.requestAnimationFrame(() => {
            const positions = tracksClient.getPositionsAt(clock.getTimestamp());
            let geoJson = {
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
                            ident: position.ident
                        }
                    };
                }),
            };

            setPointData(geoJson);
		});
		return () => window.cancelAnimationFrame(animation);
	});

    return <>
        <Source type="geojson" data={pointData}>
            {children}
        </Source>
    </>
}