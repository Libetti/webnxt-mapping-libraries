import React, {FunctionComponent, useState} from "react"
import dynamic from "next/dynamic";
import MapLibreMap from "../components/reactmapgl/MapLibreMap"
import MapBoxMap from "../components/reactmapgl/MapBoxMap"
import ReactLeafletMap from "../components/reactleaflet/ReactLeafletMap"
import Header from "../components/layout/Header"
import Content from "../components/layout/Content"
import Footer from "../components/layout/Footer"
import 'leaflet/dist/leaflet.css'


const frameworks = ["React-Map-GL (Libre)","React-Map-GL (Mapbox)","React-Leaflet"]

const HomePage: FunctionComponent<{}> = () => {
	const [tab,setTab] = useState<number>(0)
	let component = <MapLibreMap baseLayer="Topographic"/>
	switch (tab) {
		case 0:
			component = <MapLibreMap key="MapLibreMap" baseLayer="Topographic"/>
			break;
		case 1:
			component = <MapBoxMap key="MapBoxMap" baseLayer="Topographic"/>
			break;
		case 2:
			component = <ReactLeafletMap key="LeafletNoSSR"/>
			break;

		default:
			break;
	}
	return <div id="root">
		<Header frameworks={frameworks} setTab={setTab} />
		<Content>
			{component}
		</Content>
		<Footer />
	</div>
}

export default HomePage