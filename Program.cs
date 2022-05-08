using System;
using System.Text.Json;

using System.Net.Http;

namespace HackOfLegend
{
    class Program
    {
        struct champ_select
        {
            public int? gameId {get; set;}
            public int? httpStatus {get; set;}
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
        }
    }
}
