using CoAP.Server.Resources;
using CoapSrv.Models;
using InfluxDB.LineProtocol.Client;
using InfluxDB.LineProtocol.Payload;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoapSrv.Resources
{
    class SensorResource: Resource
    {
        public SensorResource() : base("sensor")
        {
            
        }

        async protected override void DoPost(CoapExchange exchange)
        {
            var body = JsonConvert.DeserializeObject<SensorTemplate>(exchange.Request.PayloadString);

            DateTime timestamp = new DateTime(1970, 1, 1).AddMilliseconds(body.timestamp);

            var sensorData = new LineProtocolPoint(
                body.measurement,
                new Dictionary<string, object> //fields
                {
                    { "temperature", body.fields[0].temperature },
                    { "speed", body.fields[1].speed },
                    { "lat", body.fields[2].lat },
                    { "lon", body.fields[3].lon }
                },
                new Dictionary<string, string>{}, //tags
                DateTime.UtcNow); //timestamp

            var payload = new LineProtocolPayload();
            payload.Add(sensorData);

            var client = new LineProtocolClient(new Uri("http://localhost:8086"), "cars_data");
            var influxResult = await client.WriteAsync(payload);
            if (!influxResult.Success)
            {
                Console.Error.WriteLine(influxResult.ErrorMessage);
                exchange.Respond(CoAP.StatusCode.BadRequest);
            }
            else
            {
                exchange.Respond(CoAP.StatusCode.Created);
            }
            
        }
    }
}
