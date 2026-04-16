#!/bin/bash

echo -e "\e[1;91mWELCOME TO OUR SNAKE GAME\e[0m\n"
echo -e "\e[1;95mENTER A USERNAME YOU WANT TO SEARCH FOR\e[0m\n"
read -p $'\e[0;94mUsername: \e[0m' USERNAME

awk -v user="$USERNAME" '
BEGIN{
    FS="|";
    outputFormat = "%-12s|%-12s|%-12s|%-12s\n";
    printf(outputFormat, "USERNAME", "SCORE", "CAUSE", "TIME")
    printf "\033[1;94m_________________________________________\033[0m\n"
}

{
if($2==user){
    printf "%-12s|%-12s|%-12s|%-12s\n",
        "\033[1;91m" sprintf("%-12s",$2) "\033[0m",
        "\033[1;92m" sprintf("%-12s",$3) "\033[0m",
        "\033[1;93m" sprintf("%-12s",$4) "\033[0m",
        "\033[1;94m" sprintf("%-12s",$5) "\033[0m"
    }
}
' history.txt | less