import {Entity, model, property} from '@loopback/repository';

@model()
export class SmsLogEntry extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  contactId: string;

  @property({
    type: 'string',
    required: true,
  })
  conversationProviderId: string;

  @property({
    type: 'string',
    required: true,
  })
  toNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
  })
  responseConversationId?: string;

  @property({
    type: 'string',
  })
  responseMessageId?: string;

  @property({
    type: 'string',
  })
  responseTraceId?: string;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: Date;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  constructor(data?: Partial<SmsLogEntry>) {
    super(data);
  }
}

export interface SmsLogEntryRelations {
  // define relation here
}

export type SmsLogEntryWithRelations = SmsLogEntry & SmsLogEntryRelations;
