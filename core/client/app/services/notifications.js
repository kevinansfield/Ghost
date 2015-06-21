import Ember from 'ember';
import Notification from 'ghost/models/notification';

export default Ember.Service.extend({
    delayedNotifications: Ember.A(),
    content: Ember.A(),
    timeout: 3000,

    alerts: Ember.computed.filter('content', function (notification) {
        var status = (typeof notification.toJSON === 'function') ?
            notification.get('status') : notification.status;

        return status === 'alert';
    }),

    notifications: Ember.computed.filter('content', function (notification) {
        var status = (typeof notification.toJSON === 'function') ?
            notification.get('status') : notification.status;

        return status === 'notification';
    }),

    handleNotification: function (message, delayed) {
        if (typeof message.toJSON === 'function') {
            // If this is an alert message from the server, treat it as html safe
            if (message.get('status') === 'alert') {
                message.set('message', message.get('message').htmlSafe());
            }

            if (!message.get('status')) {
                message.set('status', 'notification');
            }
        } else {
            if (!message.status) {
                message.status = 'notification';
            }
        }

        if (!delayed) {
            this.get('content').pushObject(message);
        } else {
            this.delayedNotifications.pushObject(message);
        }
    },

    showError: function (message, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        this.handleNotification({
            type: 'error',
            message: message
        }, options.delayed);
    },

    showErrors: function (errors, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        for (var i = 0; i < errors.length; i += 1) {
            this.showError(errors[i].message || errors[i], {doNotCloseNotifications: true});
        }
    },

    showAPIError: function (resp, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        options.defaultErrorText = options.defaultErrorText || 'There was a problem on the server, please try again.';

        if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.error) {
            this.showError(resp.jqXHR.responseJSON.error, options);
        } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.errors) {
            this.showErrors(resp.jqXHR.responseJSON.errors, options);
        } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.message) {
            this.showError(resp.jqXHR.responseJSON.message, options);
        } else {
            this.showError(options.defaultErrorText, {doNotCloseNotifications: true});
        }
    },

    showInfo: function (message, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        this.handleNotification({
            type: 'info',
            message: message
        }, options.delayed);
    },

    showSuccess: function (message, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        this.handleNotification({
            type: 'success',
            message: message
        }, options.delayed);
    },

    showWarn: function (message, options) {
        options = options || {};

        if (!options.doNotCloseNotifications) {
            this.closeNotifications();
        }

        this.handleNotification({
            type: 'warn',
            message: message
        }, options.delayed);
    },

    displayDelayed: function () {
        var self = this;

        self.delayedNotifications.forEach(function (message) {
            self.get('content').pushObject(message);
        });
        self.delayedNotifications = [];
    },

    closeNotification: function (notification) {
        var content = this.get('content');

        if (notification instanceof Notification) {
            notification.deleteRecord();
            notification.save().finally(function () {
                content.removeObject(notification);
            });
        } else {
            content.removeObject(notification);
        }
    },

    closeNotifications: function () {
        this.set('content', this.get('content').rejectBy('status', 'notification'));
    },

    closeAll: function () {
        this.get('content').clear();
    }
});
