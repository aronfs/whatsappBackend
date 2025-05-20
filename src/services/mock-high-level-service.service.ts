import axios from 'axios';
import {HIGHLEVEL_MOCK_CONFIG} from '../config';
//const { snakeCaseKeys } = require('change-case-object');

export class MockHighLevelService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;
private async refreshAccessToken() {
  const url = `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/oauth/token`;

  const payload = {
    grantType: 'refresh_token',
    refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYXNzSWQiOiJmWmt1emRVWkdjOHpPWTFZT3IwaiIsInNvdXJjZSI6IklOVEVHUkFUSU9OIiwic291cmNlSWQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEtbWFvbXp5d3IiLCJjaGFubmVsIjoiT0FVVEgiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJmWmt1emRVWkdjOHpPWTFZT3IwaiIsIm9hdXRoTWV0YSI6eyJzY29wZXMiOlsiY29udmVyc2F0aW9ucy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb250YWN0cy5yZWFkb25seSIsImNvbnRhY3RzLndyaXRlIiwibG9jYXRpb25zLnJlYWRvbmx5Iiwib2F1dGgud3JpdGUiLCJvYXV0aC5yZWFkb25seSJdLCJjbGllbnQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEiLCJ2ZXJzaW9uSWQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEiLCJjbGllbnRLZXkiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEtbWFvbXp5d3IifSwiaWF0IjoxNzQ3MzYxNDMxLjgyLCJleHAiOjE3Nzg4OTc0MzEuODIsInVuaXF1ZUlkIjoiYTAyZDgzZTUtMjg4Mi00M2M4LTk0MjctODY3OGZmZTYyZjg0IiwidiI6IjIifQ.atJNxoOKenn9a9a_BhTXa_MY_C0e4CKDUl3UJi-riSFtI5jdxLkKhGFRIiw9hzc6ZlUxhuRAHps4E2E6jnp0TuJX2PTPxAWLFLL_BijvNWmPizb5D9iK37X3OVfmYYmZyX44w_NMlPUoplqua5BCyK2x-nWDEyFWapBjFsvGZC-s6ryGkySrsm-TnGswglyw8ALibujMcA9IbTBRp1SwzR2onRPzeXoJL-t9zU8LF1uGH8RSaNijTIkml5G-arjdkf2xctw7e1ZqmFTC6WOaWuo4FHv3JJWBmiUF1ULHfBuLclbIJ7c0zHaMJJARYA69wFxxE4kDCzvfZyqqrNwsPacvgh3XHbiPrRLCQKYw7UnIObafK01XyO_YRc_h5wEfM2MwF3VDHBLwP2B2bqAyyxEEp1tKOywuu3JAu31tEkDLO5nTT5jkKM11pJ9NHLJI-KGmJHmshaLdx2oMykkh8X03o4FbdJn5Ba9sDvoWtjiUezJyvl5NzyRXbdIiOvPufcPv52eqlryVw8NTbj1d75XjZa9d7BqEOPtNYAodpV5rRKrCwIzMIx90fVQlC2NXMfMtM97XbYnFJX7vsdxQoBUQJgu3ZZMxQyKIQFTpnHymaVJaLhp8zRE0owHH3gwe7UsmGtmUgQtxcJtyfgfhZzfze21X73zR6bKP0eL_qGA',
    clientId: 'tu_client_id',
    clientSecret: 'tu_client_secret',
  };


  const headers = { 'Content-Type': 'application/json' };
  const response = await axios.post(url, payload, { headers });

  this.accessToken = response.data.access_token;
  this.refreshToken = response.data.refresh_token; // actualiza siempre
  this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000;

  return this.accessToken;
}

