#include <string>
#include <fstream>
#include <istream>

#include <exception>

class lcu
{
private:
    std::string pid;
    std::string port;
    std::string password;
    std::string protocol;

public:
    lcu(std::string lockfile_location);
    ~lcu();
    friend std::ostream& operator<<(std::ostream& is, lcu& lc);
    
};

std::ostream& operator<<(std::ostream& is, lcu& lc)
{
    return is << "lcu {pid: " << lc.pid << ", port: " << lc.port << ", password: " << lc.password << ", protocol: " << lc.protocol << "}" << std::endl;
}


lcu::lcu(std::string lockfile_location)
{
    std::ifstream lockfile(lockfile_location);
    std::string line;

    std::getline(lockfile, line, ':');
    std::getline(lockfile, pid, ':');
    std::getline(lockfile, port, ':');
    std::getline(lockfile, password, ':');
    std::getline(lockfile, protocol, ':');
    lockfile.close();
}

lcu::~lcu()
{
    
}