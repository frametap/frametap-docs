# Billing

Frametap uses a credit-based billing system for usage across all capture types.

## Overview

Credits are consumed when:
- Taking screenshots
- Recording video
- Uploading files from watch folders

## Credit Costs

| Action | Credits |
|--------|---------|
| 1 screenshot | 1 credit |
| 10 seconds of video | 1 credit |
| 1 file upload | At least 1 credit, then rounded up by 50 MB |

### Examples

- A 5-minute recording = 30 credits (300 seconds ÷ 10)
- 50 screenshots = 50 credits
- A 30 MB file = 1 credit
- A 70 MB file = 2 credits
- A 200 MB file = 4 credits

## Plans

| Plan | Price | Credits | Storage | Max file size | Runners | Credit packs |
|------|-------|---------|---------|---------------|---------|--------------|
| Free | $0/month | 30/month | 7-day retention | 100 MB | Unlimited | No |
| Dev | $10/month | 300/month (~300 screenshots, 50 min video) | 30-day retention | 5 GB | Unlimited | Yes |
| Pro | $20/month | 1000/month | 60-day retention | 15 GB | Unlimited | Yes |

## Credit Packs

Purchase additional credits that never expire:

| Pack | Credits | Price |
|------|---------|-------|
| Small | 250 | $12 |
| Medium | 600 | $24 |
| Large | 1500 | $45 |

Buy credit packs from [Settings → Billing](https://frametap.io/app/settings/billing).

## Checking Credits

### Via Dashboard

Go to [Settings → Billing](https://frametap.io/app/settings/billing) to see:
- Current credit balance
- Usage this month
- Credit history

### Via API

If you need the remaining credits programmatically, use the billing endpoints in the API reference:

- [Billing endpoints](https://api-reference.frametap.io/#tag/billing)

## Managing Subscription

Use [Settings → Billing](https://frametap.io/app/settings/billing) to open the Stripe customer portal.

From there, users can:

- change plan
- update the credit card on file
- manage billing details
- cancel the subscription
- download invoices

If a subscription is cancelled, it remains active until the end of the current billing period.

## FAQ

**What happens when I run out of credits?**
Jobs will fail with an insufficient credits error.

**Do credits roll over?**
Monthly credits do not roll over. Credit pack credits expire after 12 months.

**Can I get a refund?**
Contact support for refund requests within 14 days of purchase.

**What payment methods are accepted?**
We accept all major credit cards via Stripe.

**Is there an enterprise plan?**
Yes, contact hello@frametap.io for custom pricing with dedicated support and SLA.
