import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { EmptyState } from "../empty-state";
import { Input } from "../input";
import { SplitBillCalculator } from "../split-bill-calculator";
import type { GroupBillSplitFlowProps } from "../types";

export const GroupBillSplitFlow = React.forwardRef<HTMLDivElement, GroupBillSplitFlowProps>(
  (
    {
      currency = "USD",
      defaultBillTitle = "Dinner at Osteria",
      defaultTotal = 180,
      contacts,
      onSendRequests,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [billTitle, setBillTitle] = useState<string>(defaultBillTitle);
    const [totalAmount, setTotalAmount] = useState<number>(defaultTotal);
    const [selectedIds, setSelectedIds] = useState<string[]>(() =>
      contacts.slice(0, 2).map((c) => c.id),
    );
    const [paidIds, setPaidIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedContacts = contacts.filter((c) => selectedIds.includes(c.id));
    const splitCount = selectedContacts.length + 1; // including user
    const perPersonShare =
      splitCount > 0 ? Math.round((totalAmount / splitCount) * 100) / 100 : 0;

    const formatMoney = (val: number) =>
      `${currency} ${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const toggleContact = (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    };

    const handleSendRequests = async () => {
      if (submitting || selectedContacts.length === 0) return;
      setSubmitting(true);
      setErrorMessage(null);
      try {
        await onSendRequests?.({
          title: billTitle.trim() || "Shared Bill",
          totalAmount,
          participants: selectedContacts.map((c) => ({
            id: c.id,
            name: c.name,
            share: perPersonShare,
          })),
        });
        setStep(3);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to send payment requests. Please retry.",
        );
      } finally {
        setSubmitting(false);
      }
    };

    const classes = ["fc-group-split-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label="Group bill split flow"
        {...props}
      >
        <div className="fc-group-split-flow__steps" aria-live="polite">
          <span
            className={`fc-group-split-flow__step ${
              step === 1 ? "fc-group-split-flow__step--active" : "fc-group-split-flow__step--done"
            }`}
          >
            1. Bill &amp; Tip
          </span>
          <span>→</span>
          <span
            className={`fc-group-split-flow__step ${
              step === 2
                ? "fc-group-split-flow__step--active"
                : step > 2
                  ? "fc-group-split-flow__step--done"
                  : ""
            }`}
          >
            2. Choose Friends
          </span>
          <span>→</span>
          <span
            className={`fc-group-split-flow__step ${
              step === 3 ? "fc-group-split-flow__step--active" : ""
            }`}
          >
            3. Request Tracker
          </span>
        </div>

        {step === 1 && (
          <div className="fc-group-split-flow__card">
            <Input
              label="Bill Description"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              onInput={(e) => setBillTitle((e.target as HTMLInputElement).value)}
            />
            <SplitBillCalculator
              initialBill={totalAmount}
              currency={currency}
              onRequestPayment={(data) => {
                setTotalAmount(data.totalAmount);
                setStep(2);
              }}
            />
            <div className="fc-group-split-flow__actions">
              <span />
              <Button type="button" variant="primary" onClick={() => setStep(2)}>
                Continue to Friends
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fc-group-split-flow__card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Split {formatMoney(totalAmount)} with Friends</h3>
              <Badge variant="info">
                {formatMoney(perPersonShare)} / person ({splitCount} ways)
              </Badge>
            </div>

            {errorMessage && (
              <Alert variant="error" title="Request Dispatch Failed">
                {errorMessage}
              </Alert>
            )}

            {contacts.length === 0 ? (
              <EmptyState
                title="No contacts available"
                description="Add friends or beneficiaries to split this bill."
              />
            ) : (
              <div className="fc-group-split-flow__contacts">
                {contacts.map((contact) => {
                  const selected = selectedIds.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      className={`fc-group-split-flow__contact ${
                        selected ? "fc-group-split-flow__contact--selected" : ""
                      }`}
                      aria-pressed={selected}
                      onClick={() => toggleContact(contact.id)}
                    >
                      <div>
                        <div className="fc-group-split-flow__name">{contact.name}</div>
                        <div className="fc-group-split-flow__handle">{contact.handle}</div>
                      </div>
                      <span className="fc-group-split-flow__share">
                        {selected ? formatMoney(perPersonShare) : "Not included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="fc-group-split-flow__actions">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Back to Bill
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={submitting || selectedContacts.length === 0}
                onClick={handleSendRequests}
              >
                {submitting
                  ? "Sending..."
                  : `Send ${selectedContacts.length} Payment Request${selectedContacts.length === 1 ? "" : "s"}`}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fc-group-split-flow__card">
            <Alert variant="success" title="Payment Requests Sent">
              Requested {formatMoney(perPersonShare)} each for "{billTitle}" from {selectedContacts.length} friend{selectedContacts.length === 1 ? "" : "s"}.
            </Alert>
            <div className="fc-group-split-flow__contacts">
              {selectedContacts.map((contact) => {
                const isPaid = paidIds.includes(contact.id);
                return (
                  <div key={contact.id} className="fc-group-split-flow__contact">
                    <div>
                      <div className="fc-group-split-flow__name">{contact.name}</div>
                      <div className="fc-group-split-flow__handle">{formatMoney(perPersonShare)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Badge variant={isPaid ? "success" : "warning"}>
                        {isPaid ? "Paid" : "Requested"}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setPaidIds((prev) =>
                            prev.includes(contact.id)
                              ? prev.filter((x) => x !== contact.id)
                              : [...prev, contact.id],
                          )
                        }
                      >
                        {isPaid ? "Undo" : "Mark Paid"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="fc-group-split-flow__actions">
              <span />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPaidIds([]);
                  setStep(1);
                }}
              >
                Split Another Bill
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

GroupBillSplitFlow.displayName = "GroupBillSplitFlow";
export default GroupBillSplitFlow;

