import { FunctionComponent, PropsWithChildren, createContext } from 'react';

interface BaseClockProps {
    // Rate of clock change. 1 = 1x realtime
    rate: number;
};
interface ClockPropsWithStart extends BaseClockProps {
    // Sets the clock to a specific starting timestamp
    startTime: number;
};
interface ClockPropsWithOffset extends BaseClockProps {
    // Sets a specific initial starting offset (eg startTime = now - offset)
    offset: number;
};

export type ClockProps = ClockPropsWithStart | ClockPropsWithOffset;

class Clock {

    options: ClockPropsWithStart;

    // Epoch of last options update
    lastUpdate: number;

    constructor(options: ClockProps) {
        this.updateOptions(options);
    }

    updateOptions(options: ClockProps) {
        // If we were provided an offset, convert to startTime
        if ('offset' in options) {
            const processedOptions: ClockPropsWithStart = {
                startTime: new Date().getTime() / 1000 - options.offset,
                ...options
            };
            this.options = processedOptions;
        } else {
            this.options = options;
        }

        // Set last update time
        this.lastUpdate = new Date().getTime() / 1000;
    }
    
    getTimestamp() {
        const now = new Date().getTime() / 1000;
        return this.options.startTime + ((now - this.lastUpdate) * this.options.rate);
    }

}

export const ClockContext = createContext(undefined);

export const AnimationClock: FunctionComponent<PropsWithChildren<ClockProps>> = ({ children, ...clockProps }) => {
    const clock = new Clock(clockProps);
    return <>
        <ClockContext.Provider value={clock}>
            {children}
        </ClockContext.Provider>
    </>
}