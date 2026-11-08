import React, { useState } from "react";
import { PhoneInput } from "../../react/phone-input";
import { Input } from "../../react/input";
import { Select } from "../../react/select";
import { Button } from "../../react/button";
import { Toast } from "../../react/toast";

export interface OnboardingKYCFlowProps {
  onCompleteKYC?: (data: {
    fullName: string;
    email: string;
    phone: string;
    idType: string;
    idNumber: string;
  }) => Promise<void> | void;
}

export const OnboardingKYCFlow: React.FC<OnboardingKYCFlowProps> = ({ onCompleteKYC }) => {
  const [step, setStep] = useState<"identity" | "verification" | "complete">("identity");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idType, setIdType] = useState("passport");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNextIdentity = () => {
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please complete all required fields");
      return;
    }
    setErrorMsg("");
    setStep("verification");
  };

  const handleCompleteKYC = async () => {
    if (!idNumber.trim()) {
      setErrorMsg("Please provide your ID document number");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      if (onCompleteKYC) {
        await onCompleteKYC({
          fullName,
          email,
          phone,
          idType,
          idNumber,
        });
      }
      setStep("complete");
    } catch {
      setErrorMsg("Identity verification failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "16px" }}>
      {errorMsg && (
        <Toast
          variant="error"
          title="Error"
          description={errorMsg}
          onClose={() => setErrorMsg("")}
          style={{ marginBottom: "16px" }}
        />
      )}

      {step === "identity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Personal Information</h2>
          <Input
            label="Full Legal Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
          />
          <div>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "6px" }}>
              Mobile Phone
            </label>
            <PhoneInput
              label="Phone number"
              value={phone}
              onChange={(res) => setPhone(res.value)}
            />
          </div>
          <Button variant="primary" onClick={handleNextIdentity}>
            Next: Verification
          </Button>
        </div>
      )}

      {step === "verification" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Identity Document</h2>
          <Select
            label="Document Type"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            options={[
              { value: "passport", label: "International Passport" },
              { value: "drivers_license", label: "Driver's License" },
              { value: "national_id", label: "National ID Card / NIN" },
            ]}
          />
          <Input
            label="Document Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="A12345678"
          />
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="secondary" onClick={() => setStep("identity")}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleCompleteKYC}
              loading={loading}
              style={{ flex: 1 }}
            >
              Submit Verification
            </Button>
          </div>
        </div>
      )}

      {step === "complete" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "28px",
            }}
          >
            ✓
          </div>
          <h2 style={{ margin: 0 }}>KYC Verified!</h2>
          <p style={{ margin: 0, color: "#71717A" }}>
            Thank you, {fullName}. Your financial profile is active and ready for transfers.
          </p>
        </div>
      )}
    </div>
  );
};
export default OnboardingKYCFlow;

