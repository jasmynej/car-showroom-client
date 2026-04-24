# Car Showroom — React Frontend

## Stack
React + React Router + Axios + Context API (or Zustand for state)  
No auth tokens required — user ID and role are stored in context/state after login.

---

## Global State (Context or Store)

```js
{
  userId: number | null,
  role: "CUSTOMER" | "STAFF" | "MANAGER" | null,
  userName: string | null,
}
```

Used to: gate route access, pass userId into API calls, and conditionally render nav items.

---

## Routing Structure

```
/                          → Landing (SignIn)
/signup                    → SignUp
/login                     → Login

/customer/home             → CustomerHome
/customer/cars             → ViewCars
/customer/purchase/:vin    → GivePurchaseOrder
/customer/test-drive/:vin  → ScheduleTestDrive
/customer/payment/:vin     → MakePayment

/staff/home                → StaffHome
/staff/inventory           → CarInventory
/staff/inventory/update/:vin → UpdateCar
/staff/services            → ScheduleServiceDashboard
/staff/services/new/:vin   → ScheduleService

/manager/home              → ManagerHome
/manager/invoice           → CreateInvoice
/manager/report            → GenerateReport
```

---

## Shared Components

### `Navbar`
- Props: `role`, `userId`
- Renders role-specific nav links
  - Customer: Home, View Cars, Log Out
  - Staff: Home, Car Service, Manage Inventory, Log Out
  - Manager: Home, Generate Report, Generate Invoices, Log Out
- Log Out clears global state and redirects to `/`

### `ProfilePanel`
- Props: `userId`
- Fetches user info from `GET /api/users/:id`
- Displays: User ID, Name, Email, Contact Info
- Includes a Change Password input + button (`PUT /api/users/:id/password`)
- Reused by CustomerHome, StaffHome, and ManagerHome

### `CarTable`
- Props: `cars[]`, `actions: { label, onClick }[]`
- Renders a table with columns: VIN, Make, Model, Year, Color, Mileage, Last Service Date, Price, Status
- Each row gets action buttons passed in via `actions` prop
- Reused by ViewCars, CarInventory, and ScheduleServiceDashboard with different action configs

### `StatusBadge`
- Props: `status: string`
- Color-coded pill: Available (green), Sold (red), Reserved (yellow), Pending (orange), etc.

### `ProtectedRoute`
- Props: `allowedRoles: string[]`
- Reads role from context; redirects to `/login` if not authenticated or wrong role

---

## Screens

---

### Landing — `/`
**File:** `pages/Landing.jsx`

Two buttons: **Sign Up** and **Login**.  
No API calls.

---

### Sign Up — `/signup`
**File:** `pages/SignUp.jsx`

**Form fields:**
- User ID (numeric)
- Name
- Email
- Password
- Confirm Password
- Contact Information (textarea)
- Terms & Conditions checkbox

**Validation:**
- Confirm password must match password
- Terms checkbox must be checked before submit
- User ID must be numeric

**On submit:** `POST /api/users`  
Body: `{ userId, name, email, password, contactInfo, role: "CUSTOMER" }`

> Note: Original signup always created a base user. Role defaulted to CUSTOMER.
> If you want role selection on signup, add a role dropdown.

**On success:** Set context, redirect to `/customer/home`

---

### Login — `/login`
**File:** `pages/Login.jsx`

**Form fields:**
- User ID (numeric)
- Password
- Role dropdown: Customer | Staff | Manager

**On submit:** `POST /api/users/login` (or equivalent auth endpoint)  
Body: `{ userId, password, role }`

**On success:** Set context (`userId`, `role`, `userName`), redirect to role-based home  
**On failure:** Show inline error message (not a redirect)

---

### Customer Home — `/customer/home`
**File:** `pages/customer/CustomerHome.jsx`

**Layout:**
- `<Navbar role="CUSTOMER" />`
- `<ProfilePanel userId={userId} />`

No additional API calls beyond what `ProfilePanel` fetches.

---

### View Cars — `/customer/cars`
**File:** `pages/customer/ViewCars.jsx`

**On mount:** `GET /api/cars/available`

Renders `<CarTable>` with two actions per row:
- **Purchase Order** → navigate to `/customer/purchase/:vin`
- **Schedule Test Drive** → navigate to `/customer/test-drive/:vin`

---

### Give Purchase Order — `/customer/purchase/:vin`
**File:** `pages/customer/GivePurchaseOrder.jsx`

**Pre-filled (read-only):** VIN (from route param), Customer ID (from context)  
**Editable:** Comments  
**Status:** hardcoded "PENDING" — not user-editable

**On submit:** `POST /api/orders`  
Body: `{ customerId, vin, comments }`

**On success:** Navigate to `/customer/payment/:vin`

---

### Schedule Test Drive — `/customer/test-drive/:vin`
**File:** `pages/customer/ScheduleTestDrive.jsx`

**Pre-filled (read-only):** VIN, Customer ID  
**Editable:** Date (date picker), Time (time input), Comments  
**Status:** hardcoded "SCHEDULED"

**On submit:** `POST /api/test-drives`  
Body: `{ vin, customerId, date, time, comments, status: "SCHEDULED" }`

**On success:** Show success message, optionally navigate back to `/customer/cars`

---

### Make Payment — `/customer/payment/:vin`
**File:** `pages/customer/MakePayment.jsx`

**Pre-filled:** VIN (from route param), Customer ID (from context)  
**Editable:** Amount  
**Payment method dropdown:** Credit Card | Cash

Dynamic fields based on selection:
- **Credit Card:** Card Number, CVV
- **Cash:** Account Number, PIN, Bank

