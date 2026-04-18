#!/bin/bash

echo -e "\e[1;91mWELCOME TO OUR SNAKE GAME\e[0m\n"


echo -e "\e[1;92mCHOOSE A PROMPT YOU WANT TO QUERY ABOUT\e[0m\n"

echo -e "\e[1;   ]1)  Username specific stats\e[0m"
echo -e "\e[1;   ]2)  View Sorted file of game history\e[0m"
echo -e "\e[1;   ]3)  Delete entries\e[0m"
echo -e "\e[1;   ]4)  Perform log rotation(backup)\e[0m"

read -p $'\e[1;94mEnter the Prompt number: \e[0m' PROMPT

if [[ $PROMPT == "1" ]]; then
    echo -e "\e[1;95mENTER A USERNAME YOU WANT TO SEARCH FOR\e[0m\n"
    read -p $'\e[0;94mUsername: \e[0m' USERNAME

    echo -e "\e[1;92mCHOOSE A PROMPT YOU WANT TO QUERY ABOUT\e[0m\n"
    echo -e "\e[1;   ]1)  View Recent Analytics of $USERNAME\e[0m"
    echo -e "\e[1;   ]2)  View Overall Stastics of $USERNAME\e[0m"
    read -p $'\e[1;94mEnter the Prompt number: \e[0m' PROMPT1
    while [[ $PROMPT1 != "exit" ]]
    do 
        awk -v user=$USERNAME -v prompt=$PROMPT1 '
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
        ' history.txt | less -R


        echo -e "\e[1;92mCHOOSE A PROMPT YOU WANT TO QUERY ABOUT\e[0m\n"

        echo -e "\e[1;   ]1)  View Recent Analytics of $USERNAME\e[0m"
        echo -e "\e[1;   ]2)  View Overall Stastics of $USERNAME\e[0m"
        echo -e "\e[1;   ]Prompt 'exit' to exit\e[0m"
        read -p $'\e[1;94mEnter the Prompt number: \e[0m' PROMPT1

    done
elif [[ $PROMPT == "2" ]]; then
    echo -e "\e[1;95mENTER IN WHICH WAY YOU WANT THE FILE SORTED\e[0m\n"
    echo -e "\e[1;   ]1)Timestamp(default)\e[0m"
    echo -e "\e[1;   ]2)Username\e[0m"
    echo -e "\e[1;   ]3)Score\e[0m"

    read -p $'\e[1;94mEnter the Prompt number: \e[0m' SORT
    while [[ $SORT != "exit" ]]
    do
        if [[ $SORT == "1" ]]; then
            sort -t '|' -k 1.7,1.10 -k 1.4,1.5 -k 1.1,1.2 -n -r history.txt | less -R
        elif [[ $SORT == "2" ]]; then
            sort -t "|" -k 2 history.txt | less -R
        elif [[ $SORT == "3" ]]; then
            sort -t "|" -k 3 -n -r history.txt | less -R
        fi
        echo -e "\e[1;95mENTER IN WHICH WAY YOU WANT THE FILE SORTED\e[0m\n"
        echo -e "\e[1;   ]1)Timestamp(default)\e[0m"
        echo -e "\e[1;   ]2)Username\e[0m"
        echo -e "\e[1;   ]3)Score\e[0m"
        echo -e "\e[1;   ]Prompt 'exit' to exit\e[0m"
        read -p $'\e[1;94mEnter the Prompt number: \e[0m' SORT
    done
elif [[ $PROMPT == "3" ]]; then
    echo -e "\e[1;95mENTER ON WHICH BASIS U WANT TO DELETE ENTRIES\e[0m\n"
    echo -e "\e[1;   ]1)Entries not in correct format\e[0m"
    echo -e "\e[1;   ]2)Username\e[0m"
    read -p $'\e[1;94mEnter the Prompt number: \e[0m' DEL
    if [[ $DEL == "1" ]]; then
        sed -E '/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|[^|]+\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/!d' history.txt | cat > history.txt
    elif [[ $DEL == "2" ]]; then
        read -p $'\e[1;94mEnter the Username: \e[0m' user
        sed -E "/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|${user}\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/d" history.txt | cat > history.txt
    fi
elif [[ $PROMPT == "4" ]]; then
    if ! command -v logrotate > /dev/null 2>&1; then
        echo -e "\e[1;91mlogrotate not installed in your linux system.Please install it.\e[0m\n"
        exit 1
    else
    echo -e "\e[1;95mRotating logs...\e[0m\n"
    logrotate -f <<EOF
    history.txt {
        size 10k
        rotate 4
        compress
        missingok
        notifempty

        prerotate
            tail -n 10 history.txt > history.keep
        endscript

        postrotate
            cat history.keep > history.txt
            rm history.keep
        endscript
    }
EOF
    fi

fi