public async getAccessToken() {
  // Si no tienes refreshToken, error o pedir que se loguee de otra forma
  if (!this.refreshToken) throw new Error('No refresh token available');

  const now = Date.now();

  // Si token expiró, refrescar con refresh_token
  if (!this.accessToken || now >= this.tokenExpiresAt) {
    return this.refreshAccessToken();
  }

  return this.accessToken;
}


  public async getMockToken() {
   const url = `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/oauth/token`;

  const payload = {
    grant_Type: 'refresh_token',
    refresh_Token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYXNzSWQiOiJmWmt1emRVWkdjOHpPWTFZT3IwaiIsInNvdXJjZSI6IklOVEVHUkFUSU9OIiwic291cmNlSWQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEtbWFvbXp5d3IiLCJjaGFubmVsIjoiT0FVVEgiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJmWmt1emRVWkdjOHpPWTFZT3IwaiIsIm9hdXRoTWV0YSI6eyJzY29wZXMiOlsiY29udmVyc2F0aW9ucy5yZWFkb25seSIsImNvbnZlcnNhdGlvbnMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb250YWN0cy5yZWFkb25seSIsImNvbnRhY3RzLndyaXRlIiwibG9jYXRpb25zLnJlYWRvbmx5Iiwib2F1dGgud3JpdGUiLCJvYXV0aC5yZWFkb25seSJdLCJjbGllbnQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEiLCJ2ZXJzaW9uSWQiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEiLCJjbGllbnRLZXkiOiI2ODI1MzQ5NDE0ODJmMjJmYmQ4NjU2ZjEtbWFvbXp5d3IifSwiaWF0IjoxNzQ3MzYxNDMxLjgyLCJleHAiOjE3Nzg4OTc0MzEuODIsInVuaXF1ZUlkIjoiYTAyZDgzZTUtMjg4Mi00M2M4LTk0MjctODY3OGZmZTYyZjg0IiwidiI6IjIifQ.atJNxoOKenn9a9a_BhTXa_MY_C0e4CKDUl3UJi-riSFtI5jdxLkKhGFRIiw9hzc6ZlUxhuRAHps4E2E6jnp0TuJX2PTPxAWLFLL_BijvNWmPizb5D9iK37X3OVfmYYmZyX44w_NMlPUoplqua5BCyK2x-nWDEyFWapBjFsvGZC-s6ryGkySrsm-TnGswglyw8ALibujMcA9IbTBRp1SwzR2onRPzeXoJL-t9zU8LF1uGH8RSaNijTIkml5G-arjdkf2xctw7e1ZqmFTC6WOaWuo4FHv3JJWBmiUF1ULHfBuLclbIJ7c0zHaMJJARYA69wFxxE4kDCzvfZyqqrNwsPacvgh3XHbiPrRLCQKYw7UnIObafK01XyO_YRc_h5wEfM2MwF3VDHBLwP2B2bqAyyxEEp1tKOywuu3JAu31tEkDLO5nTT5jkKM11pJ9NHLJI-KGmJHmshaLdx2oMykkh8X03o4FbdJn5Ba9sDvoWtjiUezJyvl5NzyRXbdIiOvPufcPv52eqlryVw8NTbj1d75XjZa9d7BqEOPtNYAodpV5rRKrCwIzMIx90fVQlC2NXMfMtM97XbYnFJX7vsdxQoBUQJgu3ZZMxQyKIQFTpnHymaVJaLhp8zRE0owHH3gwe7UsmGtmUgQtxcJtyfgfhZzfze21X73zR6bKP0eL_qGA',
    client_Id: 'tu_client_id',
    client_Secret: 'tu_client_secret',
  };


  const headers = { 'Content-Type': 'application/json' };
  const response = await axios.post(url, payload, { headers });

  this.accessToken = response.data.access_token;
  this.refreshToken = response.data.refresh_token; // actualiza siempre
  this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000;

  return this.accessToken;
  }



  public async getMockContacts() {
  const token = await this.getAccessToken();

  const url = `${HIGHLEVEL_MOCK_CONFIG.baseUrl}/contacts`;
  const headers = { Authorization: `Bearer ${token}` };

  return axios.get(url, { headers });
}
}
