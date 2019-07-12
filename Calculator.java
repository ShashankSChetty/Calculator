package com.example;

import java.util.ArrayList;
import java.util.Iterator;

class IntObj {
    double value;
    boolean isCarryOverPointer = false;
    boolean isBracketPointer = false;
    boolean isNegative = false;

    IntObj(double value) {
        this.value = value;
    }
}

class OperatorArray {
    char operator;
    int predecessorIndex;
    int successorIndex;

    OperatorArray(char operator, int predecessorIndex, int successorIndex) {
        this.operator = operator;
        this.predecessorIndex = predecessorIndex;
        this.successorIndex = successorIndex;
    }
}

class BracketArray {
    double value;
    int parentIndex;
    int intObjArrayIndex;
    int childBracketCount = 0;
    boolean isNegativeValue = false;
    String trigonometricFunction = "";

    ArrayList<OperatorArray> offOperatorArray = new ArrayList<>();
    ArrayList<OperatorArray> powOperatorArray = new ArrayList<>();
    ArrayList<OperatorArray> divOperatorArray = new ArrayList<>();
    ArrayList<OperatorArray> mulOperatorArray = new ArrayList<>();
    ArrayList<OperatorArray> addOperatorArray = new ArrayList<>();
    ArrayList<OperatorArray> subOperatorArray = new ArrayList<>();
}

class BracketOperatorCache {
    char operator = 'E';
    boolean hasStart = false;
    boolean hasEnd = false;
    int startIntObjIndex;
    int endIntObjIndex;
}
//π = 3.1415926535897932
public class MyMainClass {

    static String input = "sin(45)";// "(17860/10786+18670--76830/(6782*3786)/6781+15786*7865+7686/673--478678-878678*575)/((17860/10786+18670--76830/6782*3786/6781+15786*7865+7686/673-(-478678-(878678*575))))";//"(1/2*-(2+3-4)--2-(5*6)*4*(2+(3+4)*(7-8))+7)";////"10/10+20.4+10.1-30/2*5*3/1";//;//
    private static StringBuilder exp;
    private static ArrayList<IntObj> intObjs = new ArrayList<>();
    private static ArrayList<BracketArray> bracketArray = new ArrayList<>();
    private static double finalResult = 0;
    private static boolean toRadians = true;

    public static void main(String args[]) {

        input = replaceConstants(input);
        exp = new StringBuilder(input);
        exp.insert(0,'(');
        exp.append(')');
        System.out.println("Input = " + exp.toString());
        System.out.println(System.currentTimeMillis());
        boolean isValid = analyseString();
        System.out.println(System.currentTimeMillis());
        System.out.println("Result intObjs= " + intObjs.get(0).value);
        System.out.println("Result finalResult= " + finalResult);
    }
    private static String replaceConstants(String input) {

        input = input.replaceAll("π","(3.1415926535897932)");
        input = input.replaceAll("e","(2.7182818284590452)");
        return input;
    }

