import { inject } from '@loopback/core';
import { get, param, post, requestBody } from '@loopback/rest';
import { TokenGhlService } from '../services/tokenGhl.service';

export class TokenController {
  constructor(
    @inject('services.TokenGhlService')
    public tokenGhlService: TokenGhlService,
  ) {}

  @get('/authorize-handler')
  async authorizeHandler(@param.query.string('code') code?: string): Promise<void> {
    if (code) {
      await this.tokenGhlService.authorizationHandler(code);
    } else {
      console.warn('No code provided in the authorize-handler request.');
      // Puedes devolver un error o redirigir de otra manera si es necesario
    }
    // En una aplicación real, podrías redirigir al frontend o a una página de éxito
    // res.redirect('https://app.gohighlevel.com/'); // Esto no es directamente posible en un controlador de LoopBack
    console.log('Authorization handled. Consider redirecting the user from the frontend.');
  }

  @get('/example-api-call')
  async exampleApiCall(
    @param.query.string('companyId') companyId?: string,
  ): Promise<object | string> {
    if (companyId) {
      const exists = await this.tokenGhlService.checkInstallationExists(companyId);
      if (exists) {
        try {
          const request = await this.tokenGhlService.requests(companyId).get(`/users/search?companyId=${companyId}`, {
            headers: {
              Version: '2021-07-28',
            },
          });
          return request.data;
        } catch (error) {
          console.error('Error en example-api-call:', error);
          return { error: 'Failed to fetch users' };
        }
      } else {
        return 'Installation for this company does not exist';
      }
    } else {
      return 'Please provide companyId as a query parameter.';
    }
  }

  @get('/example-api-call-location')
  async exampleApiCallLocation(
    @param.query.string('locationId') locationId: string,
    @param.query.string('companyId') companyId?: string,
  ): Promise<object | string> {
    try {
      const exists = await this.tokenGhlService.checkInstallationExists(locationId);
      if (exists) {
        const request = await this.tokenGhlService.requests(locationId).get(`/contacts/?locationId=${locationId}`, {
          headers: {
            Version: '2021-07-28',
          },
        });
        return request.data;
      } else if (companyId) {
        await this.tokenGhlService.getLocationTokenFromCompanyToken(companyId, locationId);
        const request = await this.tokenGhlService.requests(locationId).get(`/contacts/?locationId=${locationId}`, {
          headers: {
            Version: '2021-07-28',
          },
        });
        return request.data;
      } else {
        return 'Installation for this location does not exist. Please provide companyId to attempt token retrieval.';
      }
    } catch (error) {
      console.error('Error en example-api-call-location:', error);
      return { error: 'Failed to fetch contacts' };
    }
  }

  @post('/decrypt-sso')
  async decryptSso(@requestBody() body: { key?: string }): Promise<unknown | string> {
    const { key } = body || {};
    if (!key) {
      return 'Please send a valid key in the request body.';
    }
    try {
      const data = this.tokenGhlService.decryptSSOData(key);
      return data;
    } catch (error) {
      console.error('Error decrypting SSO data:', error);
      return 'Invalid Key';
    }
  }

  // La ruta '/' que sirve el frontend estático generalmente se configura en la aplicación
  // como middleware y no directamente en un controlador de API.
}
