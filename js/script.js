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

var operator;
var writeToNumber = operandA;

var operatorHash = {
    0: "+",
    1: "-",
    2: "/",
    3: "*",
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
    operator = operatorHash[op];
    writeToNumber = operandB ;

    let ns = document.querySelector("#output > #number-space");
    ns.textContent = "0"

    let hs = document.querySelector("#output > #history");
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
    let a = parseFloat(operandToString(numA));
    let b = parseFloat(operandToString(numB));
    console.log(op);
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
    console.log(a + b);
    pushResult(mainStr);
}

function pushResult(str){
    let hs = document.querySelector("#output > #history");
    hs.textContent = `${operandToString(operandA)} ${operator} ${operandToString(operandB)} =`
    document.querySelector("#output > #number-space").textContent = str;
}