# Mwalimu Family editorial guide

Version 1 · 21 November 2026

## 1. Principles
1. **Official first.** Exam dates, grading rules, placement and fees come from KNEC, the Ministry of Education, KICD, KUCCPS, HELB or TSC. Media reports are context, not the source of record.
2. **Say what is known.** Results dates are *targets* until KNEC or the Ministry confirms a date. Write "expected" or "targeted", never "will be released on" unless an official notice gives the date.
3. **Useful to a family.** Every story answers: what happened, what it means for a parent, teacher or learner, and what to do next.
4. **Never make people pay or panic.** No story, notice or advert may suggest paying to see results, secure a place or get a job.

## 2. Weekly routine

| Day | Task | Output |
|---|---|---|
| Mon | Check Tier 1 sources (see `sources.md`) for new circulars, dates and notices. Update exam countdowns. In `feed.json`, remove or expire old jobs and notices. | Updated `feed.json`, change log entry |
| Tue | Write 2 news briefs and 1 explainer from the week's confirmed developments. | 3 drafts → review |
| Wed | Fill one library template (lesson notes, scheme, revision pack, rubric). Check it against the current KICD curriculum design. | 1 library item |
| Thu | Work the submissions inbox (jobs, notices, tutors, adverts). Verify each, then publish, reply or reject. | Inbox at zero |
| Fri | Send the WhatsApp and email roundup. Review reader error reports and publish corrections. Spot-check one calculator against an official worked example. | Roundup, corrections log |

**Monthly:** re-verify every item in `data-verification-log.md`; run a broken-link check on official links; delete form submissions older than 180 days (the worker also expires them automatically); review the Parents' hub checklist.

**Exam season** (results, placement, registration): check Tier 1 sources twice a day. Update the "Latest" ticker and notice board the same day. Post a scam alert whenever fake-results messages circulate.

## 3. Publishing workflow
1. **Draft** from a template in `templates/`. Fill every front-matter field, especially `sources` and `verified_by`.
2. **Verify** using the checklist in section 4.
3. **Second read.** A different person reads for accuracy and tone. Where you work alone, wait one hour and re-read against the sources.
4. **Publish.** Add or update the entry in the page data or `feed.json`, set `"st": "published"` and an `"exp"` date for anything time-limited.
5. **Log.** Record the item, date and verifier in the change log below.

## 4. Pre-publish checklist
- [ ] Every date, figure, name and title matches a source I have opened this week.
- [ ] Any number that matters (dates, candidates, points, fees) has a Tier 1 source, or two independent Tier 2 sources.
- [ ] The headline matches the body. Targets are not written as certainties.
- [ ] The story says what the reader should do next, with the official link.
- [ ] Sources are named in the text or linked, and quotes are short and exact.
- [ ] No learner's name, photo, index number or phone number appears.
- [ ] Images and templates are ours, licensed, or linked rather than copied.
- [ ] Sponsored or paid content is labelled "Sponsored".
- [ ] Reading level suits a parent: short sentences, terms explained once.
- [ ] Kiswahili summary added for exam and safety stories where possible.
- [ ] An expiry date is set for notices, jobs and countdowns.

## 5. Attribution and copyright
- **Write in our own words.** Do not copy articles. Summarise, then link to the original. Use quotation marks for exact words and keep quotes short.
- **Name the source in the text**, for example "Education CS Julius Ogamba said on 20 November 2026", and link to the primary document where it exists.
- **KNEC, KICD and Ministry documents** (circulars, curriculum designs, past papers) are published by those bodies. Link to them. Reproduce only short extracts, and re-host a document only where its licence or permission allows it.
- **Photos and video:** use our own, or items with a clear licence, and credit the owner. Never use photos of identifiable learners without a parent's written consent.
- **Reader and teacher submissions:** the submitter must confirm they own the material or have permission. Say "Submitted by [name/organisation]" on published items.
- **Templates and lesson materials** we publish are ours. State the licence on each item (for example "Free for classroom use, not for resale").
- **Third-party calculators and guides:** do not copy their text. Build from official rules and cite them in `data-verification-log.md`.
- This is a working policy, not legal advice. Have a Kenyan IP adviser confirm the licence wording before launch.

## 6. Corrections
- The footer "Report an error" link sends a WhatsApp message with the page address.
- Acknowledge within 24 hours. Fix confirmed errors the same day.
- For material errors, add a dated note at the top of the item: "Correction, [date]: [what changed and why]". Do not delete the original wording silently.
- Record every correction in the log below.

## 7. Adverts, jobs and notices
- Paid content is labelled "Sponsored" and kept visually separate from news. Advertisers get no say over editorial content.
- We do not accept adverts that promise exam leaks, early or "guaranteed" results, guaranteed placement, or admission for a fee.
- **Jobs:** accept only if the employer is identifiable, contacts are reachable, and no application fee is requested. For school and TSC vacancies, confirm through the school or the official TSC notice. Reject anything that asks applicants to pay.
- **Notices:** confirm with a call or an official channel before publishing. Set an expiry date.
- **Tutors:** verify identity and qualifications before listing. Only share a tutor's contact details with the requester after the tutor agrees.
- Publish only `"st": "published"` entries. Use `"st": "draft"` while checking and `"st": "rejected"` with a reason in the log.

## 8. Safety and scams
- Never publish a link or phone number purporting to give early results.
- Repeat the standard warning on every results story: "Only the Ministry of Education and KNEC release official results. Never pay to see results early."
- Do not publish content that identifies learners, shames schools or spreads unconfirmed rumours.

## 9. Privacy handling
- Form submissions arrive by email and are stored for 180 days. Download or forward only what you need, and delete after use.
- Newsletter data is used only for the newsletter. Remove anyone who asks, within seven days.
- Do not paste submissions into any tool or chat that is not covered by the privacy notice.

## 10. Change log

| Date | Item | Change | By |
|---|---|---|---|
| 2026-11-21 | Tools and exam content | Formulas checked against published sources; KJSEA calculator capped at nine learning areas; disclaimers updated | |
