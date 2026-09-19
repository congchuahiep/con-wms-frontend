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

export type SiteInput = {
  code: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  note: string;
};

export type GetSitesParams = {
  search?: string;
  isActive?: boolean;
};
