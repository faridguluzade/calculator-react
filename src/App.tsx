import { useReducer } from "react";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import "./App.css";

type State = {
  currentOperand: string;
  previousOperand: string;
  operation: string;
  overwrite: boolean;
};

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const calculate = function (state: State): string {
  const { currentOperand, previousOperand, operation } = state;

  let current =
    currentOperand === "." ? parseFloat("0.") : parseFloat(currentOperand);
  let prev = parseFloat(previousOperand);

  console.log({ currentOperand, previousOperand });

  if (isNaN(current) && isNaN(prev)) return "";
  let computation: number | string = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }

  return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = function (operand: any): any {
  if (operand === "") return;

  const [integer, decimal] = operand.split(".");

  if (decimal === undefined) return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const calculatorReducer = (state: State, action: any): State => {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === "" && state.previousOperand === "") {
        return state;
      }

      if (state.currentOperand === "") {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand === "") {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: "",
        };
      }
      return {
        ...state,
        previousOperand: calculate(state),
        operation: payload.operation,
        currentOperand: "",
      };

    case ACTIONS.EVALUATE:
      if (
        state.currentOperand === "" ||
        state.previousOperand === "" ||
        state.operation === ""
      )
        return state;

      return {
        ...state,
        overwrite: true,
        previousOperand: "",
        operation: "",
        currentOperand: calculate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "",
        };
      }

      if (state.currentOperand === "") {
        return { ...state, currentOperand: "0" };
      }

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: "" };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {
        overwrite: true,
        currentOperand: "0",
        previousOperand: "",
        operation: "",
      };
    default:
      throw new Error("Unhandled action");
  }
};

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    calculatorReducer,
    {
      currentOperand: "0",
      previousOperand: "",
      operation: "",
      overwrite: false,
    }
  );

  return (
    <div className="calculator">
      <div className="output calculator-screen">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <div className="calculator-keys">
        <OperationButton operation={"+"} dispatch={dispatch} />
        <OperationButton operation={"-"} dispatch={dispatch} />

        <OperationButton operation={"/"} dispatch={dispatch} />
        <OperationButton operation={"*"} dispatch={dispatch} />

        <DigitButton digit={"7"} dispatch={dispatch} />
        <DigitButton digit={"8"} dispatch={dispatch} />
        <DigitButton digit={"9"} dispatch={dispatch} />
        <DigitButton digit={"4"} dispatch={dispatch} />
        <DigitButton digit={"5"} dispatch={dispatch} />
        <DigitButton digit={"6"} dispatch={dispatch} />
        <DigitButton digit={"1"} dispatch={dispatch} />
        <DigitButton digit={"2"} dispatch={dispatch} />
        <DigitButton digit={"3"} dispatch={dispatch} />
        <DigitButton className="zero-sign" digit={"0"} dispatch={dispatch} />
        <DigitButton digit={"."} dispatch={dispatch} />

        <button
          className="del"
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <button
          className="all-clear"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          className="operator equal-sign"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
