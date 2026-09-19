# Bharat Clinic Demo

A desktop-first, browser-persisted clinic workflow demonstration. All people, clinical records, and prescriptions are fictional demo data. No backend or real authentication is used.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. For the main workflow, go directly to `http://localhost:3000/receptionist`.

## 2–3 minute demo script

1. On Reception, point out the live waiting, consultation, and completed totals.
2. Select **Start demo: find a patient**.
3. Enter `9876543210` to find Rajesh, or enter a new number and register a patient.
4. Add the patient to today’s queue and note the assigned token. A duplicate active token is prevented.
5. Open **Doctor Queue**, call the patient, and open their profile.
6. Start the consultation, apply a template or enter a diagnosis, and add at least one medicine.
7. Save the visit. The token becomes completed and the new consultation appears in patient history.
8. Use **Print preview** to show the browser-printable consultation, then use **Reset demo data** before another presentation.

Demo state is stored in localStorage under `bharat_clinic_demo_state_v1` and survives refreshes.

## Verification

```bash
pnpm lint
pnpm build
```

Primary presentation sizes: 1366×768 and 1920×1080.
