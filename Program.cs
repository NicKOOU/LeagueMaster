
using System;
using System.Text.Json;

using System.Net.Http;
using System.Collections.Generic;
using System.Threading;

namespace HackOfLegend
{
    class Program
    {
        static Random random = new Random();
        static Stack<Rune> Lastrunes = null;
        private static HttpClient client = new HttpClient();
        private static HttpClient client2 = new HttpClient();
        private static HttpClient client3 = new HttpClient();

        struct champ_select
        {
            public long? gameId { get; set; }
            public int? httpStatus { get; set; }
            public struct my_team
            {
                public string assignedPosition { get; set; }
                public int championId { get; set; }

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

        static void select_champ(Lcu lcu, string previous_champ = "0")
        {
            String champ = wait_something<String>(() => (lcu.get("/lol-champ-select/v1/current-champion")), (str) => str != previous_champ, 1000);
            if (champ[0] == '{')
                return;
            champ_select current_select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
            string assignedPosition = current_select.myTeam.Find(x => x.championId == int.Parse(champ)).assignedPosition;
            if (assignedPosition == "")
                assignedPosition = "ARAM";
            Console.WriteLine($"Champion selected! {champ}");
            Lastrunes = new Stack<Rune>();
            setRune(lcu, champ, assignedPosition);
            select_champ(lcu, champ);
        }

        static Database_Rune addshardstojson(string json)
        {
            var random = new Random();
            var list1 = new List<int>() { 5008, 5005, 5007 };
            int shard1 = list1[random.Next(list1.Count)];
            var list2 = new List<int>() { 5008, 5002, 5003 };
            int shard2 = list2[random.Next(list2.Count)];
            var list3 = new List<int>() { 5001, 5002, 5003 };
            int shard3 = list3[random.Next(list3.Count)];
            Database_Rune database_rune = JsonSerializer.Deserialize<List<Database_Rune>>(json)[0];
            database_rune.shard1 = shard1;
            database_rune.shard2 = shard2;
            database_rune.shard3 = shard3;
            return database_rune;
        }

