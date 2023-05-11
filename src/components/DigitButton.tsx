import React from "react";
import { ACTIONS } from "../App";

function DigitButton(props: any) {
  const { dispatch, digit, className } = props;

  return (
    <button
      className={className}
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}

export default DigitButton;
