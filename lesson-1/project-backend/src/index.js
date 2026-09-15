// const functions = require("./functions");
// import { isLeapYear } from './functions.js';
// import {readFile} from "node:fs";
import {readFile, appendFile, writeFile, unlink} from "node:fs/promises";
import {join} from "node:path";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";
// console.log(isLeapYear(2024));

// const user = "Bohdan";

// readFile("src/text.txt")
//   .then(data => console.log(data))
//   .catch(error => console.log(error));

// readFile("src/text2.txt", (error, data)=> {
//   console.log({
//     error,
//     data,
//   })
// })

// const buffer = await readFile("src/text.txt");
// const text = buffer.toString();
// console.log(text);
// const text = await readFile("src/text.txt", "utf-8");
// console.log(text);
// const fileInfo = await DetectFileEncodingAndLanguage("src/text.txt");
// const text = await readFile("src/text.txt", fileInfo.encoding);
// console.log(text);
// console.log(process.cwd())
const filePath = join(process.cwd(), "src", "text.txt");
// console.log(filePath);

// await appendFile(filePath, "Don't forget PHP");
// await writeFile(filePath, "Mojo forever");

// await appendFile("src/text2.txt", "Don't forget PHP");
// await writeFile("src/text3.txt", "Mojo forever");
await unlink("src/text3.txt")