        static void setRune(Lcu lcu, string champ_id, string assignedPosition)
        {
            Rune rune = Rune.getCurrentRune(lcu);
            Lastrunes.Push(rune);
            rune.name = "PJD " + champ_id;
            //var database_request = client.GetAsync($"/runes/{champ_id}/{assignedPosition}").Result.Content.ReadAsStringAsync().Result;
            var database_request = client2.GetAsync("rest/v1/runes?select=*&champion_id=eq." + champ_id + "&lane=eq." + assignedPosition + "&order=count.desc,winrate.desc").Result.Content.ReadAsStringAsync().Result;
            if (database_request == "[]")
                rune.name = "Never gonna give you up";
            else
            {
                Console.WriteLine(database_request);
                Database_Rune database_rune = addshardstojson(database_request);
                rune.primaryStyleId = database_rune.primarystyleid;
                rune.subStyleId = database_rune.substyleid;
                rune.selectedPerkIds = new List<int> { database_rune.primary1, database_rune.primary2, database_rune.primary3, database_rune.primary4, database_rune.sub1, database_rune.sub2, database_rune.shard1, database_rune.shard2, database_rune.shard3 };
                Console.WriteLine(database_rune);
                Console.WriteLine("winrate = " + database_rune.winrate);
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

        static string assignlane(string lane, string mode)
        {
            if (lane == "Invalid")
                return mode;
            switch (lane)
            {
                case "TOP":
                    return "top";
                case "JUNGLE":
                    return "jungle";
                case "MIDDLE":
                    return "middle";
                case "BOTTOM":
                    return "bottom";
                case "UTILITY":
                    return "utility";
                default:
                    return "";
            }
        }
        static List<Database_Rune> steal_rune_from_game(Lcu lcu, long gameid)
        {
            Game_stats game_stats = wait_something<Game_stats>(() => JsonSerializer.Deserialize<Game_stats>(lcu.get($"/lol-match-history/v1/games/{gameid}")), (stat) => stat.gameId != null, 1000);
            var result = new List<Database_Rune>();
            foreach (var participant in game_stats.participants)
            {
                if (participant.stats.kills + participant.stats.assists >= 2 * participant.stats.deaths)
                {
                    string lane = participant.timeline.lane;
                    Database_Rune rune = new Database_Rune { champion_id = participant.championId, lane = assignlane(participant.timeline.lane, participant.timeline.role), primarystyleid = participant.stats.perkPrimaryStyle, primary1 = participant.stats.perk0, primary2 = participant.stats.perk1, primary3 = participant.stats.perk2, primary4 = participant.stats.perk3, substyleid = participant.stats.perkSubStyle, sub1 = participant.stats.perk4, sub2 = participant.stats.perk5 };
                    if (game_stats.gameMode == "ARAM")
                        rune.lane = "ARAM";
                    if (game_stats.gameMode == "URF")
                        rune.lane = "ARAM";
                    if (participant.stats.win == true)
                        rune.win = 1;
                    else
                        rune.win = 0;
                    Console.WriteLine(rune.champion_id + rune.win);
                    result.Add(rune);
                }
            }
            return result;
        }

        public struct gameId
        {
            public long? gameid { get; set; }
        }

        static void addorupdaterune(Database_Rune db)
        {
            string data = client2.GetAsync("rest/v1/runes?select=*&champion_id=eq." + db.champion_id + "&lane=eq." + db.lane + "&primarystyleid=eq." + db.primarystyleid + "&primary1=eq." + db.primary1 + "&primary2=eq." + db.primary2 + "&primary3=eq." + db.primary3 + "&primary4=eq." + db.primary4 + "&substyleid=eq." + db.substyleid + "&sub1=eq." + db.sub1 + "&sub2=eq." + db.sub2).Result.Content.ReadAsStringAsync().Result;
            List<Database_Rune> database_runes = JsonSerializer.Deserialize<List<Database_Rune>>(data);
            if (database_runes.Count == 0)
            {
                client2.PostAsync("rest/v1/runes", new StringContent(JsonSerializer.Serialize(db), System.Text.Encoding.UTF8, "application/json"));
            }
            else
            {
                if (db.win == 1)
                {
                    float winrate = (float)(database_runes[0].win + 1) / (float)(database_runes[0].count + 1);
                    client2.PatchAsync("rest/v1/runes?select=*&champion_id=eq." + db.champion_id + "&lane=eq." + db.lane + "&primarystyleid=eq." + db.primarystyleid + "&primary1=eq." + db.primary1 + "&primary2=eq." + db.primary2 + "&primary3=eq." + db.primary3 + "&primary4=eq." + db.primary4 + "&substyleid=eq." + db.substyleid + "&sub1=eq." + db.sub1 + "&sub2=eq." + db.sub2, new StringContent(JsonSerializer.Serialize(new { winrate = winrate, count = database_runes[0].count + 1, win = database_runes[0].win + 1}), System.Text.Encoding.UTF8, "application/json"));
                }
                else
                {
                     float winrate = (float)(database_runes[0].win) / (float)(database_runes[0].count + 1);
                     client2.PatchAsync("rest/v1/runes?select=*&champion_id=eq." + db.champion_id + "&lane=eq." + db.lane + "&primarystyleid=eq." + db.primarystyleid + "&primary1=eq." + db.primary1 + "&primary2=eq." + db.primary2 + "&primary3=eq." + db.primary3 + "&primary4=eq." + db.primary4 + "&substyleid=eq." + db.substyleid + "&sub1=eq." + db.sub1 + "&sub2=eq." + db.sub2, new StringContent(JsonSerializer.Serialize(new { winrate = winrate, count = database_runes[0].count + 1, win = database_runes[0].win}), System.Text.Encoding.UTF8, "application/json"));
                }
            }
        }
        static void makerunefromgameid()
        {
            Console.WriteLine("Enter gameid");
            string gameids = client2.GetAsync("rest/v1/games?select=*").Result.Content.ReadAsStringAsync().Result;
            List<gameId> gameidlist = JsonSerializer.Deserialize<List<gameId>>(gameids);
            foreach (gameId game in gameidlist)
            {
                List<Database_Rune> runes = new List<Database_Rune>();
                string matchid = "EUW1_" + game.gameid;
                string game_stats = client3.GetAsync("lol/match/v5/matches/" + matchid).Result.Content.ReadAsStringAsync().Result;
                if(game_stats.Contains("Data not found"))
                {
                    continue;
                }
                riotgames_api_response riotgames_api_response = JsonSerializer.Deserialize<riotgames_api_response>(game_stats);
                riotgames_api_response.info.participants.ForEach(participant =>
                {
                    if (participant.assists + participant.kills >= 2 * participant.deaths)
                    {
                        int won = 0;
                        string lane = assignlane(participant.individualPosition, "ARAM");
                        if (participant.perks.styles[0].style != 0)
                        {
                            won = 1;
                        }
                        else
                        {
                            won = 0;
                        }

                        Database_Rune rune = new Database_Rune { champion_id = participant.championId, lane = lane, primarystyleid = participant.perks.styles[0].style, primary1 = participant.perks.styles[0].selections[0].perk, primary2 = participant.perks.styles[0].selections[1].perk, primary3 = participant.perks.styles[0].selections[2].perk, primary4 = participant.perks.styles[0].selections[3].perk, substyleid = participant.perks.styles[1].style, sub1 = participant.perks.styles[1].selections[0].perk, sub2 = participant.perks.styles[1].selections[1].perk, win = won };
                        runes.Add(rune);
                    }
                });
                runes.ForEach(rune =>
                {
                    addorupdaterune(rune);
                });
                client2.DeleteAsync("rest/v1/games?select=*&gameid=eq." + game.gameid);


            }
        }

        static void send_gameid(long gameid)
        {
            //client.PostAsync("/runes/gameid", new StringContent("{\"gameid\":" + gameid + "}", System.Text.Encoding.UTF8, "application/json"));
            client2.PostAsync("rest/v1/games", new StringContent("{\"gameid\":" + gameid + "}", System.Text.Encoding.UTF8, "application/json"));
            Console.WriteLine("Gameid sent");
        }

        static void scriptrune(long gameid)
        {
            while (true)
            {
                send_gameid(gameid);
                gameid++;
            }

        }

        static Func<Lcu, champ_select> wait_for_champ_select = (Lcu lcu) => wait_something<champ_select>(() => JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session")), (select) => select.gameId != null, 1000);
        static Func<Lcu, gameflow> Check_End_Game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/session")), (gameflow) => gameflow.phase != "InProgress", 5000);
        static Func<Lcu, gameflow> wait_end_game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/session")), (gameflow) => gameflow.phase != "ChampSelect", 1000);
        static Func<Lcu, String> get_champ = (Lcu lcu) => wait_something<String>(() => (lcu.get("/lol-champ-select/v1/current-champion")), (str) => str != "0", 1000);
        static void logic(Lcu lcu, State state)
        {
            List<long> gameids = new List<long>();
            while (true)
            {
                state = State.Idle;
                var champ_select = wait_for_champ_select(lcu);
                Console.WriteLine("Champ select detected");
                select_champ(lcu);
                Console.WriteLine("Champ selected");
                state = State.ChampSelect;
                gameflow gameflow = get_gameflow(lcu);
                if (gameflow.phase == "InProgress")
                {
                    state = State.InGame;
                    Check_End_Game(lcu);
                    send_gameid(gameflow.gameData.gameId);
                    /*Thread t = new Thread(new ThreadStart(makerunefromgameid));
                    t.Start();*/
                    //Envoyer la GameID à l'API
                }
            }
        }

        static void Main(string[] args)
        {
            client.BaseAddress = new Uri("http://127.0.0.1:8080");
            client.DefaultRequestHeaders.Add("ContentType", "application/json");
            client2.BaseAddress = new Uri("https://yshzrbmwnmyhhbldbvqg.supabase.co");
            string apikey = config.apikey;
            client2.DefaultRequestHeaders.Add("apikey", apikey);
            client2.DefaultRequestHeaders.Add("Authorization", "Bearer " + apikey);
            client3.BaseAddress = new Uri("https://europe.api.riotgames.com");
            client3.DefaultRequestHeaders.Add("X-Riot-Token", config.riotapikey);
            State gamestate = State.Idle;
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            wait_for_champ_select(lcu);
            logic(lcu, gamestate);
        }
    }
}