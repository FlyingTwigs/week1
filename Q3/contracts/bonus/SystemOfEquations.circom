pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matAdd.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemMul.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemPow.circom";
 // hint: you can use more than one templates in circomlib-matrix to help you

template Multiplier2(){
    //Declaration of signals
    signal input in1;
    signal input in2;
    signal output out;

    out <== in1 * in2;
}

template AndN (N){
   //Declaration of signals and components.
   signal input in[N];
   signal output out;
   component mult[N-1];
   component binCheck[N];

//    //Statements.
//    for(var i = 0; i < N; i++){
//        binCheck[i] = binaryCheck();
//          binCheck[i].in <== in[i];
//    }
   for(var i = 0; i < N-1; i++){
       mult[i] = Multiplier2();
   }
   mult[0].in1 <== in[0];
   mult[0].in2 <== in[1];
   for(var i = 0; i < N-2; i++){
       mult[i+1].in1 <== mult[i].out;
       mult[i+1].in2 <== in[i+2];

   }
   out <== mult[N-2].out; 
}

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component mul = matElemMul(n,n);
    for (var i = 0; i<n; i++) {
        for (var j = 0; j<n; j++) {
            mul.a[i][j] <== A[i][j];
            mul.b[i][j] <== x[j];
        }
    }

    component row[n];

    for (var i = 0; i<n; i++) {
        row[i] = matElemSum(1, n);

        for (var j = 0; j<n; j++) {
            row[i].a[0][j] <== mul.out[i][j];
        }
    }

    component equal[n];
    component multiplier = AndN(n);

    for (var i = 0; i<n; i++) {
        equal[i] = IsEqual();
        equal[i].in[0] <== row[i].out;
        equal[i].in[1] <== b[i];
        multiplier.in[i] <== equal[i].out;
    }

    out <== multiplier.out;
}

component main {public [A, b]} = SystemOfEquations(3);