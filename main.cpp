#include "lcu.h"

#include <iostream> 

int main(int argc, char *argv[])
{
    lcu newlcu = lcu("C:\\Riot Games\\League of Legends\\lockfile");
    std::cout << newlcu;
    return 0;
}