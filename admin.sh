#!/bin/bash

RED="\e[1;91m"
GREEN="\e[1;92m"
YELLOW="\e[1;93m"
BLUE="\e[1;94m"
PURPLE="\e[1;95m"
CYAN="\e[1;96m"
WHITE="\e[1;97m"
RESET="\e[0m"

echo -e "${CYAN}========================================${RESET}"
echo -e "${RED}        🐍 A SNAKE STACK          ${RESET}"
echo -e "${CYAN}========================================${RESET}\n"


function START_MENU(){
    echo -e "${GREEN}Select an option:${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  User-specific statistics"
    echo -e "${YELLOW}  [2]${WHITE}  View sorted game history"
    echo -e "${YELLOW}  [3]${WHITE}  Delete entries"
    echo -e "${YELLOW}  [4]${WHITE}  Perform log rotation (backup)\n"

    echo -e "${CYAN}----------------------------------------${RESET}"
    
}


START_MENU
while true;do
    echo -ne "${BLUE}Enter your choice [1-4]: ${RESET}"
    read -r PROMPT
    if [[ "$PROMPT" == "exit" ]];then
        exit 0
    elif [[ "$PROMPT" != "1" && "$PROMPT" != "2" && "$PROMPT" != "3" && "$PROMPT" != "4" ]];then
        echo -e "${RED}Invalid choice. ${RESET}"
    else
        break
    fi
done


if [[ $PROMPT == "1" ]]; then
    echo -e "\n${CYAN}----------------------------------------${RESET}"
    echo -e "${PURPLE} Enter Username to Search ${RESET}"
    echo -e "${CYAN}----------------------------------------${RESET}"

    echo -ne "${BLUE}Username: ${RESET}"
    read -r USERNAME

    echo -e "\n${GREEN}Select an action for ${WHITE}${USERNAME}${GREEN}:${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  View recent analytics"
    echo -e "${YELLOW}  [2]${WHITE}  View overall statistics\n"

    while true; do
        echo -ne "${BLUE}Enter choice [1-2]: ${RESET}"
        read -r PROMPT1
        if [[ "$PROMPT1" == "exit" ]]; then
            exit 0
        elif [[ "$PROMPT1" != "1" && "$PROMPT1" != "2" ]]; then
            echo -e "${RED}Invalid choice. ${RESET}"
        else
            break
        fi
    done

    while [[ $PROMPT1 != "exit" ]]
        do 
            awk -v user=$USERNAME -v prompt=$PROMPT1 -f administration/userstats.awk history.txt | less -R

            echo -e "\n${GREEN}Select an action for ${WHITE}${USERNAME}${GREEN}:${RESET}\n"

            echo -e "${YELLOW}  [1]${WHITE}  View recent analytics"
            echo -e "${YELLOW}  [2]${WHITE}  View overall statistics\n"

            while true; do
                echo -ne "${BLUE}Enter choice [1-2]: ${RESET}"
                read -r PROMPT1

                if [[ "$PROMPT1" == "exit" ]]; then
                    exit 0  
                elif [[ "$PROMPT1" != "1" && "$PROMPT1" != "2" ]]; then
                    echo -e "${RED}Invalid choice. ${RESET}"
                else
                    break
                fi
            done
        done


