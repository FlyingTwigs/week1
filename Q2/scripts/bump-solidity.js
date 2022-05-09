const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/
const verifierRegexPlonk = /contract PlonkVerifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
let content1 = fs.readFileSync("./contracts/Multiplier3Groth16Verifier.sol", { encoding: 'utf-8' });
let bumped1 = content1.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped1 = bumped1.replace(verifierRegex, 'contract Multiplier3Groth16Verifier');

fs.writeFileSync("./contracts/Multiplier3Groth16Verifier.sol", bumped1);

let content2 = fs.readFileSync("./contracts/Multiplier3PlonkVerifier.sol", { encoding: 'utf-8' });
let bumped2 = content2.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped2 = bumped2.replace(verifierRegexPlonk, 'contract Multiplier3PlonkVerifier');

fs.writeFileSync("./contracts/Multiplier3PlonkVerifier.sol", bumped2);
