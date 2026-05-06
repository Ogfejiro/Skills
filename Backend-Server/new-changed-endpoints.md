# New & Changed Endpoints

All authenticated routes require `Authorization: Bearer <accessToken>`.

---

## Auth

### `POST /api/auth/register` *(changed — now accepts referralCode)*

Adds optional `referralCode`. Existing fields unchanged.

**Body**
```json
{
  "email": "user@example.com",
  "phone": "08012345678",
  "password": "secret123",
  "firstName": "John",
  "lastName": "Doe",
  "referralCode": "LOFTE-123456"
}
```

- `referralCode` is **optional**. Leave it out for normal signup.
- If supplied and invalid → `400 Invalid referral code`.
- If supplied and valid → new user is linked to the referrer; a signup `Referral` row is logged automatically.

**Response** — unchanged.
```json
{ "message": "User registration successful" }
```

---

## Referrals (auth required)

All endpoints below live under `/api/referrals` and require auth.

### `GET /api/referrals/me`

Returns the current user's referral overview.

**Response**
```json
{
  "refId": "LOFTE-123456",
  "referralWallet": 12.45,
  "referralEarningsTotal": 38.10,
  "totalReferred": 7
}
```

- `refId` — share this with others as their referral code.
- `referralWallet` — current withdrawable USD balance.
- `referralEarningsTotal` — lifetime USD earned (does not decrease on withdrawal).
- `totalReferred` — number of users who signed up with this user's `refId`.

---

### `GET /api/referrals/list?page=1&limit=20`

Paginated list of users this user referred.

**Query**: `page` (default 1), `limit` (default 20, max 100).

**Response**
```json
{
  "page": 1,
  "limit": 20,
  "total": 7,
  "totalPages": 1,
  "referees": [
    {
      "id": "65fb...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "joinedAt": "2026-04-12T10:32:18.000Z"
    }
  ]
}
```

---

### `GET /api/referrals/commissions?page=1&limit=20`

Paginated list of purchase commissions earned. Each row is one ticket payment from a referred host.

**Response**
```json
{
  "page": 1,
  "limit": 20,
  "total": 14,
  "totalPages": 1,
  "entries": [
    {
      "id": "...",
      "amount": 0.25,
      "currency": "USD",
      "status": "rewarded",
      "referee": {
        "id": "65fb...",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2026-05-04T19:01:22.000Z"
    }
  ]
}
```

---

### `POST /api/referrals/withdraw`

Submit a withdrawal request from referral wallet. Sends emails to admin and user, debits the wallet, and creates a `Withdrawal` audit record.

**Body — bank**
```json
{
  "amount": 25,
  "method": "bank",
  "paymentInfo": {
    "bankName": "GTBank",
    "accountName": "John Doe",
    "accountNo": "0123456789"
  }
}
```

**Body — crypto**
```json
{
  "amount": 25,
  "method": "crypto",
  "paymentInfo": {
    "walletType": "USDT (SOL)",
    "walletAddress": "EsXYZ...sol-address"
  }
}
```

- `amount` is in **USD**, minimum `$5`.
- `method` must be `"bank"` or `"crypto"`.
- For bank, `bankName + accountName + accountNo` are required.
- For crypto, `walletType + walletAddress` are required.
- Bank withdrawals are converted to NGN using the admin conversion rate (only visible to admin in their email — user always sees USD).

**Success response**
```json
{
  "success": true,
  "message": "Withdrawal request submitted. Your payment will be processed within 24 hours.",
  "data": {
    "withdrawalId": "65fb...",
    "amount": 25,
    "method": "bank",
    "currency": "USD",
    "newBalance": 12.34,
    "payoutAmount": 40500,
    "payoutCurrency": "NGN",
    "conversionRate": 1620,
    "requestedAt": "2026-05-06T14:22:18.000Z"
  }
}
```

For crypto, `payoutAmount`, `payoutCurrency`, and `conversionRate` are `null`.

**Errors**
- `400` — invalid amount, below minimum, missing/invalid `method` or `paymentInfo`, insufficient balance.
- `502` — emails failed to send. Wallet is auto-refunded, user can retry.

---

## Host Withdrawal *(changed — now USD-based)*

### `POST /api/host/withdrawal`

> **Breaking change for frontend:** `amount` is now USD instead of NGN. Minimum is `$5`.

**Body — bank**
```json
{
  "amount": 50,
  "method": "bank",
  "paymentInfo": {
    "bankName": "GTBank",
    "accountName": "John Doe",
    "accountNo": "0123456789"
  }
}
```

**Body — crypto**
```json
{
  "amount": 50,
  "method": "crypto",
  "paymentInfo": {
    "walletType": "USDT (SOL)",
    "walletAddress": "EsXYZ..."
  }
}
```

- `paymentInfo` is optional if the host has only one method configured on their profile (legacy behavior preserved).
- For bank, the backend converts USD → NGN using the admin conversion rate. Only the admin email shows NGN; the user sees USD.

**Success response**
```json
{
  "success": true,
  "message": "Withdrawal request submitted. Your payment will be processed within 24 hours.",
  "data": {
    "withdrawalId": "65fb...",
    "amount": 50,
    "currency": "USD",
    "method": "bank",
    "paymentInfo": { "bankName": "...", "accountName": "...", "accountNo": "..." },
    "balance": 35.20,
    "payoutAmount": 81000,
    "payoutCurrency": "NGN",
    "conversionRate": 1620,
    "requestedAt": "2026-05-06T14:22:18.000Z"
  }
}
```

**Errors**
- `400` — invalid amount, below `$5` minimum, no method configured, mismatched `paymentInfo`, insufficient balance.
- `502` — email delivery failure (balance auto-refunded).

---

## Admin Settings *(admin role required)*

### `GET /api/admin/settings`

Returns global admin settings (currently just the conversion rate).

**Response**
```json
{
  "conversionRate": 1500,
  "updatedAt": "2026-05-06T10:00:00.000Z"
}
```

If the settings doc does not exist yet, it is auto-created with `conversionRate: 1500`.

---

### `PATCH /api/admin/settings`

Updates the conversion rate used for all bank withdrawals (host + referral).

**Body**
```json
{ "conversionRate": 1620 }
```

- `conversionRate` is required and must be a number `>= 100`.

**Response**
```json
{
  "conversionRate": 1620,
  "updatedAt": "2026-05-06T14:22:18.000Z"
}
```

**Errors**
- `400` — missing or invalid `conversionRate`.
- `403` — caller is not admin.

---

## Notes for the frontend

1. **Currency switch**: host wallet, referral wallet, and all withdrawal `amount` values are USD. Display `$X.XX` everywhere except the admin-side breakdown for bank withdrawals.
2. **Referral code on signup**: collect it on the register form as an optional input. Pre-fill from `?ref=LOFTE-XXXXXX` query param if present.
3. **Sharing referral code**: use `refId` from `GET /api/referrals/me`. Build share links like `https://lofte.live/auth/register?ref=LOFTE-XXXXXX`.
4. **Withdrawal min**: enforce `>= $5` client-side for both host and referral flows.
5. **Existing host withdrawal frontend** must be updated to send USD; `amount: 32000` (NGN) will now be rejected as way over balance once host wallets migrate to USD.
