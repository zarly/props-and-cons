
export default {
    port: 8080,

	auth: {
    	vkapp: {
			secret: process.env.VK_APP_SECRET,
			disableVerification: true,
		}
	},

	logging: {
    	morganFormat: 'dev',
	},

	admins: [36906447],
}
