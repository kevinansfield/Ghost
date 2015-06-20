import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'aside',
    classNames: 'gh-alerts',

    notifications: Ember.inject.service(),

    messages: Ember.computed.filter('notifications.content', function (notification) {
        var displayStatus = (typeof notification.toJSON === 'function') ?
            notification.get('status') : notification.status;

        return displayStatus === 'persistent';
    }),

    messageCountObserver: Ember.observer('messages.[]', function () {
        this.sendAction('notify', this.get('messages').length);
    })
});
