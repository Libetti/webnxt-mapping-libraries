// Install map libre and create a base map, gzip and minify the project
import React, { FunctionComponent } from 'react';

type HeaderProps = {
	frameworks: Array<string>
	setTab:Function
}
const Header: FunctionComponent<HeaderProps> = ({frameworks, setTab}) => {
	return <header id="header">
		<div className="nav-buttons">
			{frameworks.map((item,i)=>
				<a key={item} onClick={()=> setTab(i)}>{item}</a>
			)}
		</div>
	</header>
}

export default Header