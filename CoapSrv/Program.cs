using CoAP.Server;
using CoapSrv.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoapSrv
{
    class Program
    {
        static void Main(string[] args)
        {
            var server = new CoapServer();
            server.Add(new SensorResource());
            server.Start();
            Console.ReadKey();
        }
    }
}
