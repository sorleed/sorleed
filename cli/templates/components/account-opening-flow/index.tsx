import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { IbanAccountDetails } from "../iban-account-details";
import { Input } from "../input";
import { KycDocUploader } from "../kyc-doc-uploader";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { AccountOpeningFlowProps } from "../types";

const DEFAULT_CURRENCIES = ["USD", "EUR", "GBP", "NGN"];
const DEFAULT_COUNTRIES = ["United States", "United Kingdom", "Germany", "Nigeria", "Canada"];

type OpeningStatus = "filling" | "uploading" | "reviewing" | "success" | "manual-review" | "error";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBuilding = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
  </svg>
);

const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconRotate = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);

export const AccountOpeningFlow = React.forwardRef<HTMLDivElement, AccountOpeningFlowProps>(
  (
    {
      title = "Open a financial account",
      accountType: initialAccountType = "individual",
      initialCurrency = "USD",
      currencies = DEFAULT_CURRENCIES,
      countries = DEFAULT_COUNTRIES,
      onComplete,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"individual" | "business">(initialAccountType);
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<OpeningStatus>("filling");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [currency, setCurrency] = useState<string>(initialCurrency);
    const [country, setCountry] = useState<string>(countries[0] || "United States");

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [dob, setDob] = useState<string>("");
    const [idType, setIdType] = useState<string>("passport");
    const [idFileName, setIdFileName] = useState<string>("");
    const [selfieMethod, setSelfieMethod] = useState<string>("liveness");
    const [selfieDone, setSelfieDone] = useState<boolean>(false);

    const [companyName, setCompanyName] = useState<string>("");
    const [regNumber, setRegNumber] = useState<string>("");
    const [incorporationFile, setIncorporationFile] = useState<string>("");
    const [addressProofFile, setAddressProofFile] = useState<string>("");
    const [directorName, setDirectorName] = useState<string>("");
    const [ownershipPct, setOwnershipPct] = useState<string>("100");
    const [directorIdFile, setDirectorIdFile] = useState<string>("");

    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
    const [openedAccountNo, setOpenedAccountNo] = useState<string>("");
    const [uploaderKey, setUploaderKey] = useState<number>(0);

    const stepLabels =
      accountType === "individual"
        ? ["Details", "ID upload", "Selfie", "Review"]
        : ["Company", "Documents", "Owners", "Review"];

    const resetFlow = (nextType: "individual" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("filling");
      setErrorMessage("");
      setFullName("");
      setEmail("");
      setDob("");
      setIdFileName("");
      setSelfieDone(false);
      setCompanyName("");
      setRegNumber("");
      setIncorporationFile("");
      setAddressProofFile("");
      setDirectorName("");
      setOwnershipPct("100");
      setDirectorIdFile("");
      setAcceptedTerms(false);
      setOpenedAccountNo("");
      setUploaderKey((k) => k + 1);
    };

    const handleNext = () => {
      setErrorMessage("");
      if (step === 1) {
        if (accountType === "individual") {
          if (!fullName.trim() || !email.trim() || !dob.trim()) {
            setStatus("error");
            setErrorMessage("Enter your full legal name, email address, and date of birth.");
            return;
          }
        } else {
          if (!companyName.trim() || !regNumber.trim()) {
            setStatus("error");
            setErrorMessage("Enter the registered company name and registration number.");
            return;
          }
        }
        setStatus("uploading");
        setStep(2);
        return;
      }

      if (step === 2) {
        if (accountType === "individual" && !idFileName) {
          setStatus("error");
          setErrorMessage("Upload a clear image or PDF of your government ID.");
          return;
        }
        if (accountType === "business" && (!incorporationFile || !addressProofFile)) {
          setStatus("error");
          setErrorMessage("Upload both the Certificate of Incorporation and proof of registered address.");
          return;
        }
        setStatus("filling");
        setStep(3);
        return;
      }

      if (step === 3) {
        if (accountType === "individual" && !selfieDone) {
          setStatus("error");
          setErrorMessage("Complete the selfie check before proceeding to review.");
          return;
        }
        if (accountType === "business" && (!directorName.trim() || !directorIdFile)) {
          setStatus("error");
          setErrorMessage("Provide beneficial owner details and upload their ID document.");
          return;
        }
        setStatus("reviewing");
        setStep(4);
      }
    };

    const handleBack = () => {
      setErrorMessage("");
      setStatus(step === 3 ? "uploading" : "filling");
      setStep((s) => Math.max(1, s - 1));
    };

    const handleSubmit = (forceManualReview = false) => {
      setErrorMessage("");
      if (!acceptedTerms) {
        setStatus("error");
        setErrorMessage("Confirm the account agreement and accuracy statement before submitting.");
        return;
      }

      const nextNo = `US88-${Math.floor(10000000 + Math.random() * 89999999)}`;
      const needsManualReview =
        forceManualReview || (accountType === "business" && Number(ownershipPct) < 25);
      const finalStatus = needsManualReview ? "manual-review" : "success";
      setOpenedAccountNo(nextNo);
      setStatus(finalStatus);

      onComplete?.({
        accountType,
        name: accountType === "individual" ? fullName : companyName,
        country,
        currency,
        accountNumber: nextNo,
        status: needsManualReview ? "manual_review" : "created",
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-account-open-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-account-open-flow__header">
              <span>{title}</span>
              <Badge variant={status === "success" ? "success" : status === "manual-review" ? "warning" : "info"}>
                {status === "success"
                  ? "Account active"
                  : status === "manual-review"
                    ? "Manual review"
                    : `Step ${step}/4`}
              </Badge>
            </div>
          }
          description="Open a personal or business multi-currency account with guided onboarding."
          footer={
            <div className="fc-account-open-flow__actions">
              {status !== "success" && status !== "manual-review" ? (
                <>
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                    <span className="fc-account-open-flow__btn-inner">
                      <IconArrowLeft /> Back
                    </span>
                  </Button>
                  <div className="fc-account-open-flow__actions-right">
                    {step < 4 ? (
                      <Button variant="primary" onClick={handleNext}>
                        <span className="fc-account-open-flow__btn-inner">
                          Next <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <>
                        <Button variant="secondary" onClick={() => handleSubmit(true)}>
                          Submit for review
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit(false)}>
                          <span className="fc-account-open-flow__btn-inner">
                            <IconCheck /> Submit
                          </span>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => resetFlow()}>
                    <span className="fc-account-open-flow__btn-inner">
                      <IconRotate /> Restart
                    </span>
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-account-open-flow__stack">
            <div className="fc-account-open-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => resetFlow(val as "individual" | "business")}
              >
                <TabsList aria-label="Account path">
                  <TabsTrigger value="individual">
                    <span className="fc-account-open-flow__btn-inner">
                      <IconUser /> Personal
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="business">
                    <span className="fc-account-open-flow__btn-inner">
                      <IconBuilding /> Business
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="fc-account-open-flow__currency-wrap">
                <Select
                  label="Primary currency"
                  id={`${baseId}-currency`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={status === "success" || status === "manual-review"}
                >
                  {currencies.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <nav aria-label="Onboarding steps">
              <ol className="fc-account-open-flow__stepper" aria-live="polite">
                {stepLabels.map((label, idx) => {
                  const stepNum = idx + 1;
                  const isDone = step > stepNum || status === "success" || status === "manual-review";
                  const isCurrent = !isDone && step === stepNum;
                  return (
                    <li
                      key={label}
                      aria-current={isCurrent ? "step" : undefined}
                      className={[
                        "fc-account-open-flow__step",
                        isCurrent ? "fc-account-open-flow__step--active" : "",
                        isDone ? "fc-account-open-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-account-open-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : stepNum}
                      </span>
                      <span className="fc-account-open-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Action required">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" ? (
              <div className="fc-account-open-flow__stack">
                <Alert variant="success" title="Account created">
                  Your {accountType === "individual" ? "personal" : "business"} {currency} account is active and ready to receive funds.
                </Alert>
                <IbanAccountDetails
                  accountHolder={accountType === "individual" ? fullName || "Alex Rivera" : companyName || "Northstar Labs Inc."}
                  currency={currency}
                  railBadge={currency === "EUR" ? "SEPA Instant" : "Local Rails"}
                  bankName="Sorleed Partner Bank"
                  fields={[
                    { label: "Account number", value: openedAccountNo },
                    { label: "Country", value: country },
                    { label: "Status", value: "Active" },
                  ]}
                />
              </div>
            ) : status === "manual-review" ? (
              <Alert variant="warning" title="Manual review in progress">
                Reference {openedAccountNo} has been queued for specialist review. Expected turnaround is under 2 business hours.
              </Alert>
            ) : null}

            {status !== "success" && status !== "manual-review" && step === 1 ? (
              <div className="fc-account-open-flow__grid-2">
                {accountType === "individual" ? (
                  <>
                    <Input
                      label="Full legal name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Morgan Rivera"
                      required
                      aria-invalid={status === "error" && !fullName.trim() ? true : undefined}
                    />
                    <Input
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      required
                      aria-invalid={status === "error" && !email.trim() ? true : undefined}
                    />
                    <Input
                      label="Date of birth"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      helperText="Must match your government ID"
                      required
                      aria-invalid={status === "error" && !dob.trim() ? true : undefined}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Registered legal company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Northstar Logistics Ltd"
                      required
                      aria-invalid={status === "error" && !companyName.trim() ? true : undefined}
                    />
                    <Input
                      label="Registration / EIN number"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="REG-9482014"
                      required
                      aria-invalid={status === "error" && !regNumber.trim() ? true : undefined}
                    />
                  </>
                )}
                <Select
                  label={accountType === "individual" ? "Country of residence" : "Country of incorporation"}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {status !== "success" && status !== "manual-review" && step === 2 ? (
              <div className="fc-account-open-flow__stack">
                {accountType === "individual" ? (
                  <>
                    <RadioGroup
                      label="Government document type"
                      name={`${baseId}-id-type`}
                      value={idType}
                      onChange={setIdType}
                      options={[
                        { label: "Passport", value: "passport" },
                        { label: "National ID card", value: "national_id" },
                        { label: "Driver's license", value: "drivers_license" },
                      ]}
                    />
                    <KycDocUploader
                      key={`id-${uploaderKey}`}
                      title={`Upload ${idType.replace("_", " ")}`}
                      description="Make sure all four corners and photo details are clearly legible."
                      onFileSelect={(file) => setIdFileName(file.name)}
                      onFileRemove={() => setIdFileName("")}
                    />
                  </>
                ) : (
                  <div className="fc-account-open-flow__grid-2">
                    <KycDocUploader
                      key={`inc-${uploaderKey}`}
                      title="Certificate of incorporation"
                      description="Official registrar extract issued within 12 months."
                      onFileSelect={(file) => setIncorporationFile(file.name)}
                      onFileRemove={() => setIncorporationFile("")}
                    />
                    <KycDocUploader
                      key={`addr-${uploaderKey}`}
                      title="Proof of business address"
                      description="Utility bill, lease, or bank statement."
                      onFileSelect={(file) => setAddressProofFile(file.name)}
                      onFileRemove={() => setAddressProofFile("")}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {status !== "success" && status !== "manual-review" && step === 3 ? (
              <div className="fc-account-open-flow__stack">
                {accountType === "individual" ? (
                  <>
                    <RadioGroup
                      label="Selfie check method"
                      name={`${baseId}-selfie`}
                      value={selfieMethod}
                      onChange={setSelfieMethod}
                      options={[
                        { label: "Browser camera liveness check", value: "liveness" },
                        { label: "Continue on mobile phone QR", value: "mobile" },
                      ]}
                    />
                    <div className="fc-account-open-flow__inline-status">
                      <Button
                        variant={selfieDone ? "secondary" : "primary"}
                        onClick={() => setSelfieDone(true)}
                      >
                        <span className="fc-account-open-flow__btn-inner">
                          <IconCamera /> {selfieDone ? "Selfie captured" : "Capture live selfie"}
                        </span>
                      </Button>
                      <Badge variant={selfieDone ? "success" : "default"}>
                        {selfieDone ? "Liveness matched" : "Awaiting capture"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fc-account-open-flow__grid-2">
                      <Input
                        label="Beneficial owner / director full name"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        placeholder="Jordan Blake"
                        required
                      />
                      <Input
                        label="Ownership stake (%)"
                        type="number"
                        value={ownershipPct}
                        onChange={(e) => setOwnershipPct(e.target.value)}
                        helperText="Owners holding 25% or more require verification"
                      />
                    </div>
                    <KycDocUploader
                      key={`dir-${uploaderKey}`}
                      title="Beneficial owner photo ID"
                      description="Passport or national ID for the listed owner."
                      onFileSelect={(file) => setDirectorIdFile(file.name)}
                      onFileRemove={() => setDirectorIdFile("")}
                    />
                  </>
                )}
              </div>
            ) : null}

            {status !== "success" && status !== "manual-review" && step === 4 ? (
              <div className="fc-account-open-flow__stack">
                <div className="fc-account-open-flow__summary-box">
                  <div className="fc-account-open-flow__summary-row">
                    <span>Account type</span>
                    <strong>{accountType === "individual" ? "Personal" : "Business"} ({currency})</strong>
                  </div>
                  <div className="fc-account-open-flow__summary-row">
                    <span>Holder</span>
                    <strong>{accountType === "individual" ? fullName : companyName}</strong>
                  </div>
                  <div className="fc-account-open-flow__summary-row">
                    <span>Jurisdiction</span>
                    <strong>{country}</strong>
                  </div>
                  <div className="fc-account-open-flow__summary-row">
                    <span>Submitted records</span>
                    <strong>
                      {accountType === "individual"
                        ? `${idFileName} + Selfie`
                        : `${incorporationFile}, ${addressProofFile}, ${directorIdFile}`}
                    </strong>
                  </div>
                </div>

                <Checkbox
                  label="I confirm that the details and documents provided are accurate and authorize account creation."
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

AccountOpeningFlow.displayName = "AccountOpeningFlow";
export default AccountOpeningFlow;
