import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {SmsLogEntry, SmsLogEntryRelations} from '../models';

export class SmslogRepository extends DefaultCrudRepository<
  SmsLogEntry,
  typeof SmsLogEntry.prototype.id,
  SmsLogEntryRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(SmsLogEntry, dataSource);
  }
}