**On submit:** `POST /api/payments`

Credit Card body:
```json
{ "customerId": 1, "vin": "ABC123", "amount": 28000, "paymentMethod": "CREDIT_CARD",
  "creditCardNumber": "...", "cvvCode": 123 }
```
Cash body:
```json
{ "customerId": 1, "vin": "ABC123", "amount": 28000, "paymentMethod": "CASH",
  "accountNumber": "...", "pin": 1234, "bank": "..." }
```

**On success:** Show confirmation message

> This is the most complex form. The payment POST triggers Car status update,
> PurchaseOrder completion, and Sale creation on the backend — no extra frontend calls needed.

---

### Staff Home — `/staff/home`
**File:** `pages/staff/StaffHome.jsx`

- `<Navbar role="STAFF" />`
- `<ProfilePanel userId={userId} />`

---

### Car Inventory — `/staff/inventory`
**File:** `pages/staff/CarInventory.jsx`

**On mount:** `GET /api/cars`

Renders `<CarTable>` with two actions per row:
- **Delete** → `DELETE /api/cars/:vin`, confirm before firing, refresh table on success
- **Update** → navigate to `/staff/inventory/update/:vin`

**Add Car form** (below or above table):  
Fields: VIN, Make, Model, Year, Color, Mileage, Price, Availability Status  
On submit: `POST /api/cars`

---

### Update Car — `/staff/inventory/update/:vin`
**File:** `pages/staff/UpdateCar.jsx`

**On mount:** `GET /api/cars/:vin` to pre-fill current values  
**VIN field:** read-only  
**Editable:** Make, Model, Year, Color, Mileage, Price, Status

**On submit:** `PUT /api/cars/:vin`  
Body: `{ make, model, year, color, mileage, price, availabilityStatus }`

**On success:** Navigate back to `/staff/inventory`

---

### Schedule Service Dashboard — `/staff/services`
**File:** `pages/staff/ScheduleServiceDashboard.jsx`

**On mount:** `GET /api/cars`

Renders `<CarTable>` with one action per row:
- **Schedule Service** → navigate to `/staff/services/new/:vin`

---

### Schedule Service — `/staff/services/new/:vin`
**File:** `pages/staff/ScheduleService.jsx`

**Pre-filled (read-only):** VIN (from route param)  
**Editable:** Service Type, Date (date picker), Comments  
**Status:** hardcoded "SCHEDULED"

**On submit:** `POST /api/services`  
Body: `{ vin, serviceType, date, comments, status: "SCHEDULED" }`

**On success:** Show success toast, clear form

---

### Manager Home — `/manager/home`
**File:** `pages/manager/ManagerHome.jsx`

- `<Navbar role="MANAGER" />`
- `<ProfilePanel userId={userId} />`

---

### Create Invoice — `/manager/invoice`
**File:** `pages/manager/CreateInvoice.jsx`

**Search:** Customer name input → `GET /api/orders?customerName=...` (or by ID)  
Displays matching orders with status APPROVED and no existing invoice.

**Invoice form fields:**  
- Order ID (selected from search results, read-only after selection)
- Customer ID (auto-filled)
- Price (auto-filled from order's car price)
- Tax (% input, editable)
- Total Amount (computed: `price + price * tax / 100`, read-only)
- Terms and Conditions (textarea)

**On submit:** `POST /api/invoices`  
Body: `{ orderId, customerId, price, tax, totalAmount, termsAndConditions }`

**On success:** Show confirmation with invoice ID

> The original implementation was incomplete — the Create Invoice button was stubbed.
> This is the corrected intended flow.

---

### Generate Report — `/manager/report`
**File:** `pages/manager/GenerateReport.jsx`

**On mount:** `GET /api/sales`

Renders a bar chart (use Recharts or Chart.js):
- X-axis: Sale ID or Sale Date
- Y-axis: count or a bar per sale record
- Each bar labeled with the VIN sold

---

## Components Directory Structure

```
src/
├── context/
│   └── AppContext.jsx         # userId, role, userName + setters
├── components/
│   ├── Navbar.jsx
│   ├── ProfilePanel.jsx
│   ├── CarTable.jsx
│   ├── StatusBadge.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── customer/
│   │   ├── CustomerHome.jsx
│   │   ├── ViewCars.jsx
│   │   ├── GivePurchaseOrder.jsx
│   │   ├── ScheduleTestDrive.jsx
│   │   └── MakePayment.jsx
│   ├── staff/
│   │   ├── StaffHome.jsx
│   │   ├── CarInventory.jsx
│   │   ├── UpdateCar.jsx
│   │   ├── ScheduleServiceDashboard.jsx
│   │   └── ScheduleService.jsx
│   └── manager/
│       ├── ManagerHome.jsx
│       ├── CreateInvoice.jsx
│       └── GenerateReport.jsx
├── api/
│   └── axios.js              # Axios instance with baseURL pointed at Spring Boot API
└── App.jsx                   # Route definitions + ProtectedRoute wrappers
```

---

## API Base URL

```js
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default api;
```

All components import from `../api/axios` rather than calling `fetch` directly.

---

## Missing Screens (Not in Original — Recommended Additions)

These were absent from the Swing app but are implied by the data model:

| Screen | Route | Why |
|---|---|---|
| My Orders | `/customer/orders` | Customer has no way to review past orders |
| Order Management | `/manager/orders` | Manager needs to approve/reject PENDING orders |

Both are straightforward list + status-patch screens. Worth adding to the `claude.md` if Slingshot will build them.
