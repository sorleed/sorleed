var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// phone-input/index.tsx
import { forwardRef, useEffect, useId, useMemo, useState } from "react";
import * as libphonenumber from "libphonenumber-js";
import { jsx, jsxs } from "react/jsx-runtime";
var getLib = () => {
  try {
    if (libphonenumber && (libphonenumber.getCountries || libphonenumber.parsePhoneNumberFromString)) {
      return libphonenumber;
    }
    if (libphonenumber.default) {
      return libphonenumber.default;
    }
  } catch {
  }
  try {
    if (typeof __require !== "undefined") {
      return __require("libphonenumber-js");
    }
  } catch {
  }
  return null;
};
function getCountriesList() {
  const lib = getLib();
  if (!lib)
    return [];
  try {
    const codes = lib.getCountries ? lib.getCountries() : [];
    return codes.map((code) => {
      try {
        const dialCode = lib.getCountryCallingCode ? lib.getCountryCallingCode(code) : "";
        return { code, name: code, dialCode };
      } catch {
        return { code, name: code, dialCode: "" };
      }
    });
  } catch {
    return [];
  }
}
function inferCountryFromNumber(value) {
  const lib = getLib();
  if (!lib || !value)
    return void 0;
  try {
    if (typeof lib.parsePhoneNumberFromString === "function") {
      const parsed = lib.parsePhoneNumberFromString(value);
      if (parsed && parsed.country)
        return parsed.country;
    }
    if (typeof lib.parsePhoneNumber === "function") {
      const parsed = lib.parsePhoneNumber(value);
      if (parsed && parsed.country)
        return parsed.country;
    }
  } catch {
  }
  return void 0;
}
function validateNumber(value) {
  const lib = getLib();
  if (!value || value.trim() === "") {
    return { status: "empty", isValid: false };
  }
  if (!lib) {
    if (value.startsWith("+")) {
      return { status: "incomplete", isValid: false };
    }
    return { status: "incomplete", isValid: false };
  }
  try {
    if (typeof lib.isValidPhoneNumber === "function") {
      const isValid = lib.isValidPhoneNumber(value);
      if (isValid) {
        try {
          if (typeof lib.parsePhoneNumberFromString === "function") {
            const parsed = lib.parsePhoneNumberFromString(value);
            if (parsed && typeof parsed.number === "string") {
              return { e164: parsed.number, status: "valid", isValid: true };
            }
          }
        } catch {
        }
        return { status: "valid", isValid: true };
      }
    }
    if (typeof lib.parsePhoneNumberFromString === "function") {
      const parsed = lib.parsePhoneNumberFromString(value);
      if (parsed) {
        if (typeof parsed.isPossible === "function") {
          if (parsed.isPossible()) {
            return { status: "incomplete", isValid: false };
          }
        }
        return { status: "invalid", isValid: false };
      }
    }
  } catch {
  }
  if (value.startsWith("+")) {
    return { status: "incomplete", isValid: false };
  }
  return { status: "incomplete", isValid: false };
}
var PhoneInput = forwardRef(
  ({
    label,
    hideLabel = false,
    helperText,
    errorMessage,
    className,
    id: providedId,
    value: controlledValue,
    defaultValue = "",
    country: controlledCountry,
    defaultCountry,
    onCountryChange,
    countries: allowedCountries,
    international = true,
    onChange,
    required,
    disabled,
    readOnly,
    name,
    "aria-describedby": ariaDescribedBy,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const countrySelectId = `${id}-country`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const isControlled = controlledValue !== void 0;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
    const [initialDefault] = useState(defaultValue || "");
    useEffect(() => {
      if (!isControlled && defaultValue !== void 0 && uncontrolledValue === initialDefault && defaultValue !== uncontrolledValue) {
        setUncontrolledValue(defaultValue || "");
      }
    }, [defaultValue, isControlled, initialDefault, uncontrolledValue]);
    const inputValue = isControlled ? controlledValue : uncontrolledValue;
    const [uncontrolledCountry, setUncontrolledCountry] = useState(defaultCountry);
    const [selectedCountry, setSelectedCountry] = useState(controlledCountry);
    useEffect(() => {
      if (controlledCountry !== void 0) {
        setSelectedCountry(controlledCountry);
      }
    }, [controlledCountry]);
    useEffect(() => {
      if (selectedCountry)
        return;
      if (controlledCountry)
        return;
      if (uncontrolledCountry)
        return;
      if (inputValue && inputValue.startsWith("+")) {
        const inferred = inferCountryFromNumber(inputValue);
        if (inferred) {
          setSelectedCountry(inferred);
        }
      }
    }, [inputValue, selectedCountry, controlledCountry, uncontrolledCountry]);
    const countryList = useMemo(() => {
      const all = getCountriesList();
      if (allowedCountries && allowedCountries.length > 0) {
        return all.filter((c) => allowedCountries.includes(c.code));
      }
      return all;
    }, [allowedCountries]);
    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);
    const describedByIds = [
      ariaDescribedBy,
      showMessage ? hasError ? errorId : helperId : void 0
    ].filter(Boolean).join(" ");
    const wrapperClasses = ["fc-phone-input", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-phone-input__label", hideLabel ? "fc-phone-input__label--visually-hidden" : ""].filter(Boolean).join(" ");
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      const val = validateNumber(newValue);
      const result = {
        inputValue: newValue,
        e164: val.e164,
        country: selectedCountry || uncontrolledCountry,
        status: val.status,
        isValid: val.isValid
      };
      if (onChange) {
        onChange(result);
      }
    };
    const handleCountryChange = (e) => {
      const newCountry = e.target.value || void 0;
      if (controlledCountry === void 0) {
        setUncontrolledCountry(newCountry);
        setSelectedCountry(newCountry);
      } else {
        setSelectedCountry(newCountry);
      }
      if (onCountryChange) {
        onCountryChange(newCountry);
      }
    };
    const currentCountry = controlledCountry !== void 0 ? controlledCountry : selectedCountry || uncontrolledCountry;
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsx("label", { className: labelClasses, htmlFor: id, children: label }),
      /* @__PURE__ */ jsxs("div", { className: "fc-phone-input__row", children: [
        /* @__PURE__ */ jsxs("div", { className: "fc-phone-input__country", children: [
          /* @__PURE__ */ jsx("label", { className: "fc-phone-input__country-label", htmlFor: countrySelectId, children: "Country" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "fc-phone-input__country-select",
              id: countrySelectId,
              value: currentCountry || "",
              onChange: handleCountryChange,
              disabled,
              "aria-label": "Country",
              children: [
                !currentCountry && /* @__PURE__ */ jsx("option", { value: "", children: "Select country" }),
                countryList.map((c) => /* @__PURE__ */ jsxs("option", { value: c.code, children: [
                  c.name,
                  " ",
                  c.dialCode ? `(+${c.dialCode})` : ""
                ] }, c.code))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "fc-phone-input__control", children: /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            className: "fc-phone-input__field",
            id,
            name,
            type: "tel",
            inputMode: "tel",
            autoComplete: "tel",
            value: inputValue,
            onChange: handleInputChange,
            required,
            disabled,
            readOnly,
            "aria-invalid": hasError ? "true" : void 0,
            "aria-describedby": describedByIds || void 0,
            ...props
          }
        ) })
      ] }),
      showMessage && /* @__PURE__ */ jsx(
        "p",
        {
          className: hasError ? "fc-phone-input__message fc-phone-input__message--error" : "fc-phone-input__message",
          id: hasError ? errorId : helperId,
          children: messageText
        }
      )
    ] });
  }
);
PhoneInput.displayName = "PhoneInput";
var phone_input_default = PhoneInput;
export {
  PhoneInput,
  phone_input_default as default
};
