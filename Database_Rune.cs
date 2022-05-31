using System;
using System.Collections.Generic;
using System.Text.Json;
namespace HackOfLegend
{
    class Database_Rune
    {
        public int champion_id { get; set; }
        public string lane { get; set; }
        public int primarystyleid { get; set; }
        public int primary1 { get; set; }
        public int primary2 { get; set; }
        public int primary3 { get; set; }
        public int primary4 { get; set; }
        public int substyleid { get; set; }
        public int sub1 { get; set; }
        public int sub2 { get; set; }
        public int shard1 { get; set; }
        public int shard2 { get; set; }
        public int shard3 { get; set; }
        public int win { get; set; }
        public float winrate { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Database_Rune>(this);
        }
    }
}