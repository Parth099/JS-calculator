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
    4: "^",
}

function resetOperand(o){
    o.number = "";
    o.sign = 1;
    o.signStr = "";
    o.decimal = false;
}
function operandToString(o){
    if(o.number[o.number.length - 1] == "."){
        o.number += "0";
    }
    return `${o.signStr}${o.number}`;
}

function pushNum(digit){
    writeToNumber.number += digit;
    let ns = document.querySelector("#output > div.ns-cont > #number-space");
    let out = (writeToNumber.signStr + writeToNumber.number)
    ns.textContent = (out) ? out : "0";
    
}

function pushNumWrapper(sp){
    let btn = document.getElementById("decimal")
    if(sp == '.' && !writeToNumber.decimal){
        writeToNumber.decimal ^= 1;
        pushNum(".")
        btn.classList.add("disabled")
    }
    if(sp == 'r'){
        btn.classList.remove("disabled")
    }
}

function pushOp(op){
    pushNumWrapper("r")
    let ns = document.querySelector("#output > div.ns-cont > #number-space");
    ns.textContent = "_";
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
function popNumberWrapper(){
    if(writeToNumber.number.length > 0 && writeToNumber.number != "0"){
        popNumber();
    }
}
function popNumber(){
    let end = writeToNumber.number.length - 1
    let popped = writeToNumber.number[end];
    writeToNumber.number = writeToNumber.number.slice(0, end);

    if(popped == "."){
        writeToNumber.decimal ^= 1;
        pushNumWrapper('r') //reset decimal button
    }

    pushNum("") //empty push to display update
}

function pushSign(){
    writeToNumber.sign *= -1;
    writeToNumber.signStr = (writeToNumber.sign == 1) ? "" : "-";
    pushNum("") //simply updates display
}

function performCalcWrapper(){
    if(operandB.number && operator){
        performCalc(operandA, operandB, operator);
    }
}

function performCalc(numA, numB, op){
    
    console.log(operandToString(numA), operandToString(numB), op)

    if(!numA.number){
        numA.number = "0"
    }
     //if user fails to input first number
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
    else if(op == "^"){
        mainStr += Math.pow(a, b)
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
    pushNumWrapper("r")
    let hs = document.querySelector("#output > #history");
    hs.textContent = `${operandToString(operandA)} ${operator} ${operandToString(operandB)} = `
    document.querySelector("#output > div.ns-cont > #number-space").textContent = str;

    moveToNextOp(str)
}