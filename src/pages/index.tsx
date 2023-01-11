import React, {FunctionComponent, useState} from "react"
import MapLibreMap from "../components/reactmapgl/MapLibreMap"
import MapBoxMap from "../components/reactmapgl/MapBoxMap"
import Header from "../components/layout/Header"
import Content from "../components/layout/Content"
import Footer from "../components/layout/Footer"

const frameworks = ["React-Map-GL (Libre)","React-Map-GL (Mapbox)","React-Leaflet"]

const HomePage: FunctionComponent<{}> = () => {
	const [tab,setTab] = useState<number>(0)
	let component = <MapLibreMap baseLayer="Topographic" isFullscreen={false} />

	switch (tab) {
		case 1:
			component = <MapBoxMap baseLayer="Topographic" isFullscreen={false} />
			break;
		case 2:
			// component = <ReactLeafletMap baseLayer="Topographic" isFullscreen={false} />
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