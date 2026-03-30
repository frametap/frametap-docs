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
| 1 file upload (50 MB) | 1 credit |

### Examples

- A 5-minute recording = 30 credits (300 seconds ÷ 10)
- 50 screenshots = 50 credits
- 200 MB of files = 4 credits (200 ÷ 50)

## Plans

### Free

- **Price**: $0/month
- **Credits**: 30/month
- **Storage**: 7-day retention
- **Max file size**: 100 MB
- **Projects**: 3
- **Runners**: 1

### Dev

- **Price**: $10/month
- **Credits**: 300/month (~300 screenshots, 50 min video)
- **Storage**: 30-day retention
- **Max file size**: 5 GB
- **Projects**: 10
- **Runners**: Unlimited

### Pro

- **Price**: $20/month
- **Credits**: 1000/month
- **Storage**: 60-day retention
- **Max file size**: 15 GB
- **Projects**: Unlimited
- **Runners**: Unlimited
- **Credit packs**: Available

## Credit Packs

Purchase additional credits that never expire:

| Pack | Credits | Price |
|------|---------|-------|
| Small | 250 | $12 |
| Medium | 600 | $24 |
| Large | 1500 | $45 |

Buy credit packs from the dashboard or via API:

```bash
curl -X POST https://api.frametap.io/v1/billing/credits \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "productId": "credit-pack-medium",
    "quantity": 1
  }'
```

## Checking Credits

### Via Dashboard

Go to [frametap.io/billing](https://frametap.io/billing) to see:
- Current credit balance
- Usage this month
- Credit history

### Via API

```bash
curl https://api.frametap.io/v1/users/me/credits \
  -H "Authorization: Bearer $API_KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": 284,
    "monthlyCredits": 300,
    "usedThisMonth": 16,
    "creditPacks": 50
  }
}
```

## Managing Subscription

### Change Plan

Upgrade or downgrade via the dashboard:

1. Go to Settings → Billing
2. Select new plan
3. Confirm change

Or via API:

```bash
curl -X POST https://api.frametap.io/v1/billing/subscription \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"planId": "pro"}'
```

### Cancel Subscription

Cancel at any time from the dashboard. Your subscription remains active until the end of the billing period.

### Manage Payment

Update payment methods:

```bash
# Get Stripe portal URL
curl https://api.frametap.io/v1/billing/subscription/manage \
  -H "Authorization: Bearer $API_KEY"
```

## Usage Optimization

### 1. Use Screenshots for Short Captures

Screenshots cost less than video:
- 1 screenshot = 1 credit
- 10 seconds of video = 1 credit

### 2. Optimize Recording Duration

Use `selenium_idle` stop condition to avoid recording idle time:

```bash
# Instead of fixed 5-minute recording (30 credits)
curl -X POST /v1/jobs \
  -d '{
    "stopCondition": "selenium_idle",
    "stopConditionConfig": {"gridUrl": "http://selenium:4444"}
  }'
```

### 3. Exclude Unnecessary Files

Filter watch folder uploads:

```bash
frametap watch start \
  --dir /app/output \
  --exclude "*.log" \
  --exclude "*.tmp"
```

### 4. Monitor Usage

Track usage patterns:

```bash
# List jobs this month
curl "https://api.frametap.io/v1/jobs?createdAfter=2026-03-01" \
  -H "Authorization: Bearer $API_KEY" \
  | jq '.data.items | group_by(.type) | map({type: .[0].type, count: length})'
```

## Billing Alerts

Set up alerts in the dashboard to notify when:
- Credits are running low
- Monthly quota is 80% consumed
- Unusual usage detected

## Invoices

Download invoices from the dashboard:

1. Go to Settings → Billing
2. Click "Invoices"
3. Download PDF

## FAQ

**What happens when I run out of credits?**
Jobs will fail with "insufficient credits" error. Purchase a credit pack or upgrade your plan.

**Do credits roll over?**
Monthly credits do not roll over. Credit pack credits never expire.

**Can I get a refund?**
Contact support for refund requests within 14 days of purchase.

**What payment methods are accepted?**
We accept all major credit cards via Stripe.

**Is there an enterprise plan?**
Yes, contact sales@frametap.io for custom pricing with dedicated support and SLA.
