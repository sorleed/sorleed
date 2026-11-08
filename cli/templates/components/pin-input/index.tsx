import React, { useRef } from "react";
import type { PinInputProps } from "../types";

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      length = 4,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onComplete,
      disabled = false,
      error = false,
      name,
      autoFocus = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue.slice(0, length));
    const value = isControlled ? controlledValue.slice(0, length) : internalValue;

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const updateValue = (nextVal: string) => {
      if (!isControlled) {
        setInternalValue(nextVal);
      }
      onChange?.(nextVal);
      if (nextVal.length === length) {
        onComplete?.(nextVal);
      }
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const char = e.target.value.slice(-1);
      if (char && !/^\d$/.test(char)) return;

      const chars = value.split("");
      chars[index] = char || "";
      const nextVal = chars.join("").trim();
      updateValue(nextVal);

      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!value[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted) {
        updateValue(pasted);
        const focusIdx = Math.min(pasted.length, length - 1);
        inputRefs.current[focusIdx]?.focus();
      }
    };

    const classes = [
      "fc-pin-input",
      error ? "fc-pin-input--error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} role="group" aria-label="PIN Input" {...props}>
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || "";
          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={char}
              disabled={disabled}
              autoFocus={autoFocus && index === 0}
              aria-label={`Digit ${index + 1} of ${length}`}
              className="fc-pin-input__cell"
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          );
        })}
        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  },
);

PinInput.displayName = "PinInput";
export default PinInput;
