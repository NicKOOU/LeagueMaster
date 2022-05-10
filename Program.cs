
using System;
using System.Text.Json;

using System.Net.Http;
using System.Collections.Generic;

namespace HackOfLegend
{
    class Program
    {
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
                public long? gameId { get; set; }
            }
            public List<gamedata> gameData { get; set; }
            public string? phase { get; set; }
        }

        // static champ_select wait_for_champ_select(Lcu lcu)
        // {
        //     champ_select select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
        //     string test = lcu.get("/lol-champ-select/v1/session");
        //     Console.WriteLine(lcu.get("/lol-gameflow/v1/session"));
        //     while (select.gameId == null)
        //     {
        //         Console.WriteLine("Waiting for champ select...");
        //         System.Threading.Thread.Sleep(1000);
        //         select = JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session"));
        //     }
        //     return select;
        // }

        static void select_champ(Lcu lcu, string assignedPosition)
        {

            // String champ = lcu.get("/lol-champ-select/v1/current-champion");
            // for (; champ == "0"; champ = lcu.get("/lol-champ-select/v1/current-champion"))
            // {
            //     Console.WriteLine("Waiting for a champion...");
            //     System.Threading.Thread.Sleep(1000);
            // }
            String champ = get_champ(lcu);
            if (champ[0] == '{')
                return;
            if (assignedPosition == "")
                assignedPosition = "SUPPORT";
            Console.WriteLine($"Champion selected! {champ}");
            Lastrunes = new Stack<Rune>();
            setRune(lcu, champ, assignedPosition);
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
                Database_Rune database_rune = JsonSerializer.Deserialize<List<Database_Rune>>(database_request)[0];
                rune.primaryStyleId = database_rune.primarystyleid;
                rune.subStyleId = database_rune.substyleid;
                rune.selectedPerkIds = new List<int> { database_rune.primary1, database_rune.primary2, database_rune.primary3, database_rune.primary4, database_rune.sub1, database_rune.sub2, database_rune.shard1, database_rune.shard2, database_rune.shard3 };
                Console.WriteLine(database_rune);
            }
            lcu.put("/lol-perks/v1/pages/" + rune.id.ToString(), rune.ToString());
            Console.WriteLine(rune);
        }
        static gameflow get_gameflow(Lcu lcu)
        {
            // gameflow gameflow = JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow"));
            // while(gameflow.phase == "ChampSelect")
            // {
            //     Console.WriteLine("Waiting for game to start...");
            //     System.Threading.Thread.Sleep(1000);
            //     gameflow = JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow"));
            // }
            gameflow gameflow = wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow")), (gameflow) =>  gameflow.phase != "ChampSelect", 1000);
            // gameflow gameflow = wait_end_game(lcu);
            if(gameflow.phase == "InProgress")
            {
                Console.WriteLine("Game started!");
                return gameflow;
            }
            Console.WriteLine("Dogde Detected");
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

        static Func<Lcu, champ_select> wait_for_champ_select = (Lcu lcu) => wait_something<champ_select>(() => JsonSerializer.Deserialize<champ_select>(lcu.get("/lol-champ-select/v1/session")), (select) => select.gameId != null, 1000);
        static Func<Lcu, gameflow> Check_End_Game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow")), (gameflow) => gameflow.phase != "InProgress", 5000);
        static Func<Lcu, gameflow> wait_end_game = (Lcu lcu) => wait_something<gameflow>(() => JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow")), (gameflow) => gameflow.phase == "ChampSelect", 1000);
        static Func<Lcu, String> get_champ = (Lcu lcu) => wait_something<String>(() => (lcu.get("/lol-gameflow/v1/gameflow")), (str) => str != "0", 1000);






        //check toutes les 5 secondes si la game est fine.
        
        // static void Check_End_Game(Lcu lcu)
        // {
        //     gameflow gameflow = JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow"));
        //     while(gameflow.phase == "InProgress")
        //     {
        //         Console.WriteLine("In Game");
        //         System.Threading.Thread.Sleep(5000);
        //         gameflow = JsonSerializer.Deserialize<gameflow>(lcu.get("/lol-gameflow/v1/gameflow"));
        //     }
        // }
        
        static void logic(Lcu lcu, State state)
        {
            while (true)
            {
                state=State.Idle;
                var champ_select = wait_for_champ_select(lcu);                    
                select_champ(lcu, champ_select.myTeam[0].assignedPosition);
                state = State.ChampSelect;
                gameflow gameflow=get_gameflow(lcu);
                if (gameflow.phase=="InProgress"){
                    state=State.InGame;
                    Check_End_Game(lcu);
                    //Envoyer la GameID à l'API
                }                 
            }
        }
        static void Main(string[] args)
        {
            State gamestate = State.Idle;
            client.BaseAddress = new Uri("http://127.0.0.1:8080");
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            wait_for_champ_select(lcu);
            logic(lcu,gamestate);
        }
    }
}
