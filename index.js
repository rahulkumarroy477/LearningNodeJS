// const http = require("http");
// const url = require("url");

// const myServer = http.createServer((req,res)=>{
//     const myUrl = url.parse(req.url,true);

//     if(myUrl.pathname === "/favicon.ico"){
//         return res.end();
//     }
//     console.log(myUrl);
//     switch(myUrl.pathname){
//         case "/":
//             res.write("HomePage\n\n");
//             res.end();

//             break;
//         case "/about":
//             res.end(`My name is ${myUrl.query.name}`);
//             break;
//         default:
//             res.end("Error 404 Not found");
//     }
// });
// myServer.listen(8000, ()=>{
//     console.log('Server started');
// });