elif [[ $PROMPT == "2" ]]; then
    echo -e "\n${CYAN}----------------------------------------${RESET}"
    echo -e "${PURPLE} Sort Game History ${RESET}"
    echo -e "${CYAN}----------------------------------------${RESET}\n"

    echo -e "${GREEN}Select sorting method:${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  Timestamp (default)"
    echo -e "${YELLOW}  [2]${WHITE}  Username"
    echo -e "${YELLOW}  [3]${WHITE}  Score\n"


    while true; do
        echo -ne "${BLUE}Enter choice [1-3]: ${RESET}"
        read -r SORT_CHOICE

        SORT_CHOICE=${SORT_CHOICE:-1}
        if [[ "$SORT_CHOICE" == "exit" ]];then
            exit 0
        elif [[ "$SORT_CHOICE" != 1 && "$SORT_CHOICE" != 2 && "$SORT_CHOICE" != 3 ]]; then
            echo -e "${RED}Invalid input. Choose 1, 2, or 3.${RESET}"
        else
            break
        fi
    done

    while [[ $SORT_CHOICE != "exit" ]] do
        if [[ $SORT_CHOICE == "1" ]]; then
            sort -t '|' -k 1.7,1.10 -k 1.4,1.5 -k 1.1,1.2 -n -r history.txt | less -R
        elif [[ $SORT_CHOICE == "2" ]]; then
            sort -t "|" -k 2 history.txt | less -R
        elif [[ $SORT_CHOICE == "3" ]]; then
            sort -t "|" -k 3 -n -r history.txt | less -R
        fi

        echo -e "\n${CYAN}----------------------------------------${RESET}"
        echo -e "${PURPLE} Sort Game History ${RESET}"
        echo -e "${CYAN}----------------------------------------${RESET}\n"

        echo -e "${GREEN}Select sorting method:${RESET}\n"

        echo -e "${YELLOW}  [1]${WHITE}  Timestamp (default)"
        echo -e "${YELLOW}  [2]${WHITE}  Username"
        echo -e "${YELLOW}  [3]${WHITE}  Score\n"


        while true; do
            echo -ne "${BLUE}Enter choice [1-3]: ${RESET}"
            read -r SORT_CHOICE

            SORT_CHOICE=${SORT_CHOICE:-1}
            if [[ "$SORT_CHOICE" == "exit" ]];then
                exit 0
            elif [[ "$SORT_CHOICE" != 1 && "$SORT_CHOICE" != 2 && "$SORT_CHOICE" != 3 ]]; then
                echo -e "${RED}Invalid input. Choose 1, 2, or 3.${RESET}"
            else
                break
            fi
        done
    done

elif [[ $PROMPT == "3" ]]; then
    echo -e "${PURPLE}========================================${RESET}"
    echo -e "${WHITE}        DELETE MENU OPTIONS            ${RESET}"
    echo -e "${PURPLE}========================================${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  Remove invalid / malformed entries"
    echo -e "${YELLOW}  [2]${WHITE}  Remove entries by username\n"

    echo -e "${PURPLE}----------------------------------------${RESET}"

    while true; do
        echo -ne "${BLUE}Enter your choice [1-2]: ${RESET}"
        read -r DEL
        if [[ "$DEL" == "exit" ]];then
            exit 0
        elif [[ "$DEL" != 1 && "$DEL" != 2 ]]; then
            echo -e "${RED}Invalid input. Choose 1 or 2.${RESET}"
        else
            break
        fi
    done

    while [[ "$DEL" != "exit" ]] do    

        if [[ $DEL == "1" ]]; then
            sed -E '/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|[^|]+\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/!d' history.txt | cat > history.txt
        elif [[ $DEL == "2" ]]; then
            read -p $'\e[1;94mEnter the Username: \e[0m' user
            sed -E "/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|${user}\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/d" history.txt | cat > history.txt
        fi

        echo -e "${PURPLE}========================================${RESET}"
        echo -e "${WHITE}        DELETE MENU OPTIONS            ${RESET}"
        echo -e "${PURPLE}========================================${RESET}\n"

        echo -e "${YELLOW}  [1]${WHITE}  Remove invalid / malformed entries"
        echo -e "${YELLOW}  [2]${WHITE}  Remove entries by username\n"

        echo -e "${PURPLE}----------------------------------------${RESET}"

        while true; do
            echo -ne "${BLUE}Enter your choice [1-2]: ${RESET}"
            read -r DEL
            if [[ "$DEL" == "exit" ]];then
                exit 0
            elif [[ "$DEL" != 1 && "$DEL" != 2 ]]; then
                echo -e "${RED}Invalid input. Choose 1 or 2.${RESET}"
            else
                break
            fi
        done

    done
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