    private static boolean analyseString() {
        int i = 0;
        int predecessorIndex = 0, successorIndex;
        int currentParent = -1;
        char[] expChar = exp.toString().toCharArray();
        char currentOperator = 'E'; // E = Empty
        boolean bracketClosed = false;
        boolean operatorFound = false;
        boolean valid = true;
        boolean isNewBracketNegative = false;
        IntObj temp;
        StringBuilder currentNumberString = new StringBuilder("");
        String currentTrigonometricFunction = "";
        BracketArray currentBracket = new BracketArray();
        ArrayList<BracketOperatorCache> bracketOperatorCache = new ArrayList<>();
        BracketOperatorCache tempBCache;
        BracketArray parentBracket;

        for (i = 0; i < expChar.length; i++) {
            if (Character.isDigit(expChar[i])) {
                currentNumberString.append(expChar[i]);
                continue;
            }
            if(Character.isLetter(expChar[i])) {
                switch (expChar[i]) {
                    case 's':
                        if(expChar[i+1] == 'i' && expChar[i+2] == 'n' && expChar[i+3] =='(') {
                            currentTrigonometricFunction = "sin";
                            i=i+3;
                        }
                        else if(expChar[i+1] == 'i' && expChar[i+2] == 'n' && expChar[i+3] =='h' && expChar[i+4] =='(') {
                            currentTrigonometricFunction = "sinh";
                            i=i+4;
                        }
                        else
                            valid = false;
                        break;
                    case 'c':
                        if(expChar[i+1] == 'o' && expChar[i+2] == 's' && expChar[i+3] =='(') {
                            currentTrigonometricFunction = "cos";
                            i=i+3;
                        }
                        else if(expChar[i+1] == 'o' && expChar[i+2] == 'o' && expChar[i+3] =='h' && expChar[i+4] =='(') {
                            currentTrigonometricFunction = "cosh";
                            i=i+4;
                        }
                        else
                            valid = false;
                        break;
                    case 't':
                        if(expChar[i+1] == 'a' && expChar[i+2] == 'n' && expChar[i+3] =='(') {
                            currentTrigonometricFunction = "tan";
                            i=i+3;
                        }
                        else if(expChar[i+1] == 'a' && expChar[i+2] == 'n' && expChar[i+3] =='h' && expChar[i+4] =='(') {
                            currentTrigonometricFunction = "tanh";
                            i=i+4;
                        }
                        else
                            valid = false;
                        break;
                    case 'l':
                        if(expChar[i+1] == 'o' && expChar[i+2] == 'g' && expChar[i+3] =='(') {
                            currentTrigonometricFunction ="log";
                            i=i+3;
                        }
                        else if(expChar[i+1] == 'n' && expChar[i+2] =='(') {
                            currentTrigonometricFunction = "ln";
                            i=i+2;
                        }
                        else
                            valid = false;
                        break;
                }
                if(!valid) break;
            }
            switch (expChar[i]) {
                case '.':
                    currentNumberString.append(expChar[i]);
                    break;
                case '(' :
                    if (currentNumberString.toString().equals("-")) {
                        isNewBracketNegative = true;
                        currentNumberString = new StringBuilder("");
                    }

                    if (!currentNumberString.toString().equals("")) {
                        temp = new IntObj(Double.parseDouble(currentNumberString.toString()));
                        intObjs.add(temp);
                    }

                    currentBracket = new BracketArray();
                    currentBracket.parentIndex = currentParent;
                    currentBracket.intObjArrayIndex = intObjs.size();
                    currentBracket.isNegativeValue = isNewBracketNegative;
                    if(!currentTrigonometricFunction.equals("")) {
                        currentBracket.trigonometricFunction = currentTrigonometricFunction;
                        currentTrigonometricFunction = "";
                    }
                    bracketArray.add(currentBracket);
                    currentParent = bracketArray.size() - 1;

                    temp = new IntObj(bracketArray.size() - 1);
                    temp.isBracketPointer = true;
                    if (currentOperator == '-') temp.isNegative = true;
                    intObjs.add(temp);

                    if (i == 0) continue;
                    parentBracket = bracketArray.get(currentBracket.parentIndex);
                    parentBracket.childBracketCount++;
                    tempBCache = new BracketOperatorCache();
                    if (operatorFound) {
                        if (!bracketClosed)
                            predecessorIndex = intObjs.size() - 2;
                        bracketClosed = false;
                        successorIndex = intObjs.size() - 1;
                        addToOperatorArray(currentOperator, predecessorIndex, successorIndex, parentBracket);
                        currentOperator = 'E';
//                        operatorFound = false;
                    }
                    if (currentNumberString.toString().equals("")) {
                        tempBCache.hasStart = true;
                        tempBCache.startIntObjIndex = currentBracket.intObjArrayIndex;
                    } else {
                        currentNumberString = new StringBuilder("");
                        tempBCache.hasStart = true;
                        tempBCache.startIntObjIndex = intObjs.size() - 2;
                        tempBCache.hasEnd = true;
                        tempBCache.endIntObjIndex = currentBracket.intObjArrayIndex;
                        if (currentOperator == 'E') currentOperator = '@';
                        tempBCache.operator = currentOperator;
                    }
                    bracketOperatorCache.add(tempBCache);
                    currentOperator = 'E';
                    operatorFound = false;
                    break;
                default:
                    if (expChar[i] == '-') {
                        if (i == 0 && Character.isDigit(expChar[i + 1])) {
                            currentNumberString.append(expChar[i]);
                            continue;
                        } else if (i != 0 && !Character.isDigit(expChar[i - 1]) && (Character.isDigit(expChar[i + 1]) || expChar[i + 1] == '(') && expChar[i - 1] != ')') {
                            currentNumberString.append(expChar[i]);
                            continue;
                        } else {
                            if (i != 0 && (!Character.isDigit(expChar[i - 1]) && !Character.isDigit(expChar[i + 1])) && (expChar[i + 1] != '(' && expChar[i - 1] != ')')) {
                                System.out.println("Invalid String!!");
                                valid = false;
                                break;
                            }
                        }
                    }
                    if (!currentNumberString.toString().equals("") || bracketClosed) {
                        if (!currentNumberString.toString().equals("")) {
                            temp = new IntObj(Double.parseDouble(currentNumberString.toString()));
                            intObjs.add(temp);
                        }
                        if (operatorFound) {
                            if (!bracketClosed)
                                predecessorIndex = intObjs.size() - 2;
                            bracketClosed = false;
                            successorIndex = intObjs.size() - 1;

                            addToOperatorArray(currentOperator, predecessorIndex, successorIndex, currentBracket);
                            currentOperator = 'E';
                            operatorFound = false;
                        }
                        switch (expChar[i]) {
                            case '^':
                                currentOperator = '^';
                                operatorFound = true;
                                break;
                            case '/':
                                currentOperator = '/';
                                operatorFound = true;
                                break;
                            case '*':
                                currentOperator = '*';
                                operatorFound = true;
                                break;
                            case '+':
                                currentOperator = '+';
                                operatorFound = true;
                                break;
                            case '-':
                                currentOperator = '-';
                                operatorFound = true;
                                break;
                        }
                    }

                    if (expChar[i] == ')' && i < expChar.length - 1) {
                        bracketClosed = true;
                        tempBCache = bracketOperatorCache.get(bracketOperatorCache.size() - 1);
                        if (currentBracket.childBracketCount == 0) {
                            calculateBracketValue(currentBracket, currentNumberString.toString());
                        }
                        currentParent = currentBracket.parentIndex;
                        if (currentParent == -1) continue;
                        currentBracket = bracketArray.get(currentParent);
                        currentBracket.childBracketCount--;
                        if (tempBCache.hasStart && !tempBCache.hasEnd) {
                            predecessorIndex = tempBCache.startIntObjIndex;
                            if (i + 1 < expChar.length) {
                                if (Character.isDigit(expChar[i + 1]) || expChar[i + 1] == '('|| Character.isLetter(expChar[i+1])) {
                                    currentOperator = '@';
                                    operatorFound = true;
                                }
                            }
                        } else {
                            predecessorIndex = tempBCache.startIntObjIndex;
                            successorIndex = tempBCache.endIntObjIndex;

                            addToOperatorArray(tempBCache.operator, predecessorIndex, successorIndex, currentBracket);
                            predecessorIndex = tempBCache.endIntObjIndex;
                            if (i + 1 < expChar.length) {
                                if (Character.isDigit(expChar[i + 1]) || expChar[i + 1] == '(') {
                                    currentOperator = '@';
                                    operatorFound = true;
                                }
                            }
                        }
                        bracketOperatorCache.remove(bracketOperatorCache.size() - 1);
                    } else {
                        if (expChar[i] == ')' && i == expChar.length - 1) {
                            if (currentBracket.childBracketCount == 0) {
                                calculateBracketValue(currentBracket, currentNumberString.toString());
                            }
                        }
                    }
                    currentNumberString = new StringBuilder("");
                    break;
            }
        }
        //if (!valid) return valid;
        return valid;
    }

