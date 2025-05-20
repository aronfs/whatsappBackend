import { Gohighlevel } from 'gohighlevel';
import { config } from 'dotenv';
import { HttpErrors } from '@loopback/rest';
import {CLIENT_ID,CLIENT_ID_SECRET, REDIRECT_URI } from '../config'; // Importa HttpErrors de LoopBack 4
import {IContact} from 'gohighlevel/dist/interfaces/contact';


config(); // Carga las variables de entorno desde .env

export class GhlService {
  private readonly client: Gohighlevel;
  private readonly clientId: string | undefined = CLIENT_ID.client_id;
  private readonly clientSecret: string | undefined = CLIENT_ID_SECRET.client_id_secret;
  private readonly redirectUri: string | undefined =REDIRECT_URI.redirect_uri;
 // private readonly apiKey: string | undefined = process.env.GOHIGHLEVEL_API_KEY; // Para uso directo si es necesario

  constructor() {
    // Inicialización de la biblioteca gohighlevel
    if (this.clientId && this.clientSecret && this.redirectUri) {
      this.client = new Gohighlevel({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        redirectUri: this.redirectUri,
        isWhiteLabel: true, // Asegúrate de tener esto configurado correctamente
        scopes: ["contacts.readonly", "contacts.write", "locations.readonly"] // Define tus scopes
      });
    } else {
      throw new Error("Debes proporcionar CLIENT_ID, CLIENT_SECRET y REDIRECT_URI para OAuth2, o GOHIGHLEVEL_API_KEY para autenticación directa.");
    }
  }

  // Función para generar la URL de autorización (OAuth2)
  getAuthorizationUrl(): string {
    if (this.clientId && this.clientSecret && this.redirectUri) {
        return this.client.oauth.getOAuthURL();
    }
    else{
      throw new Error("Faltan credenciales para Oauth2");
    }
  }

  // Función para intercambiar el código de autorización por tokens (OAuth2)
  async exchangeCodeForToken(code: string, refreshToken?: string): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
    if (this.clientId && this.clientSecret && this.redirectUri) {
        try {
      const authInfo = await this.client.oauth.getCallbackAuthTokens({
        code: code,
        refresh_token: refreshToken ?? "", // Pasa el refresh_token si está disponible, usa cadena vacía si es undefined
      });
      return {
        accessToken: authInfo.access_token,
        refreshToken: authInfo.refresh_token,
        expiresIn: authInfo.expires_in
      };
    } catch (error) {
      console.error("Error al intercambiar el código por tokens:", error);
      throw new HttpErrors.InternalServerError("No se pudo obtener el token de acceso"); // Lanza un error de LoopBack
    }
    }
     else{
       throw new Error("Faltan credenciales para Oauth2");
     }
  }

  // Función para obtener contactos (ejemplo de uso de la API)
async getContacts(accessToken: string, search?: string) {
    try {
      this.client.setAuth({ access_token: accessToken });
      let contacts;
      if (search) {
        contacts = await this.client.contacts.search(search);
      } else {
        // Necesitas proporcionar un locationId para obtener los contactos con el método 'get'
        // Asegúrate de tener el locationId del usuario o de tu aplicación.
        // Reemplaza 'your-location-id' con el valor real.
        const locationId = 'your-location-id';
        contacts = await this.client.contacts.get(locationId, {});
      }
      return contacts;
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      throw new HttpErrors.InternalServerError("Error al obtener contactos de GoHighLevel");
    }
  }

  // Función para crear un contacto
  async createContact(accessToken: string, contact: IContact, locationId?: string) {
    try {
      this.client.setAuth({ access_token: accessToken });
      const l = locationId ?? 'your-default-location-id'; // Proporciona un valor por defecto si no se da
      const response = await this.client.contacts.create(contact, l);
      return response;
    } catch (error) {
      console.error("Error al crear contacto:", error);
      throw new HttpErrors.InternalServerError("Error al crear contacto en GoHighLevel");
    }
  }

  // Función para obtener un contacto por ID
  async getContactById(accessToken: string, contactId: string) {
    try {
      this.client.setAuth({ access_token: accessToken });
      const contact = await this.client.contacts.getOne(contactId);
      return contact;
    } catch (error) {
      console.error("Error al obtener contacto por ID:", error);
      throw new HttpErrors.InternalServerError("Error al obtener contacto por ID en GoHighLevel");
    }
  }
}
