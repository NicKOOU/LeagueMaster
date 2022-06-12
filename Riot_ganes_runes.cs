using System;
using System.Collections.Generic;
using System.Text.Json;
namespace HackOfLegend
{
    public class riotgames_api_response
    {
        public struct Info
        {
            public string gameMode { get; set; }
            public struct participant
            {
                public int kills { get; set; }
                public int deaths { get; set; }
                public int assists { get; set; }
                public int championId { get; set; }
                public string individualPosition { get; set; }
                public bool win { get; set; }
                public struct Perks
                {
                    public  List<Style> styles { get; set; }
                    public struct Style
                    {
                        public List<perkids> selections { get; set; }
                        public int style { get; set; }
                        public struct perkids
                        {
                            public int perk { get; set; }
                        }
                    }
                }
                public Perks perks { get; set; }
            }
                
            public List<participant> participants { get; set; }

        }
        public Info info { get; set; }
    }
}