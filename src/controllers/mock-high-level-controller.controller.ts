import {get, post, requestBody, param} from '@loopback/rest'; // Importa tu modelo de Contact
import {GhlService} from '../services/ghl.service';
import {IContact} from 'gohighlevel/dist/interfaces/contact';

export class MockHighLevelController {
  private ghlService: GhlService; // Usa el nombre correcto de tu servicio

  constructor() {
    this.ghlService = new GhlService();
  }
  //Webhook tunnel de datos de ghl
  @get('/webhook')
  async pingWebhook(): Promise<object> {
    return {message: 'GET /webhook activo. Todo OK!'};
  }

  @post('/contacts')
  async createNewContact(
    @requestBody() contactData: IContact,
    @param.query.string('accessToken') accessToken: string,
    @param.query.string('locationId') locationId?: string,
  ): Promise<IContact> {
    const locId = locationId ?? 'your-default-location-id';
    const createdContact = await this.ghlService.createContact(
      accessToken,
      contactData,
      locId,
    );
    return createdContact;
  }

  @get('/contacts/{id}')
  async getContactById(
    @param.path.string('id') id: string,
    @param.query.string('accessToken') accessToken: string,
  ): Promise<IContact> {
    const contact = await this.ghlService.getContactById(accessToken, id);
    return contact;
  }

  @get('/testAuth')
  async testAuth(): Promise<string> {
    const authUrl = this.ghlService.getAuthorizationUrl();
    return authUrl;
  }
}
