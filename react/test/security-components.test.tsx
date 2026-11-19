import "./setup.ts";
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SessionTimeoutModal } from "../session-timeout-modal";
import { VirtualCardReveal } from "../virtual-card-reveal";
import { DeviceManagementCard } from "../device-management-card";
import type { DeviceSessionItem } from "../types";

test("SessionTimeoutModal renders countdown, alertdialog role, and handles extend", () => {
  let extended = false;
  let loggedOut = false;

  const { getByRole, getByText } = render(
    <SessionTimeoutModal
      open={true}
      countdownSeconds={45}
      title="Session Expiring Soon"
      onExtendSession={() => {
        extended = true;
      }}
      onLogout={() => {
        loggedOut = true;
      }}
    />,
  );

  const dialog = getByRole("alertdialog");
  assert.ok(dialog);
  assert.ok(getByText("Session Expiring Soon"));
  assert.ok(getByText("45"));

  const extendBtn = getByText("Stay signed in");
  fireEvent.click(extendBtn);
  assert.equal(extended, true);

  const logoutBtn = getByText("Log out now");
  fireEvent.click(logoutBtn);
  assert.equal(loggedOut, true);
});

test("VirtualCardReveal renders masked PAN and reveals on toggle", async () => {
  let authCalled = false;
  let copiedField = "";

  const { getByText, findByText, getByLabelText } = render(
    <VirtualCardReveal
      cardNumber="4532 8920 1029 8841"
      cardHolder="ALEX RIVERA"
      expiry="09/29"
      cvv="482"
      brand="Visa"
      theme="dark"
      autoMaskSeconds={30}
      onAuthenticate={() => {
        authCalled = true;
        return true;
      }}
      onCopy={(field) => {
        copiedField = field;
      }}
    />,
  );

  // Initially masked
  assert.ok(getByText("•••• •••• •••• 8841"));
  assert.ok(getByText("Reveal details"));

  // Toggle reveal
  const revealBtn = getByText("Reveal details");
  fireEvent.click(revealBtn);
  assert.equal(authCalled, true);

  // Once revealed, unmasked PAN and auto-lock badge show
  assert.ok(await findByText("4532 8920 1029 8841"));
  assert.ok(await findByText(/Auto-locks in 30s/));
  assert.ok(await findByText("Hide details"));

  // Copy PAN
  const copyPanBtn = getByLabelText("Copy card number");
  fireEvent.click(copyPanBtn);
  assert.equal(copiedField, "pan");

  // Copy CVV
  const copyCvvBtn = getByLabelText("Copy CVV");
  fireEvent.click(copyCvvBtn);
  assert.equal(copiedField, "cvv");
});

test("DeviceManagementCard renders sessions and handles revocation", async () => {
  const devices: DeviceSessionItem[] = [
    {
      id: "dev-1",
      deviceName: "MacBook Pro",
      deviceType: "desktop",
      browser: "Chrome 131",
      os: "macOS 15",
      ipAddress: "192.0.2.1",
      location: "San Francisco, US",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "dev-2",
      deviceName: "iPhone 16 Pro",
      deviceType: "mobile",
      browser: "Safari 18",
      os: "iOS 18",
      ipAddress: "198.51.100.4",
      location: "New York, US",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ];

  let revokedId = "";
  let revokedAll = false;

  const { getByText, getByLabelText } = render(
    <DeviceManagementCard
      devices={devices}
      onRevokeDevice={(id) => {
        revokedId = id;
      }}
      onRevokeAllOthers={() => {
        revokedAll = true;
      }}
    />,
  );

  assert.ok(getByText("MacBook Pro"));
  assert.ok(getByText("Current session"));
  assert.ok(getByText("iPhone 16 Pro"));

  // Revoke device 2
  const revokeBtn = getByLabelText("Revoke access for iPhone 16 Pro");
  fireEvent.click(revokeBtn);
  assert.equal(revokedId, "dev-2");

  // Sign out all others
  const revokeAllBtn = getByText("Sign out 1 other device");
  fireEvent.click(revokeAllBtn);
  assert.equal(revokedAll, true);
});
