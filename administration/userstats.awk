BEGIN{
    FS="|";
    outputFormat = "%-12s|%-12s|%-12s|%-12s\n";
    if(prompt == "1"){
        printf(outputFormat, "USERNAME", "SCORE", "CAUSE", "TIME")
        printf "\033[1;94m_________________________________________\033[0m\n"
    }
    appearances = 0;
    TotalScore = 0;
    TotalTime = 0;
    WallDeaths = 0;
    LavaDeaths = 0;
    LowHealthDeaths = 0;
    BodyDeaths = 0;
}

{

if($2==user){
    appearances += 1;
    TotalScore += int($3 + 0);
    TotalTime += int($5 + 0);
    if($4 == "WALL"){
        WallDeaths += 1;
    }
    if($4 == "LAVA"){
        LavaDeaths += 1;
    }
    if($4 == "ZERO_HEALTH"){
        LowHealthDeaths += 1;
    }
    if($4 == "BODY"){
        BodyDeaths += 1;
    }
    if(prompt=="1"){
    printf "%-12s|%-12s|%-12s|%-12s\n",
        "\033[1;91m" sprintf("%-12s",$2) "\033[0m",
        "\033[1;92m" sprintf("%-12s",$3) "\033[0m",
        "\033[1;93m" sprintf("%-12s",$4) "\033[0m",
        "\033[1;94m" sprintf("%-12s",$5) "\033[0m";
        }
    }
}

END{
    if(appearances == 0) printf"\033[1;91mNO USER FOUND WITH SUCH NAME\033[0m\n";
    if(prompt == "2"){
        printf "\033[1;91m Mean Score                       : \033[0m\033[1;92m"TotalScore/appearances"\033[0m\n"
        printf "\033[1;91m Mean Time                        : \033[0m\033[1;92m"TotalTime/appearances"\033[0m\n"
        printf "\033[1;91m Fraction of Wall Deaths          : \033[0m\033[1;92m"WallDeaths/appearances"\033[0m\n"
        printf "\033[1;91m Fraction of Body Deaths          : \033[0m\033[1;92m"BodyDeaths/appearances"\033[0m\n"
        printf "\033[1;91m Fraction of Lava Deaths          : \033[0m\033[1;92m"LavaDeaths/appearances"\033[0m\n"
        printf "\033[1;91m Fraction of Low Health Deaths    : \033[0m\033[1;92m"LowHealthDeaths/appearances"\033[0m\n"
    }
}
