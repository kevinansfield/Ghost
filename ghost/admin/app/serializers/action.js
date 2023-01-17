import ApplicationSerializer from 'ghost-admin/serializers/application';
import classic from 'ember-classic-decorator';

@classic
export default class ActionSerializer extends ApplicationSerializer {
    attrs = {
        createdAtUTC: {key: 'created_at'}
    };
}
