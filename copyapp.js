const fs = require('fs');
const path = require('path');

const from = path.join(__dirname,'build','index.html');
const to = path.join(__dirname,'build','404.html');

fs.copyFileSync(from,to);console.log("404복사완료");