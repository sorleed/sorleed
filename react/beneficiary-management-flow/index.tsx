import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { BankSelector } from "../bank-selector";
import { Button } from "../button";
import { Card } from "../card";
import { Input } from "../input";
import { OTP } from "../otp";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { Tooltip } from "../tooltip";
import type { BankInstitution, BeneficiaryItem, BeneficiaryManagementFlowProps } from "../types";

const DEFAULT_BANKS: BankInstitution[] = [
  { id: "mercury", name: "Mercury Bank", code: "MRCRYUS33" },
  { id: "chase", name: "JPMorgan Chase", code: "CHASUS33" },
  { id: "revolut", name: "Revolut Business", code: "REVOGB21" },
  { id: "gtbank", name: "GTBank", code: "GTBINGLA" },
];

const INITIAL_BENEFICIARIES: BeneficiaryItem[] = [
  { id: "b-1", name: "Acme Cloud Ltd", bankName: "Mercury Bank", accountMask: "•••• 4829", currency: "USD", rail: "ACH", verificationStatus: "verified" },
  { id: "b-2", name: "Elena Rostova", bankName: "Revolut Business", accountMask: "•••• 9104", currency: "EUR", rail: "SEPA", verificationStatus: "verified" },
];

type BeneficiaryState = "listing" | "adding" | "verifying" | "confirm-remove" | "success" | "error";

const IconUserPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const IconShieldCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export const BeneficiaryManagementFlow = React.forwardRef<HTMLDivElement, BeneficiaryManagementFlowProps>(
  (
    {
      title = "Manage beneficiaries",
      accountType: initialAccountType = "personal",
      currencies = ["USD", "EUR", "GBP", "NGN"],
      initialBeneficiaries = INITIAL_BENEFICIARIES,
      requireVerifyCode = true,
      onSaveBeneficiary,
      onRemoveBeneficiary,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryItem[]>(initialBeneficiaries);
    const [status, setStatus] = useState<BeneficiaryState>("listing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [name, setName] = useState<string>("");
    const [bankId, setBankId] = useState<string>(DEFAULT_BANKS[0].id);
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [currency, setCurrency] = useState<string>(currencies[0] || "USD");
    const [otpCode, setOtpCode] = useState<string>("");
    const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

    const selectedBank = DEFAULT_BANKS.find((b) => b.id === bankId) || DEFAULT_BANKS[0];

    const startAdd = () => {
      setErrorMessage("");
      setSuccessMessage("");
      setName("");
      setAccountNumber("");
      setOtpCode("");
      setStatus("adding");
    };

    const handleCancel = () => {
      setErrorMessage("");
      setPendingRemoveId(null);
      setStatus("listing");
    };

    const handleContinueToVerify = () => {
      setErrorMessage("");
      if (!name.trim() || accountNumber.trim().length < 6) {
        setStatus("error");
        setErrorMessage("Enter a recipient name and valid account/IBAN number (min 6 characters).");
        return;
      }
      if (requireVerifyCode) {
        setStatus("verifying");
      } else {
        completeSave();
      }
    };

    const completeSave = () => {
      const digits = accountNumber.trim();
      const masked = `•••• ${digits.slice(-4)}`;
      const newBen: BeneficiaryItem = {
        id: `ben-${Date.now()}`,
        name: name.trim(),
        bankName: selectedBank.name,
        accountMask: masked,
        currency,
        rail: currency === "EUR" ? "SEPA" : "ACH",
        verificationStatus: "verified",
      };
      setBeneficiaries((prev) => [newBen, ...prev]);
      setSuccessMessage(`${newBen.name} (${newBen.bankName}) verified and saved.`);
      setStatus("success");
      onSaveBeneficiary?.(newBen);
    };

    const handleSaveWithOtp = () => {
      if (otpCode.trim().length < 6) {
        setStatus("error");
        setErrorMessage("Enter the 6-digit verification code to whitelist this recipient.");
        return;
      }
      completeSave();
    };

    const handleConfirmRemove = () => {
      if (!pendingRemoveId) return;
      const target = beneficiaries.find((b) => b.id === pendingRemoveId);
      setBeneficiaries((prev) => prev.filter((b) => b.id !== pendingRemoveId));
      onRemoveBeneficiary?.(pendingRemoveId);
      setPendingRemoveId(null);
      setSuccessMessage(`${target?.name || "Beneficiary"} removed from your trusted list.`);
      setStatus("success");
    };

    const targetForRemoval = beneficiaries.find((b) => b.id === pendingRemoveId);

    return (
      <div
        ref={ref}
        className={["fc-ben-mgmt-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-ben-mgmt-flow__header">
              <span>{title}</span>
              <Badge variant="info">{beneficiaries.length} saved</Badge>
            </div>
          }
          description={
            accountType === "business"
              ? "Maintain verified vendor and payroll recipients with approval security."
              : "Add, verify, and remove trusted bank recipients."
          }
          footer={
            <div className="fc-ben-mgmt-flow__actions">
              {status === "listing" || status === "success" ? (
                <>
                  <span />
                  <Button variant="primary" onClick={startAdd}>
                    <span className="fc-ben-mgmt-flow__btn-inner">
                      <IconUserPlus /> Add Beneficiary
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleCancel}>
                    <span className="fc-ben-mgmt-flow__btn-inner">
                      <IconX /> Cancel
                    </span>
                  </Button>
                  <div className="fc-ben-mgmt-flow__actions-right">
                    {status === "adding" || status === "error" ? (
                      <Button variant="primary" onClick={handleContinueToVerify}>
                        Save
                      </Button>
                    ) : null}
                    {status === "verifying" ? (
                      <Button variant="primary" onClick={handleSaveWithOtp}>
                        <span className="fc-ben-mgmt-flow__btn-inner">
                          <IconShieldCheck /> Verify & Save
                        </span>
                      </Button>
                    ) : null}
                    {status === "confirm-remove" ? (
                      <Button variant="primary" onClick={handleConfirmRemove}>
                        <span className="fc-ben-mgmt-flow__btn-inner">
                          <IconTrash /> Confirm Remove
                        </span>
                      </Button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          }
        >
          <div className="fc-ben-mgmt-flow__stack">
            <Tabs
              value={accountType}
              onValueChange={(val) => setAccountType(val as "personal" | "business")}
            >
              <TabsList aria-label="Address book profile">
                <TabsTrigger value="personal">Personal payees</TabsTrigger>
                <TabsTrigger value="business">Business vendors</TabsTrigger>
              </TabsList>
            </Tabs>

            {errorMessage ? (
              <Alert variant="error" title="Action required">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" && successMessage ? (
              <Alert variant="success" title="Address book updated">
                {successMessage}
              </Alert>
            ) : null}

            {status === "confirm-remove" && targetForRemoval ? (
              <Alert variant="warning" title={`Remove ${targetForRemoval.name}?`}>
                Removing this recipient clears any saved quick-transfer shortcuts for {targetForRemoval.bankName} ({targetForRemoval.accountMask}).
              </Alert>
            ) : null}

            {status === "adding" || (status === "error" && !otpCode) ? (
              <div className="fc-ben-mgmt-flow__stack">
                <div className="fc-ben-mgmt-flow__grid-2">
                  <Input
                    label={accountType === "business" ? "Vendor legal name" : "Recipient full name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Northstar Design Co."
                    required
                  />
                  <Select
                    label="Payout currency"
                    id={`${baseId}-currency`}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
                <BankSelector
                  banks={DEFAULT_BANKS}
                  selectedBankId={bankId}
                  onSelectBank={(b) => setBankId(b.id)}
                />
                <Input
                  label="Account number or IBAN"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0049281942"
                  required
                />
              </div>
            ) : null}

            {status === "verifying" ? (
              <div className="fc-ben-mgmt-flow__stack" aria-live="polite">
                <Alert variant="info" title="Verify new recipient">
                  Enter any 6-digit security code (e.g. 123456) to whitelist {name} at {selectedBank.name}.
                </Alert>
                <OTP
                  label="6-digit verification code"
                  value={otpCode}
                  onChange={setOtpCode}
                />
              </div>
            ) : null}

            {status === "listing" || status === "success" ? (
              <div className="fc-ben-mgmt-flow__option-list">
                {beneficiaries.map((ben) => (
                  <div key={ben.id} className="fc-ben-mgmt-flow__select-row">
                    <div>
                      <div className="fc-ben-mgmt-flow__select-title">{ben.name}</div>
                      <div className="fc-ben-mgmt-flow__select-meta">
                        {ben.bankName} · {ben.accountMask} · {ben.currency}
                      </div>
                    </div>
                    <div className="fc-ben-mgmt-flow__select-right">
                      <Badge variant={ben.verificationStatus === "verified" ? "success" : "default"}>
                        {ben.verificationStatus === "verified" ? "Verified" : "Pending"}
                      </Badge>
                      <Tooltip content={`Remove ${ben.name}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`Remove ${ben.name}`}
                          onClick={() => {
                            setPendingRemoveId(ben.id);
                            setErrorMessage("");
                            setStatus("confirm-remove");
                          }}
                        >
                          <IconTrash />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

BeneficiaryManagementFlow.displayName = "BeneficiaryManagementFlow";
export default BeneficiaryManagementFlow;
