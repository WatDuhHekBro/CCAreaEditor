module.exports = {
	mode: "production",
	output:
	{
		path: `${__dirname}/docs`,
		filename: "main.js"
	},
	module:
	{
		rules:
		[
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: "ts-loader"
			}
		]
	},
	resolve:
	{
		extensions: [".ts", ".tsx", ".js"]
	}
};