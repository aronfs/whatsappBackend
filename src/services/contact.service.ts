import {inject, injectable} from '@loopback/core';
import {COMPANY_ID, LOCATION_ID} from '../config';
import {TokenGhlService} from './tokenGhl.service';
import {SmsLogEntry} from '../models';
import {SmslogRepository}from '../repositories/smslog.repository';

@injectable()
export class ContactService {
  constructor(
    @inject('services.TokenGhlService')
    public tokenGhlService: TokenGhlService,
    @inject('repositories.SmslogRepository')
    public smslogRepository: SmslogRepository,
  ) {}

  async createContact(contactData: any): Promise<any> {
    const request = this.tokenGhlService.requests(LOCATION_ID.location_id);
    try {
      const response = await request.post('/contacts', contactData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating contact:', error.response?.data);
      throw error;
    }
  }
async getContactById(): Promise<any[]> {
  const locationId = LOCATION_ID.location_id; // ID de la ubicación actual
  const request = this.tokenGhlService.requests(locationId); // Instancia del cliente de peticiones
  const allContacts: any[] = []; // Acumulador de todos los contactos
  let nextPageUrl: string | null = `/contacts/?locationId=${COMPANY_ID.company_id}`; // URL inicial para paginación
  let startAfter: string | null = null; // Marcador para continuar la paginación
  let startAfterId: string | null = null; // ID adicional para la paginación

  try {
    while (nextPageUrl) {
      const currentUrl: string = nextPageUrl;

      const response = await request.get(currentUrl);
      const { contacts, meta } = response.data; // ← ✅ Usa la propiedad correcta

      if (Array.isArray(contacts) && contacts.length > 0) {
        allContacts.push(...contacts); // Agrega los contactos actuales al acumulador
      }

      // Construye la siguiente URL si hay paginación disponible
      startAfter = meta?.startAfter ? `&startAfter=${meta.startAfter}` : null;
      startAfterId = meta?.startAfterId ? `&startAfterId=${meta.startAfterId}` : null;

      nextPageUrl =
        startAfter && startAfterId
          ? `/contacts/?locationId=${COMPANY_ID.company_id}${startAfter}${startAfterId}`
          : null;
    }


    return allContacts; // Devuelve todos los contactos recolectados
  } catch (error: any) {
    console.error(
      'Error getting all contacts (paginated - robust):',
      error.response?.data || error.message, // Muestra error detallado
    );
    throw error; // Relanza el error
  }
}

  async getContactByIdExample(): Promise<any> {
    const request = this.tokenGhlService.requests(LOCATION_ID.location_id);
    try {
      const response = await request.get(
        `/contacts/?locationId=${COMPANY_ID.company_id}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting contact:', error.response?.data);
      throw error;
    }
  }

  async crearConversacion (messageData: any): Promise<any>{
    const request = this.tokenGhlService.requests(LOCATION_ID.location_id);
    try {
      const response = await request.post('/conversations/messages', messageData);

      const message = new SmsLogEntry({
        type: messageData.type,
        contactId: messageData.contactId,
        conversationProviderId: messageData.conversationProviderId,
        toNumber: messageData.toNumber,
        message: messageData.message,
        responseConversationId: response.data.conversationId,
        responseMessageId: response.data.messageId,
        responseTraceId: response.data.traceId,
        timestamp: new Date()
      });

      await this.smslogRepository.save(message);

      return response.data;
    } catch (error: any) {
      console.error('Error creating conversation:', error.response?.data);
      throw error;
    }
  }


  async getConversationById(conversationId: string): Promise<any> {
    console.log('conversationId', conversationId);
    const request = this.tokenGhlService.requests(LOCATION_ID.location_id);
    try {
      const response = await request.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting conversation:', error.response?.data);
      throw error;
    }
  }



  // Otros métodos como updateContact, searchContacts, etc.
}
