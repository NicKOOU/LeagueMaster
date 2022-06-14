using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading;

namespace HackOfLegend
{
    class Lcu
    {

        private string pid;
        private string port;
        private string password;
        private string protocol;

        HttpClient client = null;


        public Lcu(string lockfile)
        {
            String line = "";
            while(line == "")
            {
                try
                {
                    using (FileStream fs = new FileStream(lockfile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        StreamReader logFileReader = new StreamReader(fs);
                        line = logFileReader.ReadLine();
                        Thread.Sleep(5000);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    Thread.Sleep(5000);
                }
            }
            string[] data = line.Split(":");
            pid = data[1];
            port = data[2];
            password = data[3];
            protocol = data[4];
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
            {
                return true;
            };

            client = new HttpClient(httpClientHandler);
            client.BaseAddress = new Uri(protocol + "://127.0.0.1:" + port);
            client.DefaultRequestHeaders.Add("ContentType", "application/json");
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes("riot:" + password);
            string val = System.Convert.ToBase64String(plainTextBytes);
            client.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
        }

        void send_request(string path)
        {
            // HttpWebRequest request = (HttpWebRequest)WebRequest.Create(path);


            // var plainTextBytes = System.Text.Encoding.UTF8.GetBytes("testing:123456");
            // string val = System.Convert.ToBase64String(plainTextBytes);
            // httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
        }

        public string get(string path)
        {
            try{
                var response = client.GetAsync(path).Result;
                return response.Content.ReadAsStringAsync().Result;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("Launcher is close, try open League of Legends and then restart this program");
            }
            return "";
        }

        public string put(string path, string data)
        {
            var resp = client.PutAsync(path, new StringContent(data, System.Text.Encoding.UTF8, "application/json")).Result;
            return resp.Content.ReadAsStringAsync().Result;
        }

        public string delete(string path)
        {
            var resp = client.DeleteAsync(path).Result;
            return resp.Content.ReadAsStringAsync().Result;
        }

        public string post(string path, string data)
        {
            var resp = client.PostAsync(path, new StringContent(data, System.Text.Encoding.UTF8, "application/json")).Result;
            return resp.Content.ReadAsStringAsync().Result;
        }

        public override string ToString()
        {
            return "lcu: { pid: " + pid + ", port: " + port + ", password: " + password + ", protocol: " + protocol + " }";
        }
    }
}