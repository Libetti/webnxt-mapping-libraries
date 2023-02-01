module.exports = {
	env: {
	  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    AERIS_ID: process.env.AERIS_ID,
    AERIS_SECRET: process.env.AERIS_SECRET,
	},
	webpack: (config) => {
        config.module.rules.push({
            resolve:{
                alias: {
                    ...config.resolve.alias,
                }
            }
        })
      // Important: return the modified config
      return config
    },
  };