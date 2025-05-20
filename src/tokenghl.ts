// src/services/token-refresh.service.ts

import {injectable, BindingScope} from '@loopback/core';
import axios from 'axios';
import * as fs from 'fs';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  [key: string]: unknown;
}

@injectable({scope: BindingScope.SINGLETON})
export class TokenRefreshService {
  private readonly clientId = '682534941482f22fbd8656f1-maomzywr';
  private readonly clientSecret = 'e067bd3e-ae8c-4e89-b367-9d126643b20f';
  private readonly tokenUrl = 'https://services.leadconnectorhq.com/oauth/token';
  private readonly tokenStoragePath = './tokens.json';

  constructor() {
    this.startRefreshLoop();
  }

  async refreshAccessToken(): Promise<void> {
    const stored = this.loadTokens();
    if (!stored?.refresh_token) {
      console.error('No refresh token found.');
      return;
    }

    try {
      const response = await axios.post<TokenResponse>(
        this.tokenUrl,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: stored.refresh_token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      );

      this.saveTokens(response.data);
      console.log('Token actualizado correctamente:', response.data);
    } catch (error) {
      console.error('Error actualizando el token:', error.response?.data || error.message);
    }
  }

  private saveTokens(tokens: TokenResponse): void {
    fs.writeFileSync(this.tokenStoragePath, JSON.stringify(tokens, null, 2));
  }

  private loadTokens(): TokenResponse | null {
    if (fs.existsSync(this.tokenStoragePath)) {
      const data = fs.readFileSync(this.tokenStoragePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  }

  private startRefreshLoop(): void {
    const eightHoursMs = 8 * 60 * 60 * 1000;

    setInterval(() => {
      // eslint-disable-next-line no-void
      void this.refreshAccessToken();
    }, eightHoursMs);

    // Llamada inicial
    // eslint-disable-next-line no-void
    void this.refreshAccessToken();
  }
}
