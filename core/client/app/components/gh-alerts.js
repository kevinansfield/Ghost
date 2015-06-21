import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'aside',
    classNames: 'gh-alerts',

    notifications: Ember.inject.service(),

    // FIXME: notifications/alerts should be filtered in the notifications service
    messages: Ember.computed.filter('notifications.content', function (notification) {
        var displayStatus = (typeof notification.toJSON === 'function') ?
            notification.get('status') : notification.status;

        return displayStatus === 'alert';
    }),

    messageCountObserver: Ember.observer('messages.[]', function () {
        this.sendAction('notify', this.get('messages').length);
    })
});