    private static void addToOperatorArray(char operator, int predecessorIndex, int successorIndex, BracketArray currentBracket) {
        OperatorArray tempOpArray;
        switch (operator) {
            case '@':
                tempOpArray = new OperatorArray('@', predecessorIndex, successorIndex);
                currentBracket.offOperatorArray.add(tempOpArray);
                break;
            case '^':
                tempOpArray = new OperatorArray('^', predecessorIndex, successorIndex);
                currentBracket.powOperatorArray.add(tempOpArray);
                break;
            case '/':
                tempOpArray = new OperatorArray('/', predecessorIndex, successorIndex);
                currentBracket.divOperatorArray.add(tempOpArray);
                break;
            case '*':
                tempOpArray = new OperatorArray('*', predecessorIndex, successorIndex);
                currentBracket.mulOperatorArray.add(tempOpArray);
                break;
            case '+':
                tempOpArray = new OperatorArray('+', predecessorIndex, successorIndex);
                currentBracket.addOperatorArray.add(tempOpArray);
                break;
            case '-':
                IntObj temp = intObjs.get(successorIndex);
                temp.isNegative = true;
                tempOpArray = new OperatorArray('-', predecessorIndex, successorIndex);
                currentBracket.subOperatorArray.add(tempOpArray);
                break;
        }
    }

