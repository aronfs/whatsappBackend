export interface IContact {
  id?: string;
  locationId?: string;
  email?: string;
  emailLowerCase?: string;
  fingerprint?: string;
  timezone?: string;
  country?: string;
  source?: string;
  dateAdded?: string; // Formato ISO 8601
  firstName?: string;
  lastName?: string;
  name?: string;
  companyName?: string;
  assignedTo?: string;
  tags?: string[];
  customField?: {
    id?: string;
    value?: unknown;
  }[];
  [key: string]: unknown; // Permite otras propiedades dinámicas
}
