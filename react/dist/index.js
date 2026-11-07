// button/index.tsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var variantClassMap = {
  primary: "fc-button--primary",
  secondary: "fc-button--secondary",
  ghost: "fc-button--ghost"
};
var Button = React.forwardRef(
  ({ variant = "primary", className, type = "button", children, ...props }, ref) => {
    const classes = [
      "fc-button",
      variantClassMap[variant],
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsx("button", { ref, type, className: classes, ...props, children });
  }
);
Button.displayName = "Button";
var button_default = Button;

// input/index.tsx
import React2, { useId } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Input = React2.forwardRef(
  ({
    label,
    hideLabel = false,
    helperText,
    errorMessage,
    className,
    id: providedId,
    type = "text",
    required,
    disabled,
    "aria-describedby": ariaDescribedBy,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);
    const describedByIds = [
      ariaDescribedBy,
      showMessage ? hasError ? errorId : helperId : void 0
    ].filter(Boolean).join(" ");
    const wrapperClasses = ["fc-input", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-input__label", hideLabel ? "fc-input__label--visually-hidden" : ""].filter(Boolean).join(" ");
    const messageClasses = ["fc-input__message", hasError ? "fc-input__message--error" : ""].filter(Boolean).join(" ");
    if (!wrapperClasses.includes("fc-input")) {
    }
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsx2("label", { className: labelClasses, htmlFor: id, children: label }),
      /* @__PURE__ */ jsx2("div", { className: "fc-input__control", children: /* @__PURE__ */ jsx2(
        "input",
        {
          ref,
          id,
          type,
          className: "fc-input__field",
          required,
          disabled,
          "aria-invalid": hasError ? true : void 0,
          "aria-describedby": describedByIds || void 0,
          ...props
        }
      ) }),
      showMessage && /* @__PURE__ */ jsx2("p", { id: hasError ? errorId : helperId, className: messageClasses, children: messageText })
    ] });
  }
);
Input.displayName = "Input";
var input_default = Input;

// password-input/index.tsx
import React3, { useId as useId2, useState } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var PasswordInput = React3.forwardRef(
  ({
    label,
    hideLabel = false,
    helperText,
    errorMessage,
    className,
    id: providedId,
    required,
    disabled,
    visible: controlledVisible,
    defaultVisible = false,
    onVisibleChange,
    showPasswordLabel = "Show password",
    hidePasswordLabel = "Hide password",
    "aria-describedby": ariaDescribedBy,
    ...props
  }, ref) => {
    const generatedId = useId2();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const isControlled = controlledVisible !== void 0;
    const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
    const isVisible = isControlled ? controlledVisible : uncontrolledVisible;
    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);
    const describedByIds = [
      ariaDescribedBy,
      showMessage ? hasError ? errorId : helperId : void 0
    ].filter(Boolean).join(" ");
    const wrapperClasses = ["fc-password-input", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-password-input__label", hideLabel ? "fc-password-input__label--visually-hidden" : ""].filter(Boolean).join(" ");
    const messageClasses = ["fc-password-input__message", hasError ? "fc-password-input__message--error" : ""].filter(Boolean).join(" ");
    const handleToggle = () => {
      if (disabled)
        return;
      const nextVisible = !isVisible;
      if (!isControlled) {
        setUncontrolledVisible(nextVisible);
      }
      onVisibleChange?.(nextVisible);
    };
    const toggleLabel = isVisible ? hidePasswordLabel : showPasswordLabel;
    return /* @__PURE__ */ jsxs2("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsx3("label", { className: labelClasses, htmlFor: id, children: label }),
      /* @__PURE__ */ jsxs2("div", { className: "fc-password-input__control", children: [
        /* @__PURE__ */ jsx3(
          "input",
          {
            ref,
            id,
            type: isVisible ? "text" : "password",
            className: "fc-password-input__field",
            required,
            disabled,
            "aria-invalid": hasError ? true : void 0,
            "aria-describedby": describedByIds || void 0,
            autoComplete: "current-password",
            ...props
          }
        ),
        /* @__PURE__ */ jsx3(
          "button",
          {
            type: "button",
            className: "fc-password-input__toggle",
            onClick: handleToggle,
            disabled,
            "aria-label": toggleLabel,
            "aria-pressed": isVisible,
            tabIndex: disabled ? -1 : 0,
            children: toggleLabel
          }
        )
      ] }),
      showMessage && /* @__PURE__ */ jsx3("p", { id: hasError ? errorId : helperId, className: messageClasses, children: messageText })
    ] });
  }
);
PasswordInput.displayName = "PasswordInput";
var password_input_default = PasswordInput;
export {
  Button,
  button_default as ButtonDefault,
  Input,
  input_default as InputDefault,
  PasswordInput,
  password_input_default as PasswordInputDefault
};
