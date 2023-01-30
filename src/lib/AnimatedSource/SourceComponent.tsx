import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Source } from 'react-map-gl';
import { TracksClient } from './TracksClient';

type AnimationProps = {
    // 'features' could be a list of feature types to add for this source: plane, track, trail, route, etc
    features: string[],
    tracksClient: TracksClient
};

export const AnimatedSource: FunctionComponent<PropsWithChildren<AnimationProps>> = ({ children, tracksClient }) => {
    const [pointData, setPointData] = useState(null);
	useEffect(() => {
		const animation = window.requestAnimationFrame(() => {
            // how might we handle replay? do we want to replicate the "animation clock" from legacy maps?
            // for that matter, should we use a server time reference instead of depending on the client?
            const clockOffset = 120;
            const timestamp = new Date().getTime() / 1000 - clockOffset;

            const positions = tracksClient.getPositionsAt(timestamp);
            let geoJson = {
                type: 'GeometryCollection',
                geometries: positions.map((position) => {
                    return {
                        type: 'Point',
                        coordinates: position.coordinates
                    };
                })
            };
            console.log(geoJson.geometries.length);

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