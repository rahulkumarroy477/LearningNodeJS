const fs = require("fs")
const os = require("os")
// writing to file

// fs.writeFileSync('./temp-file.txt',"Writing to a file")

// fs.writeFile('./temp-file.txt',"Writing to a file",(err)=>{})

// reading from file

// const syncRead = fs.readFileSync("./temp-file.txt","utf-8")
// console.log(syncRead)

// fs.readFile("./temp-file.txt","utf-8",(err,result)=>console.log(result))

// creating a copy

// fs.cpSync("./temp-file.txt","./temp-file-copy.txt")

// Appending to a file

// logging a file
for(let i = 0;i<10;i++){
    fs.appendFileSync("./temp-file-copy.txt",`${Date.now()}\n`)
}

// deleting a file

// fs.unlinkSync("./temp-file-copy.txt")

// creating a directory

// fs.mkdirSync("my-docs/a/b",{recursive:true})

console.log(os.cpus().length)