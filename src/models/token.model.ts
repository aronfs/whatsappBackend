import {Entity, model, property} from '@loopback/repository';

export enum AppUserType {
  Company = 'Company',
  Location = 'Location',
}

export enum TokenType {
  Bearer = 'Bearer',
}

@model()
export class InstallationDetails extends Entity {


  @property({
    type: 'string',
    required: true,
  })
  access_token: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(TokenType),
    },
    required: true,
  })
  token_type: TokenType;

  @property({
    type: 'number',
    required: true,
  })
  expires_in: number;

  @property({
    type: 'string',
    required: true,
  })
  refresh_token: string;

  @property({
    type: 'string',
    required: true,
  })
  scope: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(AppUserType),
    },
    required: true,
  })
  userType: AppUserType;

  @property({
    type: 'string',
    required: false,
  })
  companyId?: string;

  @property({
    type: 'string',
    id:true,
    //required: false,
    generated: true,
  })
  locationId?: string;

  constructor(data?: Partial<InstallationDetails>) {
    super(data);
  }
}

export interface InstallationDetailsRelations {
  // describe navigational properties here
}

export type InstallationDetailsWithRelations = InstallationDetails & InstallationDetailsRelations;
