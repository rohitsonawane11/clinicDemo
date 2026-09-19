# Clinic Demo Improvement Roadmap

This roadmap prioritizes improvements for a clear, intuitive desktop demo. Complete the priorities in order. Finish and test one priority before moving to the next.

## Priority 1 — Move configuration into Clinic Settings

**Status: Completed**

Create a dedicated `/settings` page and remove detailed configuration forms from the onboarding completion screen.

### Work

- Add settings navigation for Clinic Profile, Team, Prescription Presets, Medicine Catalog, and Demo Controls.
- Keep the onboarding completion screen simple: **Start Reception**, **Open Doctor Dashboard**, and **Configure Clinic**.
- Reuse the existing localStorage data and management operations.
- Keep internal tenant IDs and role codes hidden from customer-facing screens.

### Complete when

- Every settings section is reachable without repeating onboarding.
- Refreshing the page preserves all changes.
- The completion screen no longer feels overloaded.

## Priority 2 — Improve prescription preset management

**Status: Completed**

**Status: Completed**

Make preset creation the strongest part of the doctor demo.

### Work

- Use a dedicated page or large desktop drawer instead of a small modal.
- Organize the editor as Preset Name → Symptoms → Diagnosis → Medicines → Advice → Preview.
- Allow multiple medicines per preset.
- Allow editing and reordering added medicines, not only removing them.
- Prevent duplicate medicines within one preset.
- Validate the preset name and require at least one medicine.
- Clearly distinguish seeded presets from custom presets.
- Confirm before deleting a preset.

### Complete when

- A custom preset can be created, edited, deleted, and restored after refresh.
- It immediately appears in consultation Quick Templates.
- Selecting it applies symptoms, diagnosis, medicines, timing, duration, and advice correctly.

## Priority 3 — Make Quick Templates scalable

**Status: Completed**

### Work

- Show the six most relevant templates initially.
- Add template search and a **Show all** action.
- Add **Default** and **Custom** labels.
- Show recently used templates first.
- Confirm before replacing medicines or diagnosis already entered in a consultation.
- Add an empty state when no templates match.

### Complete when

- A doctor can find any preset quickly when many custom presets exist.
- Applying a template never silently overwrites existing consultation work.

## Priority 4 — Improve medicine search and formulary

**Status: Completed**

### Work

- Display suggestions as `Medicine · Strength · Form · Category`.
- Support keyboard navigation with arrow keys and Enter.
- Add a clear no-results state and an **Add new medicine** action.
- Show recently and frequently used medicines.
- Prevent duplicate formulary entries.
- Store generic name and optional brand name separately.
- Support Tablet, Capsule, Syrup, Drops, Injection, Ointment, Inhaler, Sachet, and Other.

### Complete when

- Typing part of a medicine name reliably finds the expected strengths.
- Selecting a result closes the suggestion list and fills the medicine form.
- Medicine changes persist and are available in both presets and consultations.

## Priority 5 — Improve team management

### Work

- Use a table with Name, Role, Mobile, Email, Status, and Actions.
- Support Doctor and Receptionist roles.
- Add complete inline validation for staff details.
- Prefer **Deactivate** over permanent deletion so historical visits remain valid.
- Allow reactivation and editing.
- Confirm permanent deletion if it is retained for demo purposes.

### Complete when

- Doctors and receptionists can be added, edited, deactivated, and reactivated.
- Inactive doctors cannot be assigned to new consultations.
- Existing consultation history still displays the correct doctor.

## Priority 6 — Standardize feedback and safety

### Work

- Use consistent toast messages for save, update, queue, completion, and failure actions.
- Replace any remaining browser alerts.
- Add confirmation dialogs for destructive actions.
- Show field-level validation beside the relevant input.
- Disable submit buttons while saving and prevent double submission.
- Add clear loading, empty, success, error, and not-found states.

### Complete when

- Every user action has visible feedback.
- Destructive changes cannot happen accidentally.
- No workflow depends on browser alerts.

## Priority 7 — Add a guided demo journey

### Work

- Add a **Start Guided Demo** button on the home page.
- Display a compact progress checklist:
  1. Find or register a patient.
  2. Add the patient to the queue.
  3. Open the patient.
  4. Start consultation.
  5. Apply a prescription preset.
  6. Save and verify visit history.
- Provide contextual hints without blocking normal use.
- Add a visible exit control for the guided mode.

### Complete when

- A clinic owner can understand and complete the primary workflow without assistance in two to three minutes.

## Priority 8 — Desktop usability and accessibility polish

### Work

- Verify all pages at 1366×768 and 1920×1080.
- Keep primary actions visible without unnecessary scrolling.
- Add proper labels, focus states, keyboard navigation, and dialog focus trapping.
- Ensure buttons use clear action names such as **Save Preset** instead of **Done** where appropriate.
- Standardize spacing, modal sizes, table layouts, and empty states.
- Resolve remaining ESLint warnings, including image and font warnings.

### Complete when

- The full workflow works with mouse and keyboard.
- No content clips or overflows at the supported desktop sizes.
- `pnpm lint` and `pnpm build` finish without warnings or errors.

## Bonus Improvements

These are valuable after the primary demo is stable.

### Prescription preview

- Show a live prescription preview while editing a preset or consultation.
- Include clinic branding and fictional-data labeling.
- Add print and PDF-friendly styling.

### Analytics overview

- Show today’s patients, waiting time, completed visits, and commonly used presets.
- Keep all analytics derived from local demo data.

### Activity history

- Record important demo actions such as patient registration, queue changes, preset updates, and consultation completion.
- Display a simple clinic activity timeline.

### Data import and export

- Export demo data as JSON.
- Import a previously exported demo state with validation.
- Keep **Reset Demo** available as a safe recovery option.

### Personalization

- Allow clinic logo, prescription header, consultation defaults, and print preferences.
- Allow each doctor to have personal frequently used medicines and presets.

### Demo scenarios

- Provide one-click scenarios such as Busy Morning, New Clinic, and Follow-up Day.
- Reset each scenario to a predictable fictional dataset.

## Release Checklist

Before presenting the demo:

- Complete the full patient-to-consultation workflow twice with different patients.
- Create a custom preset, refresh, and confirm it appears in Quick Templates.
- Apply the custom preset and verify all medicines and instructions.
- Add and update both a doctor and receptionist.
- Verify all destructive actions require confirmation.
- Reset the demo and confirm the original fictional data returns.
- Test at 1366×768 and 1920×1080.
- Run `pnpm lint` and `pnpm build`.
