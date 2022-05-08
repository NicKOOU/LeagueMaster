using System;

using System.Net.Http;


namespace HackOfLegend
{
    class Program
    {
        static void Main(string[] args)
        {
            var lcu = new Lcu("C:\\Riot Games\\League of Legends\\lockfile");
            Console.WriteLine(lcu);
            Console.WriteLine(lcu.get("/lol-summoner/v1/current-summoner"));

        }
    }
}
