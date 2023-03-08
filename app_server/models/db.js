// var mongoose = require( 'mongoose' );
// var gracefulShutdown;
// var dbURI = 'mongodb://localhost/Loc8r'; 

// mongoose.connect(dbURI); 

// mongoose.connection.on('connected', function () { 
//  console.log('Mongoose connected to ' + dbURI); 
// }); 

// mongoose.connection.on('error',function (err) { 
//  console.log('Mongoose connection error: ' + err); 
// }); 

// mongoose.connection.on('disconnected', function () { 
//  console.log('Mongoose disconnected'); 
// }); 

// //SIGINT emition
// var readLine = require ("readline");
// if (process.platform === "win32"){
//  var rl = readLine.createInterface ({
//  input: process.stdin,
//  output: process.stdout
//  });
//  rl.on ("SIGINT", function (){
//  process.emit ("SIGINT");
//  });
// }

// gracefulShutdown = function (msg, callback) { 
//  mongoose.connection.close(function () { 
//  console.log('Mongoose disconnected through ' + msg); 
//  callback(); 
//  }); 
// }; 

// // For nodemon restarts 
// process.once('SIGUSR2', function () { 
//  gracefulShutdown('nodemon restart', function () { 
//  process.kill(process.pid, 'SIGUSR2'); 
//  }); 
// }); 

// // For app termination 
// process.on('SIGINT', function() { 
//  gracefulShutdown('app termination', function () { 
//  process.exit(0); 
//  }); 
// }); 




// // requiring locations file in models folder
// require('./locations');