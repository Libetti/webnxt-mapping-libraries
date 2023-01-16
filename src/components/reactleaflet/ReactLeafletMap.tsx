import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

const DynamicMap = dynamic(() => import('./DynamicMap'),{
	ssr:false
})

export const ReactLeafletMap: FunctionComponent<{}> = () => {
	return (
	  <>
		<DynamicMap />
	  </>
	)
  }

export default ReactLeafletMap