using System;
using System.Text.Json;

using System.Net.Http;
using System.Collections.Generic;

namespace HackOfLegend
{
    class Program
    {
        struct champ_select
        {
            public long? gameId {get; set;}
            public int? httpStatus {get; set;}
            public struct my_team
            {
                public string assignedPosition {get; set;}
            }
            public List<my_team> myTeam {get; set;}
        }
        struct champ_info
        {
            public int? champion_id {get; set;}
        }


        static void wait_for_champ_select(Lcu lcu)
        {
            champ_select select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
            string test = lcu.get("/lol-champ-select/v1/session");
            while (select.gameId == null)
            {
                Console.WriteLine("Waiting for champ select...");
                System.Threading.Thread.Sleep(1000);
                select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
            }

        }

        static void select_champ(Lcu lcu)
        {

            String champ = lcu.get("/lol-champ-select/v1/current-champion");
            while (champ == "0")
            {
                Console.WriteLine("Waiting for a champion...");
                System.Threading.Thread.Sleep(2000);
                champ = lcu.get("/lol-champ-select/v1/current-champion");
            }
            Console.WriteLine("Champion selected!");
            Console.WriteLine(champ);
        }


        static void Main(string[] args)
        {
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            Console.WriteLine(lcu.get("/lol-perks/v1/currentpage"));
            wait_for_champ_select(lcu);
            string json = lcu.get("/lol-perks/v1/currentpage");
            Rune rune = JsonSerializer.Deserialize<Rune>(json);
            rune.name = "salut c pas moi";
            lcu.put("/lol-perks/v1/pages/" + rune.id.ToString(), rune.ToString());
            Console.WriteLine(rune);
            select_champ(lcu);
            String champ = lcu.get("/lol-champ-select/v1/current-champion");
            champ_select.my_team myTeam = JsonSerializer.Deserialize<champ_select.my_team>(lcu.get("/lol-champ-select/v1/session"));
            Console.WriteLine(myTeam.assignedPosition);
        }
    }
}
