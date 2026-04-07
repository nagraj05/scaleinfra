# Project Development Instructions

This document defines the coding standards, architecture rules, and technology stack for this project.
All generated code must follow these rules strictly.

---

# Tech Stack

Always use the **latest stable versions** of the following:

- **Framework:** Next.js (App Router)
- **Frontend:** React.js
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Data Fetching:** TanStack Query
- **Authentication:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Backend:** Next.js Route Handlers (`app/api`)

---

# Architecture

Use a **modular, scalable architecture**.
Split code into small reusable modules wherever possible.

Recommended structure:

```
/app
  /(routes)
  /api
  /layout.tsx
  /page.tsx

/components
  /ui
  /shared
  /features

/hooks

/services
  /api
  /db

/lib
  /utils
  /constants
  /validators

/types

/providers

/styles
```

---

# Separation of Responsibilities

### Components

Located in `/components`.

Rules:

- Only UI logic
- No API calls inside components
- Receive data via props
- Feature-specific components go in `/components/features`

---

### Hooks

Located in `/hooks`.

Responsibilities:

- Data fetching
- State management
- Business logic

Examples:

```
useUsers.ts
useItems.ts
useDashboard.ts
```

Use **TanStack Query** for all server state.

---

### Services

Located in `/services`.

Responsibilities:

- API requests
- Database interactions
- External integrations

Example:

```
/services/db
/services/api
```

Components must **never directly interact with the database**.

---

### Utilities

Located in `/lib/utils`.

Contains helper functions like:

- formatting
- calculations
- transformations

Example:

```
/lib/utils/formatCurrency.ts
/lib/utils/dateHelpers.ts
```

---

### Types

Located in `/types`.

Define shared TypeScript types.

Examples:

```
user.ts
api.ts
common.ts
```

Avoid using `any`.

---

# Backend

Use **Next.js Route Handlers** for backend APIs.

Location:

```
/app/api
```

Example:

```
/app/api/items/route.ts
```

Rules:

- Validate input
- Call service layer
- Return typed responses
- Handle errors properly

---

# Data Fetching

Use **TanStack Query** for all server data.

Never fetch data directly in components using `useEffect`.

Example pattern:

```
/hooks/useItems.ts
```

Example usage:

```
useQuery({
  queryKey: ['items'],
  queryFn: fetchItems
})
```

Benefits:

- caching
- background refetching
- better loading states

---

# Authentication

Use **Clerk** for authentication.

Requirements:

- Clerk middleware for route protection
- Access user information via Clerk hooks
- Store user identifiers in the database if needed

---

# Database

Use **Supabase PostgreSQL**.

Rules:

- Database logic must be inside `/services/db`
- Never write database queries inside components

Example:

```
/services/db/userService.ts
```

---

# UI System

Use **shadcn/ui components**.

Install components directly:

```
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

Do not manually install Radix UI.

---

# UI Design Rules

Follow a **clean minimal interface**.

Rules:

- No gradients
- Small spacing only
- Prefer **2px or 4px spacing**
- Compact layout

Allowed spacing examples:

```
p-1
p-2
gap-1
gap-2
gap-4
```

Avoid large spacing like:

```
p-10
p-12
```

---

# Theme Support

The application must support:

- Light mode
- Dark mode
- System theme

Use:

```
next-themes
```

Requirements:

- Theme toggle component
- Persisted theme preference

---

# Skeleton Loaders

All asynchronous UI must include **skeleton loaders**.

Example structure:

```
/components/skeletons
```

Examples:

```
card-skeleton.tsx
table-skeleton.tsx
list-skeleton.tsx
```

Never display blank loading states.

---

# Code Quality

Follow these principles:

### DRY

Avoid duplicated logic.

Extract shared logic into:

- utilities
- hooks
- services

---

### Clean Code

Rules:

- meaningful variable names
- small functions
- readable structure
- avoid nested complexity

Good naming:

```
fetchUserProfile
calculateTotalCost
getActiveItems
```

Bad naming:

```
doStuff
getData
func1
```

---

# Error Handling

Always handle errors.

Patterns:

```
try/catch
error boundaries
toast notifications
```

Never ignore errors silently.

---

# Performance

Use performance best practices:

- `React.memo`
- `useCallback`
- `useMemo`
- lazy loading when appropriate

Avoid unnecessary re-renders.

---

# Environment Variables

Store configuration in:

```
.env.local
```

Examples:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Never expose secrets in client code.

---

# Component Rules

Components must be:

- small
- reusable
- readable

Example file structure:

```
components/features/example/example-card.tsx
```

Business logic belongs in **hooks or services**, not components.

---

# General Principles

Every feature should follow this flow:

1. Types
2. Service layer
3. API route
4. Query hook
5. UI components
6. Skeleton loaders
7. Error handling

---

# Development Philosophy

Code generated for this project must always be:

- production ready
- modular
- maintainable
- scalable
- strictly typed
- minimal UI design

Avoid prototype or quick hack solutions.
