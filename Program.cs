
using System;
using System.Text.Json;

using System.Net.Http;
using System.Collections.Generic;

namespace HackOfLegend
{
    class Program
    {
        static Random random = new Random();
        static Stack<Rune> Lastrunes = null;
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
        struct eog_stats
        {
            public long? gameId { get; set; }
            public override string ToString()
            {
                return JsonSerializer.Serialize(this);
            }
        }
        struct gameflow
        {
            public struct gamedata
            {
                public long gameId { get; set; }
            }
            public gamedata gameData { get; set; }
            public string phase { get; set; }
        }

        static void select_champ(Lcu lcu, string assignedPosition, string previous_champ = "0")
        {
            String champ = wait_something<String>(() => (lcu.get("/lol-champ-select/v1/current-champion")), (str) => str != previous_champ, 1000);
            if (champ[0] == '{')
                return;
            if (assignedPosition == "")
                assignedPosition = "ARAM";
            Console.WriteLine($"Champion selected! {champ}");
            Lastrunes = new Stack<Rune>();
            setRune(lcu, champ, assignedPosition);
            select_champ(lcu, assignedPosition, champ);
        }

        static void setRune(Lcu lcu, string champ_id, string assignedPosition)
        {
            Rune rune = Rune.getCurrentRune(lcu);
            Lastrunes.Push(rune);
            rune.name = "PJD " + champ_id;
            var database_request = client.GetAsync($"/runes/{champ_id}/{assignedPosition}").Result.Content.ReadAsStringAsync().Result;
            if (database_request == "[]")
                rune.name = "Never gonna give you up";
            else
            {
                Console.WriteLine(database_request);
                Database_Rune database_rune = JsonSerializer.Deserialize<List<Database_Rune>>(database_request)[0];
                rune.primaryStyleId = database_rune.primarystyleid;
                rune.subStyleId = database_rune.substyleid;
                rune.selectedPerkIds = new List<int> { database_rune.primary1, database_rune.primary2, database_rune.primary3, database_rune.primary4, database_rune.sub1, database_rune.sub2, database_rune.shard1, database_rune.shard2, database_rune.shard3 };
                Console.WriteLine(database_rune);
            }
            lcu.delete("/lol-perks/v1/pages");
            lcu.post("/lol-perks/v1/pages/", rune.ToString());
            Console.WriteLine(rune);
        }
        static gameflow get_gameflow(Lcu lcu)
        {
            gameflow gameflow = wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/session")), (gameflow) => gameflow.phase != "ChampSelect", 1000);
            if (gameflow.phase == "InProgress")
            {
                Console.WriteLine("Game started!");
                return gameflow;
            }
            Console.WriteLine("Dodge Detected");
            return gameflow;
        }

        static T wait_something<T>(Func<T> provider, Func<T, bool> condition, int delay)
        {
            T val = provider();
            while (!condition(val))
            {
                System.Threading.Thread.Sleep(delay);
                val = provider();
            }
            return val;
        }
        static List<Database_Rune> steal_rune_from_game(Lcu lcu, long gameid)
        {
            Game_stats game_stats = wait_something<Game_stats>(() => JsonSerializer.Deserialize<Game_stats>(lcu.get($"/lol-match-history/v1/games/{gameid}")), (stat) => stat.gameId != null, 1000);
            var result = new List<Database_Rune>();
            foreach (var participant in game_stats.participants)
            {
                if (participant.stats.kills > participant.stats.deaths)
                {
                    Database_Rune rune = new Database_Rune { champion_id = participant.championId, lane = participant.timeline.role, primarystyleid = participant.stats.perkPrimaryStyle, primary1 = participant.stats.perk0, primary2 = participant.stats.perk1, primary3 = participant.stats.perk2, primary4 = participant.stats.perk3, substyleid = participant.stats.perkSubStyle, sub1 = participant.stats.perk4, sub2 = participant.stats.perk5 };
                    if (game_stats.gameMode == "ARAM")
                        rune.lane = "ARAM";
                    if (game_stats.gameMode == "URF")
                        rune.lane = "ARAM";
                    result.Add(rune);
                }
            }
            return result;
        }

        static void sendrune(Database_Rune rune)
        {
            List<int> shard1 = new List<int>() { 5008, 5005, 5007 };
            List<int> shard2 = new List<int>() { 5008, 5002, 5003 };
            List<int> shard3 = new List<int>() { 5001, 5002, 5003 };
            rune.shard1 = shard1[random.Next(shard1.Count)];
            rune.shard2 = shard2[random.Next(shard2.Count)];
            rune.shard3 = shard3[random.Next(shard3.Count)];

            // rune.shard1 = 
            client.PostAsync("/runes", new StringContent(rune.ToString(), System.Text.Encoding.UTF8, "application/json"));
        }

        static Func<Lcu, champ_select> wait_for_champ_select = (Lcu lcu) => wait_something<champ_select>(() => JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session")), (select) => select.gameId != null, 1000);
        static Func<Lcu, gameflow> Check_End_Game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/session")), (gameflow) => gameflow.phase != "InProgress", 5000);
        static Func<Lcu, gameflow> wait_end_game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/session")), (gameflow) => gameflow.phase != "ChampSelect", 1000);
        static Func<Lcu, String> get_champ = (Lcu lcu) => wait_something<String>(() => (lcu.get("/lol-champ-select/v1/current-champion")), (str) => str != "0", 1000);
        static void logic(Lcu lcu, State state)
        {
            while (true)
            {
                state = State.Idle;
                var champ_select = wait_for_champ_select(lcu);
                Console.WriteLine("Champ select detected");
                select_champ(lcu, champ_select.myTeam[0].assignedPosition);
                Console.WriteLine("Champ selected");
                state = State.ChampSelect;
                gameflow gameflow = get_gameflow(lcu);
                if (gameflow.phase == "InProgress")
                {
                    state = State.InGame;
                    Check_End_Game(lcu);
                    steal_rune_from_game(lcu, gameflow.gameData.gameId).ForEach(sendrune);

                    //Envoyer la GameID à l'API
                }
            }
        }
        static void Main(string[] args)
        {
            State gamestate = State.Idle;
            client.BaseAddress = new Uri("http://127.0.0.1:8080");
            client.DefaultRequestHeaders.Add("ContentType", "application/json");
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            wait_for_champ_select(lcu);
            logic(lcu, gamestate);
        }
    }
}