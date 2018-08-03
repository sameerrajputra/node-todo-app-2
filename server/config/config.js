var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
	var config = require('./config.json');
	var envConfig = config[env];
	// console.log(envConfig);

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];	//This is same as settig process.env.PORT = 3000

	}); 

}


// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
