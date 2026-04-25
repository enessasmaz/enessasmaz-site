---
title: "Dynamic RLS for 24 Roles in Power BI — USERPRINCIPALNAME() Patterns"
date: 2026-04-25
excerpt: "Static RLS roles become unmanageable past a dozen. Here's how a single dynamic role driven by USERPRINCIPALNAME() scales cleanly."
trUrl: /tr/blog/powerbi-dynamic-rls-userprincipalname/
enUrl: /en/blog/dynamic-rls-userprincipalname/
---

Row Level Security in Power BI is simple at first: a couple of roles, a DAX filter, assignments in the workspace. But once a sales organization scales — 24 regional managers, each restricted to their own region — the static role approach breaks.

## The problem: 24 static roles = 24 maintenance points

If you create one role per region:

- Every new region requires a model update and a republish
- A user responsible for two regions must be assigned to two roles
- Workspace assignment is error-prone — one wrong assignment leaks data

## The fix: one dynamic role + a mapping table

Add a `UserMapping` table to the model:

```
UserPrincipalName       | Region
------------------------|--------
ahmet@firm.com          | Marmara
ayse@firm.com           | Aegean
mehmet@firm.com         | Marmara
mehmet@firm.com         | Mediterranean
```

Relate this table to your fact table on `Region`. Then define a single role:

```dax
[Region] IN
CALCULATETABLE(
    VALUES(UserMapping[Region]),
    UserMapping[UserPrincipalName] = USERPRINCIPALNAME()
)
```

`USERPRINCIPALNAME()` returns the logged-in user's email. `CALCULATETABLE` retrieves all regions assigned to them, and the fact table is filtered to those regions only.

## Watch out when testing

When testing with "View as Roles" in Power BI Desktop, **always provide a real UPN in the "Other user" field**. Otherwise `USERPRINCIPALNAME()` returns empty and the filter hides every row. This detail wastes half a day on many teams.

## What changes in the Service

In the Service there are no longer 24 role assignments — just one "Dynamic" role with all workspace users assigned to it. Access is decided by the `UserMapping` table, which means the data team owns access (not IAM).

If you can populate `UserMapping` from a SQL view or Dataflow sourced from HR, then "we have a new regional manager" never again means "go update RLS."

## When not to use this pattern

If you have only a handful of roles (2-3), static RLS is more readable and easier to debug. This pattern earns its complexity past 10+ roles, or whenever the organization shifts frequently.
