import { inject } from '@loopback/core';
import { post, requestBody, get, param } from '@loopback/rest';
import { ContactService } from '../services/contact.service'; // Asegúrate de que la ruta sea correcta

export class ContactController {
  constructor(
    @inject('services.ContactService')
    public contactService: ContactService,
  ) {}

  @post('/contacts')
  async create(@requestBody() contactData: any): Promise<any> {

    return this.contactService.createContact(contactData);
  }

  @get('/get-all-contacts/')
  async getById(): Promise<any> {
    return this.contactService.getContactById();
  }


  @post('/create-conversation')
  async createConversation(@requestBody() conversationData: any): Promise<any> {
    return this.contactService.crearConversacion(conversationData);
  }

  @get('/chat-mensajes/{chatId}')
  async getMensajes(  @param.path.string('chatId') chatId: string): Promise<any> {
    return this.contactService.getConversationById(chatId);
  }











}