    private static boolean calculateBracketValue(BracketArray currentBracket, String currentString) {
        boolean valid = true;

        ArrayList<OperatorArray> operatorArray = new ArrayList<>();
        operatorArray.addAll(currentBracket.offOperatorArray);
        operatorArray.addAll(currentBracket.powOperatorArray);
        operatorArray.addAll(currentBracket.divOperatorArray);
        operatorArray.addAll(currentBracket.mulOperatorArray);
        operatorArray.addAll(currentBracket.addOperatorArray);
        operatorArray.addAll(currentBracket.subOperatorArray);

        if(operatorArray.size() == 0) {
            if(!currentString.equals(""))
                currentBracket.value = Double.parseDouble(currentString);
            else
                currentBracket.value = finalResult;
        }
        else
            currentBracket.value = calculate(operatorArray);

        if (currentBracket.isNegativeValue)
            currentBracket.value = currentBracket.value * -1;

        if(!currentBracket.trigonometricFunction.equals("")){
            if(toRadians && !currentBracket.trigonometricFunction.equals("log") && !currentBracket.trigonometricFunction.equals("ln"))
                currentBracket.value = Math.toRadians(currentBracket.value);
            float temp = 0;
            switch (currentBracket.trigonometricFunction) {
                case "sin":
                    temp = (float)Math.sin(currentBracket.value);
                    break;
                case "cos":
                    temp = (float)Math.cos(currentBracket.value);
                    break;
                case "tan":
                    temp = (float)Math.tan(currentBracket.value);
                    break;
                case "sinh":
                    temp = (float)Math.sinh(currentBracket.value);
                    break;
                case "cosh":
                    temp = (float)Math.cosh(currentBracket.value);
                    break;
                case "tanh":
                    temp = (float)Math.tanh(currentBracket.value);
                    break;
                case "log":
                    currentBracket.value = Math.log10(currentBracket.value);
                    break;
                case "ln":
                    currentBracket.value = ((-Math.log10(1-currentBracket.value))/currentBracket.value);
                    break;
            }
            currentBracket.value = Double.parseDouble(Float.toString(temp));
        }

        IntObj tempFinal = intObjs.get(currentBracket.intObjArrayIndex);
        tempFinal.value = currentBracket.value;
        tempFinal.isBracketPointer = false;
        if (operatorArray.size() != 0 || !currentString.equals(""))
            finalResult = currentBracket.value;

        return valid;
    }

