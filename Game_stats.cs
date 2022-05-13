using System.Collections.Generic;
using System.Text.Json;

namespace HackOfLegend
{
    public struct Game_stats
    {
        public string gameMode { get; set; }
        public long? gameId {get; set;}
        public struct Participant
        {
            public int championId { get; set; }
            public struct Stats
            {
                public int perk0 { get; set; }
                public int perk1 { get; set; }
                public int perk2 { get; set; }
                public int perk3 { get; set; }
                public int perk4 { get; set; }
                public int perk5 { get; set; }
                public int perkPrimaryStyle { get; set; }
                public int perkSubStyle { get; set; }
                public int deaths { get; set; }
                public int kills { get; set; }
                public int assists { get; set; }
            }
            public struct Timeline
            {
                public string lane { get; set; }
                public string role { get; set; }
            }

            public Timeline timeline {get; set;}
            public Stats stats {get; set;}
        }                                                           
         public List<Participant> participants {get; set;}

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}