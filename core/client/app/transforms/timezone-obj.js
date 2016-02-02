/* global moment */
import Transform from 'ember-data/transform';

export default Transform.extend({
    deserialize(serialized) {
        if (serialized) {
            // Convert the string to an array, so we can work with
            // the timezone offset, which is stored in [1]

            serialized = serialized.split(',');
            serialized[1] = parseInt(serialized[1]);
            return serialized;
        }
        return serialized;
    },

    serialize(deserialized) {
        if (deserialized) {
            // Convert the array to a string, to store it
            // like this in the settings

            return deserialized.join(',');
        }
        return deserialized;
    }
});
