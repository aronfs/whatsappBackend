import { inject, injectable } from '@loopback/core';
import { TokenRepositoryRepository } from '../repositories/token-repository.repository';
import { InstallationDetails, TokenType } from '../models';
import axios, { InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import * as CryptoJS from 'crypto-js';
import {CLIENT_ID,CLIENT_ID_SECRET, HIGHLEVEL_MOCK_CONFIG, SECRET_KEY } from '../config';

@injectable()
export class TokenGhlService {
  constructor(
    @inject('repositories.TokenRepositoryRepository')
    public tokenRepository: TokenRepositoryRepository,
  ) {}

  async authorizationHandler(code: string): Promise<void> {
    if (!code) {
      console.warn('Please provide code when making call to authorization Handler');
      return;
    }

     await this.generateAccessTokenRefreshTokenPair(code);

  }

  decryptSSOData(key: string): unknown {
    const data = CryptoJS.AES.decrypt(key, SECRET_KEY.secret_key as string).toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  }

  requests(resourceId: string) {
    const baseUrl = HIGHLEVEL_MOCK_CONFIG.baseUrl;

    const instance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${this.getAccessToken(resourceId)}`, // Get token dynamically
        Version: '2021-07-28', // Default version
      },
    });

    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken = await this.getAccessToken(resourceId);
        if (accessToken) {
          config.headers['Authorization'] = `${TokenType.Bearer} ${accessToken}`;
        } else {
          throw new Error('Access token not found for the resource.');
        }
        return config;
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken(resourceId);
            originalRequest.headers['Authorization'] = `Bearer ${await this.getAccessToken(resourceId)}`;
            return await axios(originalRequest);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  async checkInstallationExists(resourceId: string): Promise<boolean> {
    const token = await this.getAccessToken(resourceId);
    return !!token;
  }

  async getLocationTokenFromCompanyToken(companyId: string, locationId: string): Promise<void> {
    const requests = this.requests(companyId);
    const res = await requests.post(
      '/oauth/locationToken',
      {
        companyId,
        locationId,
      },
      {
        headers: {
          Version: '2021-07-28',
        },
      },
    );
    const installationDetails = new InstallationDetails({
      access_token: res.data.access_token,
      token_type: TokenType.Bearer, // Ensure this matches your enum value
      expires_in: res.data.expires_in,
      refresh_token: res.data.refresh_token,
      scope: res.data.scope,
      userType: res.data.userType,
      companyId: res.data.companyId,
      locationId: res.data.locationId,
    });
    await this.tokenRepository.save(installationDetails);
  }

  private async refreshAccessToken(resourceId: string): Promise<void> {
    const refreshToken = await this.getRefreshToken(resourceId);
    if (!refreshToken) {
      throw new Error('Refresh token is missing.');
    }
    try {
      const resp = await axios.post(
        `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/oauth/token`,
        qs.stringify({
          client_id:  CLIENT_ID.client_id,
          client_secret: CLIENT_ID_SECRET.client_id_secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
      );
      await this.setAccessToken(resourceId, resp.data.access_token);
      await this.setRefreshToken(resourceId, resp.data.refresh_token);
    } catch (error: unknown) {
      const err = error as any;
      console.error('Error refreshing access token:', err?.response?.data);
      throw error;
    }
  }

  private async generateAccessTokenRefreshTokenPair(code: string): Promise<void> {
    try {
        // Paso 1: Obtener el access_token y refresh_token iniciales
        const initialResponse = await axios.post(
            `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/oauth/token`,
            qs.stringify({
                client_id: CLIENT_ID.client_id,
                client_secret: CLIENT_ID_SECRET.client_id_secret,
                grant_type: 'authorization_code',
                code,
            }),
            { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
        );

        const initialInstallationDetails = new InstallationDetails({
            access_token: initialResponse.data.access_token,
            token_type: TokenType.Bearer,
            expires_in: initialResponse.data.expires_in,
            refresh_token: initialResponse.data.refresh_token,
            scope: initialResponse.data.scope,
            userType: initialResponse.data.userType,
            companyId: initialResponse.data.companyId,
            locationId: initialResponse.data.locationId,
        });
        await this.tokenRepository.save(initialInstallationDetails);
        console.log('Initial Installation Details:', initialInstallationDetails);
        // Paso 2: Obtener el location token inmediatamente después
        if (initialInstallationDetails.companyId ) {
            try {
                const locationTokenResponse = await axios.post(
                    `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/oauth/locationToken`,
                    {
                        companyId: initialInstallationDetails.companyId,
                        //Dato quemado de compañia para pruebas
                        locationId: "9HgfWSXtcKPPUULVpJC9"
                    },
                    {
                        headers: {
                            Version: '2021-07-28',
                            Authorization: `Bearer ${initialResponse.data.access_token}`, // Include the access_token here
                        },
                    },
                );

                // Crear o actualizar la InstallationDetails con el nuevo access_token (location-specific)
                const finalInstallationDetails = {
                    ...initialInstallationDetails, // Mantener los otros datos
                    access_token: locationTokenResponse.data.access_token,
                    locationId: "9HgfWSXtcKPPUULVpJC9"
                    // Podrías actualizar otros campos si la respuesta lo incluye
                };

                await this.tokenRepository.updateAll(
                    finalInstallationDetails,
                    {
                        or: [
                            { locationId: finalInstallationDetails.locationId },
                            { companyId: finalInstallationDetails.companyId },
                        ],
                    },
                );
                console.log('Final Installation Details:', finalInstallationDetails);
                console.log('Successfully obtained and updated location token.');

            } catch (locationTokenError: any) {
                console.error('Error generating location token:', locationTokenError?.response?.data);
                // Consider cómo quieres manejar este error. ¿Debería fallar la instalación completa?
                // Por ahora, lo logueo y continúo con el token inicial.
            }
        } else {
            console.warn('Company ID or Location ID missing, cannot fetch location token.');
        }

    } catch (error: any) {
        console.error('Error generating initial token pair:', error?.response?.data);
        throw error;
    }
}
  // Métodos existentes para interactuar con el repositorio
  async saveToken(installationDetails: InstallationDetails): Promise<InstallationDetails> {
    return this.tokenRepository.create(installationDetails);
  }

  async getTokenByResourceId(resourceId: string): Promise<InstallationDetails | undefined> {
    const result = await this.tokenRepository.findOne({
      where: {
        or: [
          { locationId: resourceId },
          { companyId: resourceId },
        ],
      },
    });
    return result ?? undefined;
  }

  async getAccessToken(resourceId: string): Promise<string | undefined> {
    const installation = await this.getTokenByResourceId(resourceId);
    return installation?.access_token;
  }

  async setAccessToken(resourceId: string, token: string): Promise<void> {
    await this.tokenRepository.updateAll(
      { access_token: token },
      {
        or: [
          { locationId: resourceId },
          { companyId: resourceId },
        ],
      },
    );
  }

  async getRefreshToken(resourceId: string): Promise<string | undefined> {
    const installation = await this.getTokenByResourceId(resourceId);
    return installation?.refresh_token;
  }

  async setRefreshToken(resourceId: string, token: string): Promise<void> {
    await this.tokenRepository.updateAll(
      { refresh_token: token },
      {
        or: [
          { locationId: resourceId },
          { companyId: resourceId },
        ],
      },
    );
  }


  
}
