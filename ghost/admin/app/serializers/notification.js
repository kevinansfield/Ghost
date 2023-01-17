import ApplicationSerializer from 'ghost-admin/serializers/application';
import classic from 'ember-classic-decorator';

@classic
export default class NotificationSerializer extends ApplicationSerializer {
    attrs = {
        key: {key: 'location'}
    };
}
