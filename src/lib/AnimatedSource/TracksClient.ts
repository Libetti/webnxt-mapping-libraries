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
    latFn: SegmentFn,
    lonFn: SegmentFn,
    validFrom: number,
    validTo: number
};
type Track = {
    landingTimes: {
        scheduled: null | number,
        estimated: null | number,
        actual: null | number
    },
    track2: Segment[]
};
type Tracks = Record<string, Track>;
export class TracksClient {

    // This is a query for -originAndDestination KIAH
    url = 'https://philip.flightaware.com/ajax/trackpoll.rvt?nocache&token=88dd7c1a0d41355dafa2ce4ff0e607704b11c422c1328177ead1609914250d4e5a1c37bf36c85cfe--456079cbd7e178368cd7f9907593a0f793c6fd8f&locale=en_US&summary=0';

    // Periodically-updated list of tracks for this topic.
    tracks: Tracks = {};

    constructor(topic) {
        // For now we don't use the topic param; just use the static URL+TrackPoll
        const that = this;
        fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                that.tracks = data.flights;
                console.log(that.tracks);
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
            const track = this.tracks[flight_id].track2;
            if (track.length == 0) { continue; }

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
                coordinates: [lon, lat]
            });
        }

        return positions;
    }

}