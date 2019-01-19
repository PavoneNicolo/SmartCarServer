module.exports = {
    //TODO get tags missing
    _getFields: function (data) {
        let result = "";
        let fieldsLength = data.fields.length;

        //cycle all fields and format correctly
        for (let i = 0; i < fieldsLength; i++) {
            let value = '"' + data.fields[i].fldName + '":' + data.fields[i].value;
            result = result + value + ",";
        }

        result = result.substring(0, result.length - 1);

        return JSON.parse('{' + result + '}');
    },
    writeInflux: function (db, data) {
        let influxFields = this._getFields(data);
        let measurement = data.vinNumber;
        let timestamp = data.Timestamp;

        db.writePoints([
            {
                measurement: measurement,
                fields: influxFields,
                timestamp: timestamp
            }
        ])
    }
};