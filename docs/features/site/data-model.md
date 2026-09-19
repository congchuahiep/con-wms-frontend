# Data Model — Site

> Nguồn: `docs/entities/site/model.md` + `api.md`

## 1. Types
```typescript
export type Site = {
  id: number;
  code: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  note: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type SimpleSite = { id: number; code: string; name: string };
export type SiteInput = { code: string; name: string; manager: string; phone: string; address: string; note: string };
export type GetSitesParams = { search?: string; isActive?: boolean };
```

## 2. Schemas (Valibot)
```typescript
import * as v from "valibot";
export const SiteSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty("Mã không được để trống"), v.maxLength(20,"Tối đa 20 ký tự"), v.regex(/^[a-zA-Z0-9_]+$/,"Chỉ chữ/số/_")),
  name: v.pipe(v.string(), v.nonEmpty("Tên không được để trống"), v.maxLength(200,"Tối đa 200 ký tự")),
  manager: v.optional(v.string(), ""),
  phone: v.optional(v.string(), ""),
  address: v.optional(v.string(), ""),
  note: v.optional(v.string(), ""),
});
```

## 3. Utils
Không cần color map. Helper `toSiteInput(site: Site): SiteInput` nếu cần edit form.
```
