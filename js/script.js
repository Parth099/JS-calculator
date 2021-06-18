//declare constants

var operandA = {
    number: "",
    sign: 1,
    signStr: "",
    decimal: false,
};

var operandB = {
    number: "",
    sign: 1,
    signStr: "",
    decimal: false,
};

var operator, prevOp;
var writeToNumber = operandA;

var operatorHash = {
    0: "+",
    1: "-",
    2: "/",
    3: "*",
}

function resetOperand(o){
    o.number = "";
    o.sign = 1;
    o.signStr = "";
    decimal: false
}
function operandToString(o){
    return `${o.signStr}${o.number}`;
}
//declare dom elements
var ns = document.querySelector("#output > #number-space");

function pushNum(digit){
    writeToNumber.number += digit;
    let ns = document.querySelector("#output > #number-space");
    ns.textContent = (writeToNumber.signStr + writeToNumber.number) ?? 0;
}

function pushOp(op){
    let ns = document.querySelector("#output > #number-space");
    let hs = document.querySelector("#output > #history");

    prevOp = operator
    operator = operatorHash[op];
    writeToNumber = operandB ;

    
    hs.textContent = `${operandToString(operandA)} ${operator}`
    //ns.textContent = "0"

    if(writeToNumber.number && prevOp){
        performCalc(operandA, operandB, prevOp);
        prevOp = undefined;
    }
    hs.textContent = `${operandToString(operandA)} ${operator}`
}

function pushSign(){
    writeToNumber.sign *= -1;
    writeToNumber.signStr = (writeToNumber.sign == 1) ? "" : "-";
    pushNum("") //simply updates display
}

function performCalcWrapper(){
    if(operandA.number && operandB.number && operator){
        performCalc(operandA, operandB, operator);
    }
}

function performCalc(numA, numB, op){

    console.log(operandToString(numA), operandToString(numB), op)

    let a = parseFloat(operandToString(numA));
    let b = parseFloat(operandToString(numB));
    let mainStr = ""
    
    if(op == "+"){
        mainStr += a + b;
    }
    else if(op == "-"){
        mainStr += a - b;
    }
    else if(op == "*"){
        mainStr += a * b;
    }
    else if(op == "/"){
        mainStr += a / b;
    }
    pushResult(mainStr);
}

function writeResToOperand(result, o, neg = false){
    if(result[0] == '-'){
        writeResToOperand(result.slice(1), o, neg = true)
    }
    o.number = result.slice(neg);
    o.decimal = (result.includes(".")) ? true : false

    o.sign  = (neg) ? -1 : 1;
    o.signStr = (o.sign == 1) ? "" : "-";

}

function moveToNextOp(result){
    writeResToOperand(result, operandA)
    resetOperand(operandB)
}
function pushResult(str){
    let hs = document.querySelector("#output > #history");
    hs.textContent = `${operandToString(operandA)} ${operator} ${operandToString(operandB)} =`
    document.querySelector("#output > #number-space").textContent = str;

    moveToNextOp(str)
}