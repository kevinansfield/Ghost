import AjaxServiceSupport from 'ember-ajax/mixins/ajax-support';
import RESTAdapter from '@ember-data/adapter/rest';
import classic from 'ember-classic-decorator';
import ghostPaths from 'ghost-admin/utils/ghost-paths';
import {inject as service} from '@ember/service';
import {underscore} from '@ember/string';

@classic
export default class BaseAdapter extends RESTAdapter.extend(AjaxServiceSupport) {
    host = window.location.origin;
    namespace = ghostPaths().apiRoot.slice(1);

    @service session;

    shouldBackgroundReloadRecord() {
        return false;
    }

    query(store, type, query) {
        let id;

        if (query.id) {
            id = query.id;
            delete query.id;
        }

        return this.ajax(this.buildURL(type.modelName, id), 'GET', {data: query});
    }

    pathForType() {
        const type = super.pathForType(...arguments);
        return underscore(type);
    }

    buildURL() {
        // Ensure trailing slashes
        let url = super.buildURL(...arguments);
        let parsedUrl = new URL(url);

        if (!parsedUrl.pathname.endsWith('/')) {
            parsedUrl.pathname += '/';
        }

        return parsedUrl.toString();
    }
}
