import React, {FunctionComponent } from 'react';

type Props = {
	children?: React.ReactNode;
};

const Content: FunctionComponent<Props> = ({children}) => {
	return <section id="content">
		{children}
	</section>
}

export default Content