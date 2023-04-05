import React, { FunctionComponent, useState, Profiler } from "react";
import MapLibreMap from "../components/reactmapgl/MapLibreMap";
import MapBoxMap from "../components/reactmapgl/MapBoxMap";
import ReactLeafletMap from "../components/reactleaflet/ReactLeafletMap";
import OLMap from "../components/openlayers/OLMap";
import Header from "../components/layout/Header";
import Content from "../components/layout/Content";
import Footer from "../components/layout/Footer";

import measureRender from "../utils/measureRender";

const frameworks = [
    "React-Map-GL (Libre)",
    "React-Map-GL (Mapbox)",
    "React-Leaflet",
    "OpenLayers",
];

const HomePage: FunctionComponent<{}> = () => {
    const [tab, setTab] = useState<number>(0);
    measureRender(`Map #${tab}`);

    let component = <MapLibreMap baseLayer="Topographic" />;
    switch (tab) {
        case 0:
            component = (
                <MapLibreMap key="MapLibreMap" baseLayer="Topographic" />
            );
            break;
        case 1:
            component = <MapBoxMap key="MapBoxMap" baseLayer="Topographic" />;
            break;
        case 2:
            component = <ReactLeafletMap key="LeafletNoSSR" />;
            break;
        case 3:
            component = <OLMap key="OpenLayers" />;
            break;

        default:
            break;
    }

    return (
        <div id="root">
                <Header frameworks={frameworks} setTab={setTab} />
                <Content>{component}</Content>
                <Footer />
        </div>
    );
};

export default HomePage;
