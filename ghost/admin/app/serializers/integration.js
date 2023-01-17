import ApplicationSerializer from './application';
import classic from 'ember-classic-decorator';
import {EmbeddedRecordsMixin} from '@ember-data/serializer/rest';

@classic
export default class IntegrationSerializer extends ApplicationSerializer.extend(EmbeddedRecordsMixin) {
    attrs = {
        apiKeys: {embedded: 'always'},
        webhooks: {embedded: 'always'},
        createdAtUTC: {key: 'created_at'},
        updatedAtUTC: {key: 'updated_at'}
    };
}