    private static double calculate(ArrayList<OperatorArray> operatorArray) {
        ArrayList<IntObj> carryOverArray = new ArrayList<>();
        Iterator itr = operatorArray.iterator();
        double result = 0;
        while (itr.hasNext()) {
            OperatorArray a = (OperatorArray) itr.next();
            double predecessor = 0, sucessor = 0;
            boolean isSPointer = false, isPPointer = false;
            if (!intObjs.get(a.predecessorIndex).isCarryOverPointer) {
                if (intObjs.get(a.predecessorIndex).isNegative) {
                    intObjs.get(a.predecessorIndex).value = intObjs.get(a.predecessorIndex).value * -1;
                    intObjs.get(a.predecessorIndex).isNegative = false;
                }
                predecessor = intObjs.get(a.predecessorIndex).value;
            } else {
                isPPointer = true;
                predecessor = carryOverArray.get((int) intObjs.get(a.predecessorIndex).value).value;
            }
            if (!intObjs.get(a.successorIndex).isCarryOverPointer) {
                if (intObjs.get(a.successorIndex).isNegative) {
                    intObjs.get(a.successorIndex).value = intObjs.get(a.successorIndex).value * -1;
                    intObjs.get(a.successorIndex).isNegative = false;
                }
                sucessor = intObjs.get(a.successorIndex).value;
            } else {
                isSPointer = true;
                sucessor = carryOverArray.get((int) intObjs.get(a.successorIndex).value).value;
            }
            result = 0;
            IntObj temp;
            switch (a.operator) {
                case '@':
                    result = predecessor * sucessor;
                    break;
                case '^':
                    result = Math.pow(predecessor , sucessor);
                    break;
                case '/':
                    result = predecessor / sucessor;
                    break;
                case '*':
                    result = predecessor * sucessor;
                    break;
                case '+':
                    result = predecessor + sucessor;
                    break;
                case '-':
                    result = predecessor + sucessor;
                    break;
            }
            temp = new IntObj(result);
            if (isSPointer && !isPPointer) {
                IntObj tempC = carryOverArray.get((int) intObjs.get(a.successorIndex).value);
                tempC.value = result;

                temp = new IntObj(intObjs.get(a.successorIndex).value);
                temp.isCarryOverPointer = true;
                intObjs.set(a.predecessorIndex, temp);
            } else if (!isSPointer && isPPointer) {
                IntObj tempC = carryOverArray.get((int) intObjs.get(a.predecessorIndex).value);
                tempC.value = result;

                temp = new IntObj(intObjs.get(a.predecessorIndex).value);
                temp.isCarryOverPointer = true;
                intObjs.set(a.successorIndex, temp);

            } else if (isSPointer && isPPointer) {
                boolean added = false;
                IntObj tempCP = carryOverArray.get((int) intObjs.get(a.predecessorIndex).value);
                IntObj tempCS = carryOverArray.get((int) intObjs.get(a.successorIndex).value);

                if (tempCP.isCarryOverPointer && !tempCS.isCarryOverPointer) {
                    tempCP.value = temp.value;
                    carryOverArray.set((int) intObjs.get(a.successorIndex).value, tempCP);
                } else if (!tempCP.isCarryOverPointer && tempCS.isCarryOverPointer) {
                    tempCS.value = temp.value;
                    carryOverArray.set((int) intObjs.get(a.predecessorIndex).value, tempCS);
                } else if (tempCP.isCarryOverPointer && tempCS.isCarryOverPointer) {
                    tempCP.value = temp.value;
                    tempCS.value = temp.value;
                } else {
                    temp.isCarryOverPointer = true;
                    carryOverArray.add(temp);
                    carryOverArray.set((int) intObjs.get(a.predecessorIndex).value, carryOverArray.get(carryOverArray.size() - 1));
                    carryOverArray.set((int) intObjs.get(a.successorIndex).value, carryOverArray.get(carryOverArray.size() - 1));
                }
            } else {
                carryOverArray.add(temp);
                temp = new IntObj(carryOverArray.size() - 1);
                temp.isCarryOverPointer = true;
                intObjs.set(a.predecessorIndex, temp);
                intObjs.set(a.successorIndex, temp);
            }
        }
        return result;
    }
}