export default function measureInteraction(interactionName) {
	// Don’t do this
	performance.mark(interactionName + ' start');
  
	return {
	  end() {
		performance.mark(interactionName + ' end');
		const measure = performance.measure(
		  interactionName + ' duration',
		  interactionName + ' start',
		  interactionName + ' end',
		);
		console.log('The interaction took', measure.duration, 'ms');
	  },
	};
  }