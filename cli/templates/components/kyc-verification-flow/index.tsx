import React, { useState } from "react";
import type {
  FlowStepVariant,
  KycBusinessMethod,
  KycDocType,
  KycPersonalMethod,
  KycReviewOutcome,
  KycVerificationFlowProps,
  KycVerificationStep,
} from "../types";
import { Card } from "../card";
import { RadioGroup } from "../radio-group";
import { Input } from "../input";
import { Select } from "../select";
import { KycDocUploader } from "../kyc-doc-uploader";
import { BankSelector } from "../bank-selector";
import { BiometricAuthPrompt } from "../biometric-auth-prompt";
import { Badge } from "../badge";
import { Alert } from "../alert";
import { Button } from "../button";

const PERSONAL_STEPS: { id: KycVerificationStep; label: string }[] = [
  { id: "details", label: "Details & Method" },
  { id: "verify", label: "Verify Identity" },
  { id: "complete", label: "Status" },
];

const BUSINESS_STEPS: { id: KycVerificationStep; label: string }[] = [
  { id: "details", label: "Company & Method" },
  { id: "verify", label: "Verify Business" },
  { id: "complete", label: "Status" },
];

const VERIFY_BANKS = [
  { id: "chase", name: "JPMorgan Chase", code: "CHASUS33" },
  { id: "mercury", name: "Mercury Bank", code: "MERYUS33" },
  { id: "revolut", name: "Revolut", code: "REVOGB21" },
];

