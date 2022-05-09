const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // Line 39: use groth16 to prove the input using the circuit produced from the program
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // Show the evaluation of the circuit proofing
        console.log('1x2 =',publicSignals[0]);

        // change the format of publicSignals from String to BigInt
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // change the format of Proof from String to BigInt
        const editedProof = unstringifyBigInts(proof);
        // Set the modified proof and public signal as calldata in Solidity
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // Regex to remove unnecessary symbols from the string and convert the Hex into BigInt
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Parameters for each const, acquired from the call data earned 
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // Verifier of the program
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Groth16Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // Line 39: use groth16 to prove the input using the circuit produced from the program
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2", "c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        // Show the evaluation of the circuit proofing
        console.log('1x2x3 =',publicSignals[0]);

        // change the format of publicSignals from String to BigInt
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // change the format of Proof from String to BigInt
        const editedProof = unstringifyBigInts(proof);
        // Set the modified proof and public signal as calldata in Solidity
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // Regex to remove unnecessary symbols from the string and convert the Hex into BigInt
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Parameters for each const, acquired from the call data earned 
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // Verifier of the program
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // Line 39: use groth16 to prove the input using the circuit produced from the program
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2", "c":"3"}, "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/_plonkMultiplier3/circuit_final.zkey");

        // Show the evaluation of the circuit proofing
        console.log('1x2x3 =',publicSignals[0]);

        // change the format of publicSignals from String to BigInt
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // change the format of Proof from String to BigInt
        const editedProof = unstringifyBigInts(proof);
        // Set the modified proof and public signal as calldata in Solidity
        const calldata = (await plonk.exportSolidityCallData(editedProof, editedPublicSignals)).split(',');
    
          

        // Verifier of the program
        expect(await verifier.verifyProof(calldata[0], JSON.parse(calldata[1]))).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        const a = '0x00';
        const b = ['0'];
        expect(await verifier.verifyProof(a, b)).to.be.false;
    });
});