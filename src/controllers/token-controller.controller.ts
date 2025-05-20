// src/controllers/token.controller.ts

import {get} from '@loopback/rest';
import {inject} from '@loopback/core';
import * as fs from 'fs';
import {TokenRefreshService} from '../tokenghl';

export class TokenControllerController {
  constructor(
    @inject('services.TokenRefreshService')
    private tokenService: TokenRefreshService,
  ) {}

  @get('/token', {
    responses: {
      '200': {
        description: 'Devuelve el token actual',
        content: {
          'application/json': {
            schema: {type: 'object'},
          },
        },
      },
    },
  })
  async getToken(): Promise<object> {
    const path = './tokens.json';
    if (!fs.existsSync(path)) {
      return {error: 'No token file found'};
    }

    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
  }
}
