import ApplicationSerializer from 'ghost-admin/serializers/application';
import classic from 'ember-classic-decorator';
import {EmbeddedRecordsMixin} from '@ember-data/serializer/rest';
import {pluralize} from 'ember-inflector';

@classic
export default class UserSerializer extends ApplicationSerializer.extend(EmbeddedRecordsMixin) {
    attrs = {
        roles: {embedded: 'always'},
        lastLoginUTC: {key: 'last_seen'},
        createdAtUTC: {key: 'created_at'},
        updatedAtUTC: {key: 'updated_at'}
    };

    extractSingle(store, primaryType, payload) {
        let root = this.keyForAttribute(primaryType.modelName);
        let pluralizedRoot = pluralize(primaryType.modelName);

        payload[root] = payload[pluralizedRoot][0];
        delete payload[pluralizedRoot];

        return super.extractSingle(...arguments);
    }
}
