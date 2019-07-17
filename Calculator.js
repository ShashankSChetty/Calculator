
function Calculate(input) {

    //Declare Objects
    var NumObj = function(dValue) {
        this.dValue = dValue;
        this.bIsCarryOverPointer = false;
        this.bIsBracketPointer = false;
        this.bIsNegative = false;
    }
    
    var OperatorArray = function(cOperator, iPredecessorIndex, iSuccessorIndex) {
        this.cOperator = cOperator || null;
        this.iPredecessorIndex = iPredecessorIndex || null;
        this.iSuccessorIndex = iSuccessorIndex || null;
    }
    
    var BracketArray = function() {
        this.dValue;
        this.iParentIndex;
        this.iNumObjArrayIndex;
        this.iChildBracketCount = 0;
        this.bIsNegativeValue = false;
        this.sTrigonometricFunction = "";
    
        this.aOffOperatorArray = [];
        this.aPowOperatorArray = [];
        this.aDivOperatorArray = [];
        this.aMulOperatorArray = [];
        this.aAddOperatorArray = [];
        this.aSubOperatorArray = [];
    }
    
    var BracketOperatorCache = function() {
        this.cOperator = 'E'; // E = Empty
        this.bHasStart = false;
        this.bHasEnd = false;
        this.iStartNumObjIndex;
        this.iEndNumObjIndex;
    }

    var sInput = input || "1+1";
    var aNumObjs = [];
    var aBracketArray = [];
    var dFinalResult = 0;
    var bToRadians = true;

    //Replace Constants
    sInput = sInput.replace("π","(3.1415926535897932)");
    sInput=  sInput.replace("e","(2.7182818284590452)");

    sInput = "(" + sInput + ")";
    
    var analyseAndCalculate = function() {
        var i = 0;
        var iPredecessorIndex = null, iSuccessorIndex = null;
        var iCurrentParent = -1;
        var aExpChar = sInput.split("");
        var cCurrentOperator = 'E'; // E = Empty
        var bBracketClosed = false;
        var bOperatorFound = false;
        var bNumberAdded = false;
        var bValid = true;
        var bIsNewBracketNegative = false;

        var oTempNumObj; //holds num obj values
        var sCurrentNumberString = "";
        var sCurrentTrigonometricFunction = "";
        var oCurrentBracket = new BracketArray();
        var aBracketOperatorCache = [];
        var oTempBCache;
        var oParentBracket;

        for (i = 0; i < aExpChar.length; i++) {
            //if number append
            while(isNaN(aExpChar[i]) === false) {
                sCurrentNumberString = "" + sCurrentNumberString + aExpChar[i];
                i++;
            }
            //find the trigonometric function
            if(isLetter(aExpChar[i]) === true) {
                switch (aExpChar[i]) {
                    case 's':
                        if(aExpChar[i+1] == 'i' && aExpChar[i+2] == 'n' && aExpChar[i+3] =='(') {
                            sCurrentTrigonometricFunction = "sin";
                            i=i+3;
                        }
                        else if(aExpChar[i+1] == 'i' && aExpChar[i+2] == 'n' && aExpChar[i+3] =='h' && aExpChar[i+4] =='(') {
                            sCurrentTrigonometricFunction = "sinh";
                            i=i+4;
                        }
                        else
                            bValid = false;
                        break;
                    case 'c':
                        if(aExpChar[i+1] == 'o' && aExpChar[i+2] == 's' && aExpChar[i+3] =='(') {
                            sCurrentTrigonometricFunction = "cos";
                            i=i+3;
                        }
                        else if(aExpChar[i+1] == 'o' && aExpChar[i+2] == 'o' && aExpChar[i+3] =='h' && aExpChar[i+4] =='(') {
                            sCurrentTrigonometricFunction = "cosh";
                            i=i+4;
                        }
                        else
                            bValid = false;
                        break;
                    case 't':
                        if(aExpChar[i+1] == 'a' && aExpChar[i+2] == 'n' && aExpChar[i+3] =='(') {
                            sCurrentTrigonometricFunction = "tan";
                            i=i+3;
                        }
                        else if(aExpChar[i+1] == 'a' && aExpChar[i+2] == 'n' && aExpChar[i+3] =='h' && aExpChar[i+4] =='(') {
                            sCurrentTrigonometricFunction = "tanh";
                            i=i+4;
                        }
                        else
                            bValid = false;
                        break;
                    case 'l':
                        if(aExpChar[i+1] == 'o' && aExpChar[i+2] == 'g' && aExpChar[i+3] =='(') {
                            sCurrentTrigonometricFunction ="log";
                            i=i+3;
                        }
                        else if(aExpChar[i+1] == 'n' && aExpChar[i+2] =='(') {
                            sCurrentTrigonometricFunction = "ln";
                            i=i+2;
                        }
                        else
                            bValid = false;
                        break;
                }
                if(!bValid) break;
            }
            switch (aExpChar[i]) {
                case '.':
                    sCurrentNumberString = "" + sCurrentNumberString + aExpChar[i];
                    break;
                case '(' :
                    if (sCurrentNumberString === "-" || cCurrentOperator === '-') {
                        bIsNewBracketNegative = true;
                        sCurrentNumberString = "";
                    }

                    if (sCurrentNumberString !== "") {
                        oTempNumObj = new NumObj(parseFloat(sCurrentNumberString));
                        aNumObjs.push(oTempNumObj);
                        bNumberAdded = true;
                    }

                    if (bNumberAdded && bOperatorFound) {
                        if (!bBracketClosed)
                                iPredecessorIndex = aNumObjs.length - 2;
                        bBracketClosed = false;
                        iSuccessorIndex = aNumObjs.length - 1;
                        addToOperatorArray(cCurrentOperator, iPredecessorIndex, iSuccessorIndex, oCurrentBracket);
                        cCurrentOperator = 'E';
                        bOperatorFound = false;
                        bNumberAdded = false;
                    }

                    oCurrentBracket = new BracketArray();
                    oCurrentBracket.iParentIndex = iCurrentParent;
                    oCurrentBracket.iNumObjArrayIndex = aNumObjs.length;
                    oCurrentBracket.bIsNegativeValue = bIsNewBracketNegative;
                    if(sCurrentTrigonometricFunction !== "") {
                        oCurrentBracket.sTrigonometricFunction = sCurrentTrigonometricFunction;
                        sCurrentTrigonometricFunction = "";
                    }
                    aBracketArray.push(oCurrentBracket);
                    iCurrentParent = aBracketArray.length - 1;

                    oTempNumObj = new NumObj(aBracketArray.length - 1);
                    oTempNumObj.bIsBracketPointer = true;
                    if (cCurrentOperator == '-') oTempNumObj.bIsNegative = true;
                    aNumObjs.push(oTempNumObj);
                    bNumberAdded = true;

                    if (i == 0) continue;
                    oParentBracket = aBracketArray[oCurrentBracket.iParentIndex];
                    oParentBracket.iChildBracketCount++;
                    oTempBCache = new BracketOperatorCache();
                    if (bOperatorFound) {
                        if (!bBracketClosed)
                            iPredecessorIndex = aNumObjs.length - 2;
                        bBracketClosed = false;
                        iSuccessorIndex = aNumObjs.length - 1;
                        addToOperatorArray(cCurrentOperator, iPredecessorIndex, iSuccessorIndex, oParentBracket);
                        cCurrentOperator = 'E';
                        bNumberAdded = false;
//                        operatorFound = false;
                    }
                    if (sCurrentNumberString === "") {
                        oTempBCache.bHasStart = true;
                        oTempBCache.iStartNumObjIndex = oCurrentBracket.iNumObjArrayIndex;
                    } else {
                        sCurrentNumberString = "";
                        oTempBCache.bHasStart = true;
                        oTempBCache.iStartNumObjIndex = aNumObjs.length - 2;
                        oTempBCache.bHasEnd = true;
                        oTempBCache.iEndNumObjIndex = oCurrentBracket.iNumObjArrayIndex;
                        if (cCurrentOperator == 'E') cCurrentOperator = '@';
                        oTempBCache.cOperator = cCurrentOperator;
                    }
                    aBracketOperatorCache.push(oTempBCache);
                    cCurrentOperator = 'E';
                    bOperatorFound = false;
                    break;
                default:
                    if (aExpChar[i] === '-') {
                        if (i == 0 && isNaN(aExpChar[i + 1]) === false) {
                            sCurrentNumberString = "" + sCurrentNumberString + aExpChar[i];
                            continue;
                        } else if (i != 0 && isNaN(aExpChar[i - 1]) === true && (isNaN(aExpChar[i + 1]) === false || aExpChar[i + 1] === '(') && aExpChar[i - 1] !== ')') {
                            sCurrentNumberString = "" + sCurrentNumberString + aExpChar[i];
                            continue;
                        } else {
                            if (i != 0 && (isNaN(aExpChar[i - 1]) === true && isNaN(aExpChar[i + 1]) === true)  && (aExpChar[i + 1] !== '(' && aExpChar[i - 1] !== ')')) {
                                console.log("Invalid String!!");
                                bValid = false;
                                break;
                            }
                        }
                    }
                    if (sCurrentNumberString !== "" || bBracketClosed) {
                        if (sCurrentNumberString !== "") {
                            oTempNumObj = new NumObj(parseFloat(sCurrentNumberString));
                            aNumObjs.push(oTempNumObj);
                            bNumberAdded = true;
                        }
                        if (bOperatorFound) {
                            if (!bBracketClosed)
                                iPredecessorIndex = aNumObjs.length - 2;
                            bBracketClosed = false;
                            iSuccessorIndex = aNumObjs.length - 1;

                            addToOperatorArray(cCurrentOperator, iPredecessorIndex, iSuccessorIndex, oCurrentBracket);
                            cCurrentOperator = 'E';
                            bOperatorFound = false;
                            bNumberAdded = false;
                        }
                        switch (aExpChar[i]) {
                            case '^':
                                cCurrentOperator = '^';
                                bOperatorFound = true;
                                break;
                            case '/':
                                cCurrentOperator = '/';
                                bOperatorFound = true;
                                break;
                            case '*':
                                cCurrentOperator = '*';
                                bOperatorFound = true;
                                break;
                            case '+':
                                cCurrentOperator = '+';
                                bOperatorFound = true;
                                break;
                            case '-':
                                cCurrentOperator = '-';
                                bOperatorFound = true;
                                break;
                        }
                    }

                    if (aExpChar[i] === ')' && i < aExpChar.length - 1) {
                        bBracketClosed = true;
                        oTempBCache = aBracketOperatorCache[aBracketOperatorCache.length - 1];
                        if (oCurrentBracket.iChildBracketCount == 0) {
                            calculateBracketValue(oCurrentBracket, sCurrentNumberString.toString());
                        }
                        iCurrentParent = oCurrentBracket.iParentIndex;
                        if (iCurrentParent === -1) continue;
                        oCurrentBracket = aBracketArray[iCurrentParent];
                        oCurrentBracket.iChildBracketCount--;
                        if (oTempBCache.bHasStart && !oTempBCache.bHasEnd) {
                            iPredecessorIndex = oTempBCache.iStartNumObjIndex;
                            if ((i + 1) < aExpChar.length) {
                                if (isNaN(aExpChar[i + 1]) === false || aExpChar[i + 1] === '('|| isLetter(aExpChar[i+1]) === true) {
                                    cCurrentOperator = '@';
                                    bOperatorFound = true;
                                }
                            }
                        } else {
                            iPredecessorIndex = oTempBCache.iStartNumObjIndex;
                            iSuccessorIndex = oTempBCache.iEndNumObjIndex;

                            addToOperatorArray(oTempBCache.cOperator, iPredecessorIndex, iSuccessorIndex, oCurrentBracket); //TODO : bNumberAdded = false ?
                            iPredecessorIndex = oTempBCache.iEndNumObjIndex;
                            if (i + 1 < aExpChar.length) {
                                if (isNaN(aExpChar[i + 1]) === false || aExpChar[i + 1] === '(') {
                                    cCurrentOperator = '@';
                                    bOperatorFound = true;
                                }
                            }
                        }
                        aBracketOperatorCache.splice((aBracketOperatorCache.length - 1),1);
                    } else {
                        if (aExpChar[i] === ')' && i == aExpChar.length - 1) {
                            if (oCurrentBracket.iChildBracketCount === 0) {
                                calculateBracketValue(oCurrentBracket, sCurrentNumberString);
                            }
                        }
                    }
                    sCurrentNumberString = "";
                    break;
            }
        }
        //if (!bValid) return bValid;
        return bValid;
    }

    var addToOperatorArray = function(cOperator, iPredecessorIndex, iSuccessorIndex, oCurrentBracket) {
        var oTempOpArray;
        switch (cOperator) {
            case '@':
                oTempOpArray = new OperatorArray('@', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aOffOperatorArray.push(oTempOpArray);
                break;
            case '^':
                oTempOpArray = new OperatorArray('^', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aPowOperatorArray.push(oTempOpArray);
                break;
            case '/':
                oTempOpArray = new OperatorArray('/', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aDivOperatorArray.push(oTempOpArray);
                break;
            case '*':
                oTempOpArray = new OperatorArray('*', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aMulOperatorArray.push(oTempOpArray);
                break;
            case '+':
                oTempOpArray = new OperatorArray('+', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aAddOperatorArray.push(oTempOpArray);
                break;
            case '-':
                var oTempNumObj = aNumObjs[iSuccessorIndex];
                oTempNumObj.bIsNegative = true;
                oTempOpArray = new OperatorArray('-', iPredecessorIndex, iSuccessorIndex);
                oCurrentBracket.aSubOperatorArray.push(oTempOpArray);
                break;
        }
    }

    var calculateBracketValue = function(oCurrentBracket, sCurrentString) {
        var bValid = true;

        var aOperatorArray = [];
        aOperatorArray = aOperatorArray.concat(oCurrentBracket.aOffOperatorArray);
        aOperatorArray = aOperatorArray.concat(oCurrentBracket.aPowOperatorArray);
        aOperatorArray = aOperatorArray.concat(oCurrentBracket.aDivOperatorArray);
        aOperatorArray =aOperatorArray.concat(oCurrentBracket.aMulOperatorArray);
        aOperatorArray = aOperatorArray.concat(oCurrentBracket.aAddOperatorArray);
        aOperatorArray = aOperatorArray.concat(oCurrentBracket.aSubOperatorArray);

        if(aOperatorArray.length === 0) {
            if(sCurrentString !== "")
                oCurrentBracket.dValue = parseFloat(sCurrentString);
            else
                oCurrentBracket.dValue = dFinalResult;
        }
        else
            oCurrentBracket.dValue = calculate(aOperatorArray);

        if (oCurrentBracket.isNegativeValue)
            oCurrentBracket.dValue = oCurrentBracket.dValue * -1;

        if(oCurrentBracket.sTrigonometricFunction !== ""){
            if(bToRadians && oCurrentBracket.sTrigonometricFunction !== "log" && oCurrentBracket.sTrigonometricFunction !== "ln")
                oCurrentBracket.dValue = Math.ceil(oCurrentBracket.dValue * Math.PI / 180);
            var fTemp = 0;
            switch (oCurrentBracket.sTrigonometricFunction) {
                case "sin":
                    fTemp = Math.sin(oCurrentBracket.dValue);
                    break;
                case "cos":
                    fTemp = Math.cos(oCurrentBracket.dValue);
                    break;
                case "tan":
                    fTemp = Math.tan(oCurrentBracket.dValue);
                    break;
                case "sinh":
                    fTemp = Math.sinh(oCurrentBracket.dValue);
                    break;
                case "cosh":
                    fTemp = Math.cosh(oCurrentBracket.dValue);
                    break;
                case "tanh":
                    fTemp = Math.tanh(oCurrentBracket.dValue);
                    break;
                case "log":
                    oCurrentBracket.dValue = Math.log10(oCurrentBracket.dValue);
                    break;
                case "ln":
                    oCurrentBracket.dValue = ((-Math.log10(1-oCurrentBracket.dValue))/oCurrentBracket.dValue);
                    break;
            }
            oCurrentBracket.dValue = parseFloat(""+fTemp);
        }

        var oTempNumObjFinal = aNumObjs[oCurrentBracket.iNumObjArrayIndex];
        oTempNumObjFinal.dValue = oCurrentBracket.dValue;
        oTempNumObjFinal.bIsBracketPointer = false;
        if (aOperatorArray.length != 0 || sCurrentString !== "")
            dFinalResult = oCurrentBracket.dValue;

        return bValid;
    }

    var calculate = function(aOperatorArray) {
        var aCarryOverArray = [];
        var dResult = 0;
        var i=0;
        for(i=0; i<aOperatorArray.length; i++) {
            var a = aOperatorArray[i];
            var dPredecessor = 0, dSuccessor = 0;
            var bIsSPointer = false, bIsPPointer = false;
            
            if (!aNumObjs[a.iPredecessorIndex].bIsCarryOverPointer) {
                if (aNumObjs[a.iPredecessorIndex].bIsNegative) {
                    aNumObjs[a.iPredecessorIndex].dValue = aNumObjs[a.iPredecessorIndex].dValue * -1;
                    aNumObjs[a.iPredecessorIndex].bIsNegative = false;
                }
                dPredecessor = aNumObjs[a.iPredecessorIndex].dValue;
            } else {
                bIsPPointer = true;
                dPredecessor = aCarryOverArray[aNumObjs[a.iPredecessorIndex].dValue].dValue;
            }
            if (aNumObjs[a.iSuccessorIndex].bIsCarryOverPointer === false) {
                if (aNumObjs[a.iSuccessorIndex].bIsNegative) {
                    aNumObjs[a.iSuccessorIndex].dValue = aNumObjs[a.iSuccessorIndex].dValue * -1;
                    aNumObjs[a.iSuccessorIndex].bIsNegative = false;
                }
                dSuccessor = aNumObjs[a.iSuccessorIndex].dValue;
            } else {
                bIsSPointer = true;
                dSuccessor = aCarryOverArray[aNumObjs[a.iSuccessorIndex].dValue].dValue;
            }
            dResult = 0;
            var oTempNumObj;
            switch (a.cOperator) {
                case '@':
                    dResult = dPredecessor * dSuccessor;
                    break;
                case '^':
                    dResult = Math.pow(dPredecessor , dSuccessor);
                    break;
                case '/':
                    dResult = dPredecessor / dSuccessor;
                    break;
                case '*':
                    dResult = dPredecessor * dSuccessor;
                    break;
                case '+':
                    dResult = dPredecessor + dSuccessor;
                    break;
                case '-':
                    dResult = dPredecessor + dSuccessor;
                    break;
            }
            oTempNumObj = new NumObj(dResult);
            if (bIsSPointer && !bIsPPointer) {
                var oTempCNumObj = aCarryOverArray[aNumObjs[a.iSuccessorIndex].dValue];
                oTempCNumObj.dValue = dResult;

                oTempNumObj = new NumObj(aNumObjs[a.iSuccessorIndex].dValue);
                oTempNumObj.bIsCarryOverPointer = true;
                aNumObjs[a.iPredecessorIndex] = oTempNumObj;
            } else if (!bIsSPointer && bIsPPointer) {
                var oTempCNumObj = aCarryOverArray[aNumObjs[a.iPredecessorIndex].dValue];
                oTempCNumObj.dValue = dResult;

                oTempNumObj = new NumObj(aNumObjs[a.iPredecessorIndex].dValue);
                oTempNumObj.bIsCarryOverPointer = true;
                aNumObjs[a.iSuccessorIndex] = oTempNumObj;

            } else if (bIsSPointer && bIsPPointer) {
                var bAdded = false;
                var oTempCPNumObj = aCarryOverArray[aNumObjs[a.iPredecessorIndex].dValue];
                var oTempCSNumObj = aCarryOverArray[aNumObjs[a.iSuccessorIndex].dValue];

                if (oTempCPNumObj.isCarryOverPointer && !oTempCSNumObj.isCarryOverPointer) {
                    oTempCPNumObj.dValue = oTempNumObj.dValue;
                    aCarryOverArray[aNumObjs[a.iSuccessorIndex].dValue] = oTempCPNumObj;
                } else if (!oTempCPNumObj.bIsCarryOverPointer && oTempCSNumObj.bIsCarryOverPointer) {
                    oTempCSNumObj.dValue = oTempNumObj.dValue;
                    aCarryOverArray[aNumObjs[a.iPredecessorIndex].dValue] = oTempCSNumObj;
                } else if (oTempCPNumObj.bIsCarryOverPointer && oTempCSNumObj.bIsCarryOverPointer) {
                    oTempCPNumObj.dValue = oTempNumObj.dValue;
                    oTempCSNumObj.dValue = oTempNumObj.dValue;
                } else {
                    oTempNumObj.bIsCarryOverPointer = true;
                    aCarryOverArray.push(oTempNumObj);
                    aCarryOverArray[aNumObjs[a.iPredecessorIndex].dValue] = aCarryOverArray[aCarryOverArray.length - 1];
                    aCarryOverArray[aNumObjs[a.iSuccessorIndex].dValue] = aCarryOverArray[aCarryOverArray.length - 1];
                }
            } else {
                aCarryOverArray.push(oTempNumObj);
                oTempNumObj = new NumObj(aCarryOverArray.length - 1);
                oTempNumObj.bIsCarryOverPointer = true;
                aNumObjs[a.iPredecessorIndex]= oTempNumObj;
                aNumObjs[a.iSuccessorIndex] = oTempNumObj;
            }
        }
        return dResult;
    }

    var isLetter = function(char) {
        if (char.length === 1) {
            var check = char.match(/[a-z]/i);
            if (check) return true;
            else return false;
        }
        return false;
    }     
    
    analyseAndCalculate();
    console.log(dFinalResult);
    return dFinalResult;
}