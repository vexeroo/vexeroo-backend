/* eslint-disable @typescript-eslint/naming-convention */
// https://auth0.github.io/node-auth0/
import { Identity, ManagementClient, User as Auth0User } from 'auth0';
import axios, { AxiosError } from 'axios';
import Boom from 'boom';

import { LoginRequest, RegisterUserRequest } from '$/common/dto';
import { log } from '$/common/logger';

type Auth0Options = {
  audience: string;
  clientId: string;
  clientSecret: string;
  domain: string;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export class Auth0Client {
  private static instance: Auth0Client;
  private managementClient: ManagementClient;

  private auth0Options: Auth0Options;

  constructor() {
    this.auth0Options = {
      audience: `https://${process.env.AUTH0_DOMAIN!}/api/v2/`,
      clientId: process.env.AUTH0_M2M_CLIENT_ID!,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!,
      domain: process.env.AUTH0_DOMAIN!,
    };
    this.managementClient = this.createManagementClient(this.auth0Options);
  }

  static getInstance(): Auth0Client {
    if (!Auth0Client.instance) {
      Auth0Client.instance = new Auth0Client();
    }
    return Auth0Client.instance;
  }

  /**
   * Creates a new management client instance.
   *
   * https://auth0.com/docs/secure/tokens/access-tokens/management-api-access-tokens
   */
  private createManagementClient(options: Auth0Options): ManagementClient {
    return new ManagementClient({
      ...options,
      scope: 'read:users create:users',
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10,
      },
    });
  }

  /**
   * Gets a user in Auth0 using the provided email address.
   *
   * @returns The {@link Auth0Id} of the user if found.
   */
  async getUserByEmail(email: Email): Promise<Auth0Id | null> {
    const users = await this.getUsersByEmail(email);
    if (users.length > 0) {
      return users[0].user_id! as Auth0Id;
    }
    return null;
  }

  /**
   * Gets a list of users in Auth0 using the provided email address.
   *
   * @returns The list of users
   */
  async getUsersByEmail(email: Email): Promise<Auth0User[]> {
    return this.managementClient.getUsersByEmail(email);
  }

  /**
   * Link user accounts together to form a primary and secondary relationship. On successful
   * linking, the endpoint returns the new array of the primary account identities.
   *
   * Auth0 supports the linking of user accounts from various identity providers. This allows a
   * user to authenticate from any of their accounts and still be recognized by your app and
   * associated with the same user profile.
   *
   * @param auth0Id The {@link Auth0Id} of the user.
   * @param targetUserIdentities A list of target user identities.
   */
  async linkAccounts(auth0Id: Auth0Id, targetUserIdentities: Identity[]): Promise<void> {
    for (const identity of targetUserIdentities) {
      await this.managementClient.linkUsers(auth0Id, {
        user_id: identity.user_id,
        provider: identity.provider,
      });
    }
  }

  /**
   * Creates a new user in Auth0.
   *
   * https://auth0.com/docs/api/management/v2/#!/Users/post_users
   *
   * @returns The {@link Auth0Id} of the created user.
   */
  async register(dto: RegisterUserRequest): Promise<Auth0Id> {
    const user = await this.managementClient.createUser({
      connection: 'terraform-veritas-db',
      email: dto.email,
      username: undefined,
      email_verified: false,
      verify_email: false,
      user_id: undefined,
      blocked: false,
      nickname: undefined,
      picture: undefined,
      password: dto.password,
      phone_number: undefined,
      given_name: undefined,
      family_name: undefined,
      name: dto.name,
      user_metadata: {},
      app_metadata: {},
    });
    return user.user_id! as Auth0Id;
  }

  /**
   * Get an access token from Auth0 with an email and password combination.
   *
   * https://auth0.com/docs/api/authentication#resource-owner-password
   *
   * @returns an access token
   */
  async signIn(dto: LoginRequest, ipAddress: string): Promise<string> {
    try {
      const response: { data: TokenResponse } = await axios.post(
        `https://${this.auth0Options.domain}/oauth/token`,
        {
          username: dto.email,
          password: dto.password,
          grant_type: 'password',
          audience: this.auth0Options.audience,
          client_id: this.auth0Options.clientId,
          client_secret: this.auth0Options.clientSecret,
        },
        {
          headers: {
            'auth0-forwarded-for': ipAddress,
          },
        },
      );
      if (response.data.access_token) {
        return response.data.access_token;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.isAxiosError) {
        // This could contain sensitive information and should
        // be changed to avoid exposing such information.
        log(axiosError.toJSON());
        log(axiosError.response?.data);
      }
    }
    // Throw a 404 to avoid user enumeration attacks.
    throw Boom.notFound('Invalid email address or password provided.');
  }
}
