
using System;
using System.Text.Json;

using System.Net.Http;
using System.Collections.Generic;

namespace HackOfLegend
{
    class Program
    {
        private static HttpClient client = new HttpClient();

        struct champ_select
        {
            public long? gameId { get; set; }
            public int? httpStatus { get; set; }
            public struct my_team
            {
                public string assignedPosition { get; set; }
            }
            public List<my_team> myTeam { get; set; }
        }
        struct champ_info
        {
            public int? champion_id { get; set; }
        }


        static champ_select wait_for_champ_select(Lcu lcu)
        {
            champ_select select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
            string test = lcu.get("/lol-champ-select/v1/session");
            while (select.gameId == null)
            {
                Console.WriteLine("Waiting for champ select...");
                System.Threading.Thread.Sleep(1000);
                select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
            }
            return select;
        }

        static void select_champ(Lcu lcu, string assignedPosition)
        {

            String champ = lcu.get("/lol-champ-select/v1/current-champion");
            while (champ == "0")
            {
                Console.WriteLine("Waiting for a champion...");
                System.Threading.Thread.Sleep(1000);
                champ = lcu.get("/lol-champ-select/v1/current-champion");
            }
            if(champ[0] == '{')
                return;         
            if(assignedPosition == "")
                assignedPosition = "SUPPORT";
            Console.WriteLine("Champion selected!");
            Console.WriteLine(champ);
            Rune rune = JsonSerializer.Deserialize<Rune>(lcu.get("/lol-perks/v1/currentpage"));
            rune.name = "PJD " + champ;
            Database_Rune database_rune = JsonSerializer.Deserialize<List<Database_Rune>>(client.GetAsync($"/runes/{champ}/{assignedPosition}").Result.Content.ReadAsStringAsync().Result)[0];
            rune.primaryStyleId = database_rune.primarystyleid;
            rune.subStyleId = database_rune.substyleid;
            rune.selectedPerkIds = new List<int>{database_rune.primary1, database_rune.primary2, database_rune.primary3, database_rune.primary4, database_rune.sub1, database_rune.sub2, database_rune.shard1, database_rune.shard2, database_rune.shard3};
            Console.WriteLine(database_rune);   
            lcu.put("/lol-perks/v1/pages/" + rune.id.ToString(), rune.ToString());    
            Console.WriteLine(rune);
        }

        static void logic(Lcu lcu)
        {
            while(true)
            {
                var champ_select = wait_for_champ_select(lcu);
                select_champ(lcu, champ_select.myTeam[0].assignedPosition);
            }
        }


        static void Main(string[] args)
        {
            client.BaseAddress = new Uri("http://127.0.0.1:8080");
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            wait_for_champ_select(lcu);
            logic(lcu);
            String champ = lcu.get("/lol-champ-select/v1/current-champion");
            champ_select.my_team myTeam = JsonSerializer.Deserialize<champ_select.my_team>(lcu.get("/lol-champ-select/v1/session"));
            Console.WriteLine(myTeam.assignedPosition);
        }
    }
}
