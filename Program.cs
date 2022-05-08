
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
            if(assignedPosition == "")
                assignedPosition = "MID";
            client.GetAsync($"/runes/{champ}/{assignedPosition}").Result.Content.ReadAsStringAsync();
            Console.WriteLine("Champion selected!");
            Console.WriteLine(champ);

        }

        static void logic(Lcu lcu)
        {
            var champ_select = wait_for_champ_select(lcu);
            select_champ(lcu, champ_select.myTeam[0].assignedPosition);
        }


        static void Main(string[] args)
        {
            client.BaseAddress = new Uri("http://127.0.0.1:8080");
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            wait_for_champ_select(lcu);
            logic(lcu);
            string json = lcu.get("/lol-perks/v1/currentpage");
            Rune rune = JsonSerializer.Deserialize<Rune>(json);
            rune.name = "salut c pas moi";
            lcu.put("/lol-perks/v1/pages/" + rune.id.ToString(), rune.ToString());
            Console.WriteLine(rune);
            String champ = lcu.get("/lol-champ-select/v1/current-champion");
            champ_select.my_team myTeam = JsonSerializer.Deserialize<champ_select.my_team>(lcu.get("/lol-champ-select/v1/session"));
            Console.WriteLine(myTeam.assignedPosition);
        }
    }
}
