import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {InstallationDetails, InstallationDetailsRelations} from '../models';

export class TokenRepositoryRepository extends DefaultCrudRepository<
  InstallationDetails,
  typeof InstallationDetails.prototype.access_token,
  InstallationDetailsRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(InstallationDetails, dataSource);
  }
}
