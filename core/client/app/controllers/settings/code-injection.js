import Ember from 'ember';

export default Ember.Controller.extend({
    notifications: Ember.inject.service(),

    actions: {
        save: function () {
            var notifications = this.get('notifications');

            return this.get('model').save().then(function (model) {
                notifications.closeNotifications();
                notifications.showNotification('Settings successfully saved.');

                return model;
            }).catch(function (errors) {
                notifications.closeNotifications();
                notifications.showErrors(errors);
            });
        }
    }
});
