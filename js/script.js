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
var last_res;

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
    if(writeToNumber.number.length < 13){
        let btn = document.getElementById("decimal")
        if(sp == '.' && !writeToNumber.decimal){
            console.log("hit")
            writeToNumber.decimal = true;
            pushNum(".")
            btn.classList.add("disabled")
        }
        else if(sp == 'r'){
            btn.classList.remove("disabled")
            writeToNumber.decimal = false;
        }
        else{
            pushNum((sp == '.') ? "" : sp)
        }
    }
}

function pushOp(op){
    pushNumWrapper("r")
    showMessage("")
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
    document.querySelector("#output > #history").textContent = last_res ?? "0";
    pushNum("") //simply updates display
}

function performCalcWrapper(){
    if(operandB.number && operator){
        performCalc(operandA, operandB, operator);
    }
}

function performCalc(numA, numB, op){
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
    if(mainStr == "NaN"){
        clearCalc();
        showMessage("Operation Unsupported");
    }
    else{
        let result = truncNumber(mainStr);
        last_res = result;
        pushResult(result);
    }
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

//math
function truncNumber(num){ //num  --> str
   if(num.includes("e")){
       //expo mode active
       let loc = num.indexOf("e");
       showMessage("Number has been truncated,\n Precision reduced");
       return num.slice(0, Math.min(9, loc)) + num.slice(loc)
       
   }
   else if(num.length > 10){
       max = Math.min(10, num.length);
       showMessage("Number has been truncated,\n Precision reduced");
       return parseFloat(num.slice(0, max)).toExponential();
   }
   return num;
}

function clearCalc(){
    console.log("clear");
    resetOperand(operandA);
    resetOperand(operandB)
    operator = undefined;
    writeToNumber = operandA;
    pushNumWrapper("")
    document.querySelector("#output > #history").textContent = "0";
}

function showMessage(str){
    let p = document.querySelector(".msg");
    p.textContent = str;
}

function log(){
    writeToNumber.number = truncNumber(Math.log(parseFloat(writeToNumber.number))+"0")
    console.log(writeToNumber)
    pushNum("") //empty update to display log
}