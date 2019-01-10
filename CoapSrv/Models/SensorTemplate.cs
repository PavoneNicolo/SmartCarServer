using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoapSrv.Models
{
    class SensorTemplate
    {
        public string measurement { get; set; }
        public List<Field> fields { get; set; }
        public long timestamp { get; set; }
    }
}
