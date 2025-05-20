import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  @property({
    type: 'string',
  })
  instanceId?: string; // Agregado para mantener relación con Evolution API

  // Propiedad indexada para permitir datos adicionales sin romper el modelo
  [prop: string]: unknown;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  // Aquí puedes definir las relaciones con otros modelos si es necesario
}

export type MessageWithRelations = Message & MessageRelations;
