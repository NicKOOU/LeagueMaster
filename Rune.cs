using System;
using System.Collections.Generic;
using System.Text.Json;
namespace HackOfLegend
{
    class Rune
    {
        public List<string> autoModifiedSelections {get; set;}
        public bool current {get; set;}
        public int id {get; set;}
        public bool isActive {get; set;}
        public bool isDeletable {get; set;}
        public bool isEditable {get; set;}
        public bool isValid {get; set;}
        public long lastModified {get; set;}
        public string name {get; set;}
        public int order {get; set;}
        public int primaryStyleId {get; set;}
        public List<int> selectedPerkIds {get; set;}
        public int subStyleId {get; set;}

        public override string ToString()
        {
            return JsonSerializer.Serialize<Rune>(this);
        }

        public static Rune getCurrentRune(Lcu lcu)
        {
            return JsonSerializer.Deserialize<Rune>(lcu.get("/lol-perks/v1/currentpage"));
        }
    }
}