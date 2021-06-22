//declare constants
var MAXFIT = 10;

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

var prevOperand = {
    number: "",
    sign: 1,
    signStr: "",
    decimal: false,
}

var operator, prevOp, writerFlag;
var writeToNumber = operandA;
var last_res;

var operatorHash = {
    61: "+",
    173: "-",
    191: "/",
    56: "*",
    54: "^",
}

function copyOperand(a, b){
    b.number = a.number;
    b.sign = a.sign;
    b.signStr = a.signStr;
    b.decimal = a.decimal;
}

function isNull(o){
    return o.number == "" && o.sign == 1 && o.signStr == "" && !o.decimal;
}
function pushToHistory(str){
    document.querySelector("#output > #history").textContent = str;
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
            console.log(writeToNumber.number)
            writeToNumber.decimal = true;
            pushNum(".")
            btn.classList.add("disabled")
        }
        else if(sp == "."){
            return
        }
        else if(sp == 'r'){
            btn.classList.remove("disabled")
            writeToNumber.decimal = false;
        }
        else{
            //need to fix this looks a bit too complex
            if(writeToNumber == operandB){
                if(operator){
                    pushNum(sp)
                }
                else{
                    showMessage("Operator must be chosen prior to an Operation!")
                }
            }
            else{
                pushNum(sp)
            }
            //only push number for 2nd-ary if-f operator is defined
        }
    }
}

function pushOp(op){
    pushNumWrapper("r")
    showMessage("")
    let ns = document.querySelector("#output > div.ns-cont > #number-space");
    ns.textContent = "_";
    let hs = document.querySelector("#output > #history");

    prevOp = operator;
    operator = op;
    writeToNumber = operandB;
    resetOperand(writeToNumber)

    
    hs.textContent = `${operandToString(operandA)} ${operator}`
    //ns.textContent = "0"

    if(writeToNumber.number && prevOp){
        performCalc(operandA, operandB, prevOp);
        //showMessage("Operator not specified, Previous Operator used.")
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
    //document.querySelector("#output > #history").textContent = last_res ?? "0";
    pushNum("") //simply updates display
}

function performCalcWrapper(){
    if(isNull(operandB) && operator){  
        copyOperand(prevOperand, operandB);
        performCalc(operandA, operandB, operator);
    }
    if(operandB.number && operator){
        performCalc(operandA, operandB, operator);
    }
}

function performCalc(numA, numB, op){

    copyOperand(numB, prevOperand);
    prevOp = op;
    operator = undefined;

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
        pushResult(truncNumber(result));
    }
    
}

function writeResToOperand(result, o, neg = false){
    if(result[0] == '-'){
        writeResToOperand(result.slice(1), o, neg = true);
    }
    o.number = result.slice(neg);
    o.decimal = (result.includes(".")) ? true : false;

    o.sign  = (neg) ? -1 : 1;
    o.signStr = (o.sign == 1) ? "" : "-";

}
function moveToNextOp(result){
    writeResToOperand(result, operandA);
    resetOperand(operandB);
}
function pushResult(str){
    pushNumWrapper("r");
    let hs = document.querySelector("#output > #history");
    hs.textContent = `${operandToString(operandA)} ${prevOp} ${operandToString(operandB)} = `
    document.querySelector("#output > div.ns-cont > #number-space").textContent = str;
    moveToNextOp(str);
}

//math
function truncNumber(num){ //num  --> str
   if(num.includes("e")){
       let loc = num.indexOf("e");
       let end = (num.slice(loc+2) == "0")
       //showMessage("Number has been truncated,\n Decimal Precision reduced");
       return num.slice(0, Math.min(MAXFIT - 1, loc)) + ( (end) ? "" : num.slice(loc) );
       
   }
   else if(num.length > 10){
       showMessage("Number has been truncated,\n Precision reduced");
       num = parseFloat(num).toExponential();
   }
   return num;
}

function clearCalc(){
    resetOperand(operandA);
    resetOperand(operandB)
    operator = undefined;
    writeToNumber = operandA;
    pushNumWrapper("");
    document.querySelector("#output > #history").textContent = "0";
}

function showMessage(str){
    let p = document.querySelector(".msg");
    p.textContent = str;
}
function log(){

    if(isNull(operandB)){
        writeToNumber = operandA;
    }

    x = parseFloat(writeToNumber.number); //assume num > 0

    if(x == 0 || Number.isNaN(x)){
        showMessage("Ln(0) is not defined!");
        pushNum("");
        return;
    }

    x = Math.log(x).toExponential()

    if(x < 0){
        writeToNumber.sign *= 1;
        writeToNumber.signStr = "-";
    }
    writeToNumber.number = truncNumber(""+x);
    pushNum("");

    
}

function WindowListener(e){
    let keyPressed = e.keyCode;
    if(keyPressed > 47 && keyPressed < 58 && !e.shiftKey){
        pushNumWrapper(String.fromCharCode(keyPressed));
    }
    else if(operatorHash[keyPressed]){
        pushOp(operatorHash[keyPressed]);
    }
    else if(keyPressed == 13){
        performCalcWrapper();
    }
    else if(keyPressed == 8){
        popNumberWrapper();
    }
    else if(keyPressed == 190){
        pushNumWrapper(".");
    }
    else if(keyPressed == 67){
        clearCalc();
    }
    else if(keyPressed == 78){
        pushSign();
    }
}
//add keydown
function main(){
    window.addEventListener("keydown", WindowListener);
}  

main();