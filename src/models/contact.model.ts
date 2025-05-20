import {Entity, model, property} from '@loopback/repository';

@model()
export class Contact extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  locationId: string;

  @property({
    type: 'string',
  })
  gender?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  address1?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  postalCode?: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  timezone?: string;

  @property({
    type: 'boolean',
  })
  dnd?: boolean;

  @property({
    type: 'object',
  })
  dndSettings?: {
    Call?: {status?: string; message?: string; code?: string};
    Email?: {status?: string; message?: string; code?: string};
    SMS?: {status?: string; message?: string; code?: string};
    WhatsApp?: {status?: string; message?: string; code?: string};
    GMB?: {status?: string; message?: string; code?: string};
    FB?: {status?: string; message?: string; code?: string};
  };

  @property({
    type: 'object',
  })
  inboundDndSettings?: {
    all?: {status?: string; message?: string};
  };

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  customFields?: {key?: string; field_value?: string}[];

  @property({
    type: 'string',
  })
  source?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  companyName?: string;

  constructor(data?: Partial<Contact>) {
    super(data);
  }
}

export interface ContactRelations {
  // describe navigational properties here
}

export type ContactWithRelations = Contact & ContactRelations;
