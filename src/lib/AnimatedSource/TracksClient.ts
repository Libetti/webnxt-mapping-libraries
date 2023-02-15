/**
 * For simplicity's sake, this POC assumes that we'll spawn one TracksClient
 * instance for each topic subscription. That might not be the most efficient
 * path to take in reality, though - it's possible there might be cause here
 * to have some sort of singleton object that does the actual backend querying.
 * 
 * For this stub, we'll just be polling TrackPoll periodically and mass updating
 * the tracks data. In reality, we'd likely be subscribing to GraphQL updates and
 * doing piecewise updates of that tracks data instead.
 */
type ConstantSegmentFn = {
    type: 'constant',
    c: number
};
type LinearSegmentFn = {
    type: 'linear',
    m: number,
    b: number
};
type SegmentFn = ConstantSegmentFn | LinearSegmentFn;
type Segment = {
    altFn: SegmentFn,
    gsFn: SegmentFn,
    headingFn: SegmentFn,
    // These really should be the generic SegmentFn but to make this POC work without complexity we need to narrow the type
    latFn: LinearSegmentFn,
    lonFn: LinearSegmentFn,
    validFrom: number,
    validTo: number
};
type Track = {
    flightId: string,
    ident: string,
    landingTimes: {
        scheduled: null | number,
        estimated: null | number,
        actual: null | number
    },
    takeoffTimes: {
        scheduled: null | number,
        estimated: null | number,
        actual: null | number 
    },
    track2: Segment[]
};
type Tracks = Record<string, Track>;
export class TracksClient {

    // This is a query for -originAndDestination KIAH
    url = 'https://philip-docker.flightaware.com/ajax/trackpoll.rvt?nocache&token=88dd7c1a0d41355dafa2ce4ff0e607704b11c422c1328177ead1609914250d4e5a1c37bf36c85cfe--456079cbd7e178368cd7f9907593a0f793c6fd8f&locale=en_US&summary=0';

    // Periodically-updated list of tracks for this topic.
    tracks: Tracks = {};

    constructor(topic) {
        // For now we don't use the topic param; just use the static URL+TrackPoll
        const that = this;
        fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                that.tracks = data.flights;
            });
        setInterval(() => {
            fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                that.tracks = data.flights;
            });
        }, 30000);
    }

    getPositionsAt(timestamp: number) {
        // TODO: should probably type this
        let positions = [];
        for (const flight_id of Object.keys(this.tracks)) {
            const flight = this.tracks[flight_id];
            const track = flight.track2;
            if (track.length == 0) { continue; }

            // Do nothing if the timestamp is before actual departure or after actual arrival
            // TODO: real-world, we'll have to tweak this if we want ground tracks to animate
            if (flight.takeoffTimes.actual !== null && timestamp < flight.takeoffTimes.actual) {
                continue;
            }

            if (flight.landingTimes.actual !== null && timestamp > flight.landingTimes.actual) {
                continue;
            }

            let matchedSegment = null;
            for (const segment of track) {
                if (timestamp <= segment.validTo && timestamp > segment.validFrom) {
                    matchedSegment = segment;
                    break;
                }
            }

            if (matchedSegment === null) {
                continue;
            }

            // calculate position using segment
            const lon = matchedSegment.lonFn.m * timestamp + matchedSegment.lonFn.b;
            const lat = matchedSegment.latFn.m * timestamp + matchedSegment.latFn.b;
            positions.push({
                coordinates: [lon, lat],
                heading: matchedSegment.headingFn.c,
                ident: this.tracks[flight_id].ident,
                flightId: flight_id
            });
        }

        return positions;
    }

    // Return linestrings representing all segments for each flight
    getTracksAt(timestamp: number) {
        let tracks = [];

        for (const flight_id of Object.keys(this.tracks)) {
            const flight = this.tracks[flight_id];
            const track = flight.track2;
            if (track.length == 0) { continue; }

            // Do nothing if the timestamp is before actual departure or after actual arrival
            // TODO: real-world, we'll have to tweak this if we want ground tracks to animate
            if (flight.takeoffTimes.actual !== null && timestamp < flight.takeoffTimes.actual) {
                continue;
            }

            if (flight.landingTimes.actual !== null && timestamp > flight.landingTimes.actual) {
                continue;
            }

            let trackPositions = [];
            for (const segment of track) {
                // OK, we're definitely rendering something from this segment. Always append the start point.
                const lon = segment.lonFn.m * segment.validFrom + segment.lonFn.b;
                const lat = segment.latFn.m * segment.validFrom + segment.latFn.b;
                trackPositions.push({
                    coordinates: [lon, lat],
                    ident: this.tracks[flight_id].ident,
                    flightId: flight_id
                });

                // If the timestamp falls within this segment, add the calculated point and quit.
                if (timestamp <= segment.validTo && timestamp > segment.validFrom) {
                    const lon = segment.lonFn.m * timestamp + segment.lonFn.b;
                    const lat = segment.latFn.m * timestamp + segment.latFn.b;
                    trackPositions.push({
                        coordinates: [lon, lat],
                        ident: this.tracks[flight_id].ident,
                        flightId: flight_id
                    });

                    break;
                }
            }

            tracks.push(trackPositions);
        }

        return tracks;
    }

    // Return linestrings representing the last five minutes of flight track
    getTrailsAt(timestamp: number) {
        let trails = [];
        const startTimestamp = timestamp - 300; // 5-minute trails

        for (const flight_id of Object.keys(this.tracks)) {
            const flight = this.tracks[flight_id];
            const track = flight.track2;
            if (track.length == 0) { continue; }

            // Do nothing if the timestamp is before actual departure or after actual arrival
            // TODO: real-world, we'll have to tweak this if we want ground tracks to animate
            if (flight.takeoffTimes.actual !== null && timestamp < flight.takeoffTimes.actual) {
                continue;
            }

            if (flight.landingTimes.actual !== null && timestamp > flight.landingTimes.actual) {
                continue;
            }

            let trailPositions = [];
            for (const segment of track) {
                // Are we before the start of the trail?
                if (startTimestamp > segment.validTo) {
                    continue;
                }

                const start = Math.max(segment.validFrom, startTimestamp);

                // OK, we're definitely rendering something from this segment. Always append the start point.
                const lon = segment.lonFn.m * start + segment.lonFn.b;
                const lat = segment.latFn.m * start + segment.latFn.b;
                trailPositions.push({
                    coordinates: [lon, lat],
                    ident: this.tracks[flight_id].ident,
                    flightId: flight_id
                });

                // If the timestamp falls within this segment, add the calculated point and quit.
                if (timestamp <= segment.validTo && timestamp > segment.validFrom) {
                    const lon = segment.lonFn.m * timestamp + segment.lonFn.b;
                    const lat = segment.latFn.m * timestamp + segment.latFn.b;
                    trailPositions.push({
                        coordinates: [lon, lat],
                        ident: this.tracks[flight_id].ident,
                        flightId: flight_id
                    });

                    break;
                }
            }

            trails.push(trailPositions);
        }

        return trails;
    }

}