# QA Defect Reporter — Client Documentation
> Meridian Manufacturing Group · Prepared by eevolvv · April 2026

---

## What This Agent Does

The QA Defect Reporter is an AI agent that runs automatically every night at midnight (CT) and delivers a QA summary report to your shift supervisors by 6:00am.

It:
- Reads defect log data from your production database
- Calculates defect totals and trends per production line
- Flags any lines with unusually high defect rates
- Emails the report to your supervisor team

**You don't need to do anything.** The agent runs on its own.

---

## When to Expect Your Report

The report arrives in your supervisors' inboxes between **5:45am and 6:15am CT** on weekday mornings.

Subject line: `QA Report — YYYY-MM-DD — Meridian Manufacturing`

From: `reports@eevolvv.com`

---

## What's in the Report

1. **Summary table** — Each production line with: total defects, critical defects (severity 4–5), and comparison to the 7-day average
2. **Outlier flags** — Any line running significantly above its normal rate
3. **Top defects** — The 5 most common defect codes per line

---

## What "Flagged" Means

A line is flagged when its defect count is more than 3 standard deviations above its 7-day average. This means it's statistically unusual — not just higher than average, but significantly higher.

A flag is informational. The agent does not make decisions or shut anything down.

---

## What to Do If You Don't Receive a Report

1. Check your spam folder for `reports@eevolvv.com`
2. If it's not there, email hello@eevolvv.com — we'll investigate within 2 hours

---

## What the Agent Cannot Do

- It cannot write to your production database
- It cannot make real-time decisions
- It cannot send reports to email addresses not on the approved list
- It cannot explain why defects occurred — it reports what the data shows

---

*Questions? Contact Eduardo at hello@eevolvv.com*