export const KycVerificationFlow = React.forwardRef<HTMLDivElement, KycVerificationFlowProps>(
  (
    {
      title = "Verify your identity",
      accountType: initialAccountType = "individual",
      allowAccountTypeSwitch = true,
      stepVariant: initialStepVariant = "pills",
      defaultPersonalMethod = "document_selfie",
      defaultBusinessMethod = "upload_bundle",
      initialCountry = "United States",
      countries = ["United States", "United Kingdom", "Germany", "Nigeria", "Canada"],
      estimatedTimeText = "~90 sec",
      onComplete,
      className,
      ...props
    },
    ref,
  ) => {
    const [stepIndex, setStepIndex] = useState<0 | 1 | 2>(0);
    const [accountType, setAccountType] = useState<"individual" | "business">(initialAccountType);
    const [stepVariant] = useState<FlowStepVariant>(initialStepVariant);
    const [personalMethod, setPersonalMethod] = useState<KycPersonalMethod>(defaultPersonalMethod);
    const [businessMethod, setBusinessMethod] = useState<KycBusinessMethod>(defaultBusinessMethod);

    const [flowState, setFlowState] = useState<
      "idle" | "validating" | "uploading" | "success" | "error" | "manual_review"
    >("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Personal fields
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [nationality, setNationality] = useState(initialCountry);
    const [docType, setDocType] = useState<KycDocType>("passport");
    const [docFile, setDocFile] = useState<string | undefined>(undefined);
    const [bioOpen, setBioOpen] = useState(false);
    const [bioVerified, setBioVerified] = useState(false);
    const [selectedBankId, setSelectedBankId] = useState<string>(VERIFY_BANKS[0].id);

    // Business fields
    const [companyName, setCompanyName] = useState("");
    const [registrationNo, setRegistrationNo] = useState("");
    const [businessCountry, setBusinessCountry] = useState(initialCountry);
    const [businessAddress, setBusinessAddress] = useState("");
    const [incorpDoc, setIncorpDoc] = useState<string | undefined>(undefined);
    const [proofAddressDoc, setProofAddressDoc] = useState<string | undefined>(undefined);
    const [directorName, setDirectorName] = useState("");
    const [directorEmail, setDirectorEmail] = useState("");
    const [directorOwnership, setDirectorOwnership] = useState("100");
    const [directorIdDoc, setDirectorIdDoc] = useState<string | undefined>(undefined);

    const steps = accountType === "business" ? BUSINESS_STEPS : PERSONAL_STEPS;
    const activeMethod = accountType === "business" ? businessMethod : personalMethod;

    const handleRestart = () => {
      setStepIndex(0);
      setFlowState("idle");
      setErrorMessage(null);
      setDocFile(undefined);
      setBioVerified(false);
      setIncorpDoc(undefined);
      setProofAddressDoc(undefined);
      setDirectorIdDoc(undefined);
    };

    const handleNextToVerify = () => {
      setErrorMessage(null);
      if (accountType === "individual") {
        if (!fullName.trim() || !dob.trim() || !address.trim()) {
          setFlowState("error");
          setErrorMessage("Please enter your full name, date of birth, and residential address.");
          return;
        }
      } else {
        if (!companyName.trim() || !registrationNo.trim() || !businessAddress.trim()) {
          setFlowState("error");
          setErrorMessage("Please enter your legal company name, registration number, and address.");
          return;
        }
      }
      setFlowState("idle");
      setStepIndex(1);
    };

    const handleSubmitVerification = (asManualReview = false) => {
      setErrorMessage(null);
      if (accountType === "individual") {
        if (personalMethod === "document_selfie" && !docFile) {
          setFlowState("error");
          setErrorMessage("Please upload a clear photo or PDF of your government ID.");
          return;
        }
        if (personalMethod === "passkey_id" && !bioVerified && !asManualReview) {
          setFlowState("error");
          setErrorMessage("Complete the passkey / biometric prompt to confirm your identity.");
          return;
        }
      } else {
        if (businessMethod === "upload_bundle") {
          if (!incorpDoc || !proofAddressDoc || !directorName.trim() || !directorIdDoc) {
            setFlowState("error");
            setErrorMessage(
              "Upload your incorporation certificate, proof of address, and beneficial owner ID.",
            );
            return;
          }
        } else if (businessMethod === "invite_director") {
          if (!incorpDoc || !directorName.trim() || !directorEmail.trim()) {
            setFlowState("error");
            setErrorMessage(
              "Upload your incorporation certificate and enter the beneficial owner name and email.",
            );
            return;
          }
        }
      }

      setFlowState("validating");
      const requiresReview =
        asManualReview ||
        (accountType === "individual" && personalMethod === "document_selfie" && !bioVerified) ||
        (accountType === "business" && businessMethod === "invite_director");
      const finalOutcome: KycReviewOutcome = requiresReview ? "manual_review" : "verified";

      setTimeout(() => {
        setStepIndex(2);
        setFlowState(finalOutcome === "verified" ? "success" : "manual_review");
        onComplete?.({
          country: accountType === "business" ? businessCountry : nationality,
          accountType,
          verificationMethod: activeMethod,
          fullName: accountType === "business" ? companyName.trim() : fullName.trim(),
          taxId: accountType === "business" ? registrationNo.trim() : dob,
          address: accountType === "business" ? businessAddress.trim() : address.trim(),
          dobOrIncorporationDate: dob,
          documentType: accountType === "individual" ? docType : undefined,
          documentFileName: accountType === "business" ? incorpDoc : docFile,
          secondaryDocumentFileName:
            accountType === "business" ? proofAddressDoc || directorIdDoc : undefined,
          beneficialOwnerName: accountType === "business" ? directorName.trim() : undefined,
          beneficialOwnerEmail: accountType === "business" ? directorEmail.trim() : undefined,
          beneficialOwnerOwnership: accountType === "business" ? directorOwnership : undefined,
          biometricVerified: bioVerified || personalMethod === "bank_id",
          outcome: finalOutcome,
        });
      }, 250);
    };

    const renderStepper = () => {
      if (stepVariant === "progress") {
        const pct = Math.round(((stepIndex + 1) / steps.length) * 100);
        return (
          <div className="fc-kyc-flow__progress-wrap" aria-label="Verification progress">
            <div className="fc-kyc-flow__progress-meta">
              <span>
                Step {stepIndex + 1} of {steps.length} · {steps[stepIndex].label}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="fc-kyc-flow__progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="fc-kyc-flow__progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }

      const stepperClass = [
        "fc-kyc-flow__stepper",
        stepVariant === "numbered" ? "fc-kyc-flow__stepper--numbered" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <nav aria-label="Verification progress">
          <ol className={stepperClass}>
            {steps.map((s, idx) => {
              const isDone = idx < stepIndex || stepIndex === 2;
              const isActive = !isDone && idx === stepIndex;
              const stepCls = [
                "fc-kyc-flow__step",
                isDone ? "fc-kyc-flow__step--done" : isActive ? "fc-kyc-flow__step--active" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li
                  key={s.id}
                  className={stepCls}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="fc-kyc-flow__step-num" aria-hidden="true">
                    {isDone ? "✓" : idx + 1}
                  </span>
                  <span className="fc-kyc-flow__step-label">{s.label}</span>
                </li>
              );
            })}
          </ol>
        </nav>
      );
    };

    return (
      <div
        ref={ref}
        className={["fc-kyc-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-kyc-flow__header">
              <span>{title}</span>
              <Badge variant={flowState === "success" ? "success" : "info"}>
                {flowState === "success"
                  ? "Verified"
                  : flowState === "manual_review"
                    ? "In Review"
                    : estimatedTimeText}
              </Badge>
            </div>
          }
          description={
            accountType === "business"
              ? "Fast 3-step company onboarding with your choice of verification method."
              : "Quick 3-step check — pick the verification option that works best for you."
          }
        >
          <div className="fc-kyc-flow__stack">
            {renderStepper()}

            <div className="fc-kyc-flow__sr" aria-live="polite">
              Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].label}
            </div>

            {flowState === "error" && errorMessage && (
              <Alert variant="error" title="Action required">
                {errorMessage}
              </Alert>
            )}

            {stepIndex === 0 && (
              <div className="fc-kyc-flow__stack">
                {allowAccountTypeSwitch && (
                  <RadioGroup
                    label="Account type"
                    name="kyc-account-type"
                    value={accountType}
                    onChange={(val) => {
                      setAccountType(val as "individual" | "business");
                      setErrorMessage(null);
                      setFlowState("idle");
                    }}
                    options={[
                      { value: "individual", label: "Personal Account" },
                      { value: "business", label: "Business Account" },
                    ]}
                  />
                )}

                {accountType === "individual" ? (
                  <>
                    <Input
                      label="Full legal name"
                      placeholder="Jane Doe"
                      value={fullName}
                      required
                      errorMessage={
                        flowState === "error" && !fullName.trim() ? "Full name is required." : undefined
                      }
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="fc-kyc-flow__grid-2">
                      <Input
                        label="Date of birth"
                        placeholder="YYYY-MM-DD"
                        value={dob}
                        required
                        errorMessage={
                          flowState === "error" && !dob.trim() ? "Date of birth is required." : undefined
                        }
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <Select
                        label="Country / Nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Input
                      label="Residential address"
                      placeholder="420 Market St, San Francisco, CA"
                      value={address}
                      required
                      errorMessage={
                        flowState === "error" && !address.trim() ? "Address is required." : undefined
                      }
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <RadioGroup
                      label="Choose how to verify"
                      name="kyc-personal-method"
                      value={personalMethod}
                      onChange={(val) => setPersonalMethod(val as KycPersonalMethod)}
                      options={[
                        { value: "document_selfie", label: "Government ID + Selfie (Upload document)" },
                        { value: "bank_id", label: "Instant Bank Verification (No upload required)" },
                        { value: "passkey_id", label: "Device Passkey / Biometric ID (~30 sec)" },
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Company legal name"
                      placeholder="Acme Treasury Inc."
                      value={companyName}
                      required
                      errorMessage={
                        flowState === "error" && !companyName.trim()
                          ? "Company legal name is required."
                          : undefined
                      }
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="fc-kyc-flow__grid-2">
                      <Input
                        label="Registration number"
                        placeholder="DE-8492014"
                        value={registrationNo}
                        required
                        errorMessage={
                          flowState === "error" && !registrationNo.trim()
                            ? "Registration number is required."
                            : undefined
                        }
                        onChange={(e) => setRegistrationNo(e.target.value)}
                      />
                      <Select
                        label="Country of incorporation"
                        value={businessCountry}
                        onChange={(e) => setBusinessCountry(e.target.value)}
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Input
                      label="Registered business address"
                      placeholder="548 Market St, San Francisco, CA"
                      value={businessAddress}
                      required
                      errorMessage={
                        flowState === "error" && !businessAddress.trim()
                          ? "Business address is required."
                          : undefined
                      }
                      onChange={(e) => setBusinessAddress(e.target.value)}
                    />
                    <RadioGroup
                      label="Choose business verification option"
                      name="kyc-business-method"
                      value={businessMethod}
                      onChange={(val) => setBusinessMethod(val as KycBusinessMethod)}
                      options={[
                        { value: "upload_bundle", label: "Upload Company Docs & Owner ID" },
                        { value: "invite_director", label: "Send Verification Link to Beneficial Owner" },
                        { value: "registry_bank", label: "Instant Registry + Corporate Bank Check" },
                      ]}
                    />
                  </>
                )}

                <div className="fc-kyc-flow__actions">
                  <Button variant="ghost" onClick={handleRestart}>
                    Restart
                  </Button>
                  <Button variant="primary" onClick={handleNextToVerify}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="fc-kyc-flow__stack">
                {accountType === "individual" && personalMethod === "document_selfie" && (
                  <>
                    <Select
                      label="Document type"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as KycDocType)}
                    >
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID Card</option>
                      <option value="drivers_license">Driver&apos;s License</option>
                    </Select>
                    <KycDocUploader
                      title="Upload your government ID"
                      description="Make sure all four corners are clear and readable."
                      onFileSelect={(file) => {
                        setFlowState("uploading");
                        setErrorMessage(null);
                        setTimeout(() => {
                          setDocFile(file.name);
                          setFlowState("idle");
                        }, 150);
                      }}
                      onFileRemove={() => setDocFile(undefined)}
                    />
                    <Card
                      title="Quick selfie match"
                      description="Complete biometric face match for instant approval."
                      footer={
                        <div className="fc-kyc-flow__actions-right">
                          <Button variant="secondary" size="sm" onClick={() => setBioOpen(true)}>
                            {bioVerified ? "Retake selfie" : "Start selfie check"}
                          </Button>
                          {bioVerified && <Badge variant="success">Selfie matched</Badge>}
                        </div>
                      }
                    />
                    <BiometricAuthPrompt
                      open={bioOpen}
                      onOpenChange={setBioOpen}
                      type="face"
                      title="Selfie & liveness check"
                      description="Hold your camera steady to match your face with your government ID."
                      status={bioVerified ? "success" : "idle"}
                      onAuthenticate={() => {
                        setBioVerified(true);
                        setTimeout(() => setBioOpen(false), 250);
                      }}
                    />
                  </>
                )}

                {accountType === "individual" && personalMethod === "bank_id" && (
                  <>
                    <BankSelector
                      banks={VERIFY_BANKS}
                      selectedBankId={selectedBankId}
                      placeholder="Search your bank for instant ID check..."
                      onSelectBank={(b) => setSelectedBankId(b.id)}
                    />
                    <Alert variant="info" title="Instant read-only confirmation">
                      Sign in with your selected bank to verify your name, date of birth, and address automatically.
                    </Alert>
                  </>
                )}

                {accountType === "individual" && personalMethod === "passkey_id" && (
                  <>
                    <Card
                      title="Verify with device passkey"
                      description="Approve with Face ID, Touch ID, or security key for instant verification."
                      footer={
                        <div className="fc-kyc-flow__actions-right">
                          <Button variant="primary" size="sm" onClick={() => setBioOpen(true)}>
                            {bioVerified ? "Passkey verified" : "Verify with Passkey"}
                          </Button>
                          {bioVerified && <Badge variant="success">Confirmed</Badge>}
                        </div>
                      }
                    />
                    <BiometricAuthPrompt
                      open={bioOpen}
                      onOpenChange={setBioOpen}
                      type="touch"
                      title="Confirm with Passkey"
                      description="Verify your identity using your trusted device passkey."
                      status={bioVerified ? "success" : "idle"}
                      onAuthenticate={() => {
                        setBioVerified(true);
                        setErrorMessage(null);
                        setTimeout(() => setBioOpen(false), 250);
                      }}
                    />
                  </>
                )}

                {accountType === "business" && businessMethod === "upload_bundle" && (
                  <>
                    <KycDocUploader
                      title="Certificate of Incorporation"
                      description="Upload your official business registration filing."
                      onFileSelect={(file) => setIncorpDoc(file.name)}
                      onFileRemove={() => setIncorpDoc(undefined)}
                    />
                    <KycDocUploader
                      title="Proof of business address"
                      description="Utility bill or bank statement from the last 90 days."
                      onFileSelect={(file) => setProofAddressDoc(file.name)}
                      onFileRemove={() => setProofAddressDoc(undefined)}
                    />
                    <div className="fc-kyc-flow__grid-2">
                      <Input
                        label="Beneficial owner / director"
                        placeholder="Alex Rivera"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                      />
                      <Input
                        label="Ownership %"
                        placeholder="100"
                        value={directorOwnership}
                        onChange={(e) => setDirectorOwnership(e.target.value)}
                      />
                    </div>
                    <KycDocUploader
                      title="Owner / director government ID"
                      description="Passport or national ID for the beneficial owner."
                      onFileSelect={(file) => setDirectorIdDoc(file.name)}
                      onFileRemove={() => setDirectorIdDoc(undefined)}
                    />
                  </>
                )}

                {accountType === "business" && businessMethod === "invite_director" && (
                  <>
                    <KycDocUploader
                      title="Certificate of Incorporation"
                      description="Upload your official business registration filing."
                      onFileSelect={(file) => setIncorpDoc(file.name)}
                      onFileRemove={() => setIncorpDoc(undefined)}
                    />
                    <div className="fc-kyc-flow__grid-2">
                      <Input
                        label="Beneficial owner name"
                        placeholder="Alex Rivera"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                      />
                      <Input
                        label="Beneficial owner email"
                        type="email"
                        placeholder="alex@company.com"
                        value={directorEmail}
                        onChange={(e) => setDirectorEmail(e.target.value)}
                      />
                    </div>
                    <Alert variant="info" title="No need to collect their passport yourself">
                      We will email a secure one-tap verification link to {directorName || "your beneficial owner"}.
                    </Alert>
                  </>
                )}

                {accountType === "business" && businessMethod === "registry_bank" && (
                  <>
                    <BankSelector
                      banks={VERIFY_BANKS}
                      selectedBankId={selectedBankId}
                      placeholder="Search your corporate bank..."
                      onSelectBank={(b) => setSelectedBankId(b.id)}
                    />
                    <Alert variant="info" title="Instant company match">
                      We match {companyName || "your company"} against official registry records and confirm corporate bank signatory access.
                    </Alert>
                  </>
                )}

                <div className="fc-kyc-flow__actions">
                  <Button
                    variant="ghost"
                    disabled={flowState === "validating"}
                    onClick={() => {
                      setErrorMessage(null);
                      setFlowState("idle");
                      setStepIndex(0);
                    }}
                  >
                    Back
                  </Button>
                  <div className="fc-kyc-flow__actions-right">
                    <Button
                      variant="secondary"
                      disabled={flowState === "validating"}
                      onClick={() => handleSubmitVerification(true)}
                    >
                      Submit for review
                    </Button>
                    <Button
                      variant="primary"
                      loading={flowState === "validating"}
                      onClick={() => handleSubmitVerification(false)}
                    >
                      Complete verification
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 2 && (
              <div className="fc-kyc-flow__stack">
                {flowState === "success" ? (
                  <Alert variant="success" title="Verification complete">
                    {accountType === "business"
                      ? `${companyName || "Your business"} is verified with full treasury and payout limits.`
                      : "Your identity is verified. Transfers, deposits, and cards are now unlocked."}
                  </Alert>
                ) : (
                  <Alert variant="warning" title="In manual review (< 2 hours)">
                    {accountType === "business" && businessMethod === "invite_director"
                      ? `Verification link sent to ${directorEmail || "your director"}. We'll activate your account as soon as it's completed.`
                      : "We're finishing a quick review of your submission and will update your status in under 2 hours."}
                  </Alert>
                )}

                <Card title="Verification summary">
                  <dl className="fc-kyc-flow__summary-list">
                    <div>
                      <dt className="fc-kyc-flow__summary-term">Account</dt>
                      <dd className="fc-kyc-flow__summary-val">
                        {accountType === "business" ? companyName : fullName}
                      </dd>
                    </div>
                    <div>
                      <dt className="fc-kyc-flow__summary-term">Method</dt>
                      <dd className="fc-kyc-flow__summary-val">{activeMethod.replace(/_/g, " ")}</dd>
                    </div>
                  </dl>
                </Card>

                <div className="fc-kyc-flow__actions">
                  <Button variant="secondary" onClick={handleRestart}>
                    Restart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  },
);

KycVerificationFlow.displayName = "KycVerificationFlow";
export default KycVerificationFlow;
