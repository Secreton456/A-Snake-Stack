#!/bin/bash

# Store PWD
DIR = $PWD

# ANSI Escape codes of various colors
RED="\e[1;91m"
GREEN="\e[1;92m"
YELLOW="\e[1;93m"
BLUE="\e[1;94m"
PURPLE="\e[1;95m"
CYAN="\e[1;96m"
WHITE="\e[1;97m"
RESET="\e[0m"


# Start Menu
# The administrator can choose between 4 options:
#       1) View User-Specific Stats.
#       2) View sorted game history.
#       3) Delete entries using predefined filters
#       4) Perform Logrotation.
#
# The variable PROMPT stores the choice in the menu.

echo -e "${CYAN}========================================${RESET}"
echo -e "${RED}        🐍 A SNAKE STACK          ${RESET}"
echo -e "${CYAN}========================================${RESET}\n"


function START_MENU(){
    echo -e "${GREEN}Select an option:${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  User-specific statistics"
    echo -e "${YELLOW}  [2]${WHITE}  View sorted game history"
    echo -e "${YELLOW}  [3]${WHITE}  Delete entries"
    echo -e "${YELLOW}  [4]${WHITE}  Perform log rotation (backup)"
    echo -e "${YELLOW}  [5]${WHITE}  View all users\n"

    echo -e "${CYAN}----------------------------------------${RESET}"
    
}


START_MENU

# Validate PROMPT
while true;do
    echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
    echo -ne "${BLUE}Enter your choice [1-5]: ${RESET}"
    read -r PROMPT
    
    # Exit the process if prompted exit.
    if [[ "$PROMPT" == "exit" ]];then
        exit 0
    # Invalidate choices which aren't 1|2|3|4|5
    elif [[ "$PROMPT" != "1" && "$PROMPT" != "2" && "$PROMPT" != "3" && "$PROMPT" != "4" && "$PROMPT" != "5" ]];then
        echo -e "${RED}Invalid choice. ${RESET}"
    else
        break
    fi
done


# If the administrator selects "User-Specific Stats", they will be prompted to enter a username.
# They can then choose to view either recent games or overall statistics.

if [[ $PROMPT == "1" ]]; then
    echo -e "\n${CYAN}----------------------------------------${RESET}"
    echo -e "${PURPLE} Enter Username to Search ${RESET}"
    echo -e "${CYAN}----------------------------------------${RESET}"

    echo -ne "${BLUE}Username: ${RESET}"
    read -r USERNAME

    echo -e "\n${GREEN}Select an action for ${WHITE}${USERNAME}${GREEN}:${RESET}\n"

    echo -e "${YELLOW}  [1]${WHITE}  View recent analytics"
    echo -e "${YELLOW}  [2]${WHITE}  View overall statistics\n"

    # Validate PROMPT1
    while true; do
        echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
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

    # Stay in the process till user prompts exit.
    while [[ $PROMPT1 != "exit" ]]
        do 
            # loads administration/userstats.awk 
            awk -v user=$USERNAME -v prompt=$PROMPT1 -f administration/userstats.awk history.txt | less -R

            # Repeats this action until prompted exit
            echo -e "\n${GREEN}Select an action for ${WHITE}${USERNAME}${GREEN}:${RESET}\n"

            echo -e "${YELLOW}  [1]${WHITE}  View recent analytics"
            echo -e "${YELLOW}  [2]${WHITE}  View overall statistics\n"

            while true; do
                echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
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
        echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
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
            echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
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
    echo -e "${YELLOW}  [2]${WHITE}  Remove entries by username"
    echo -e "${YELLOW}  [3]${WHITE}  Remove entries by Timestamp\n"

    echo -e "${PURPLE}----------------------------------------${RESET}"

    while true; do
        echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
        echo -ne "${BLUE}Enter your choice [1-3]: ${RESET}"
        read -r DEL
        if [[ "$DEL" == "exit" ]];then
            exit 0
        elif [[ "$DEL" != 1 && "$DEL" != 2 && "$DEL" != 3 ]]; then
            echo -e "${RED}Invalid input. Choose 1, 2, or 3.${RESET}"
        else
            break
        fi
    done

    while [[ "$DEL" != "exit" ]] do    

        if [[ $DEL == "1" ]]; then
            echo -ne "${RED}Are you sure you want to perform the following operation? [y/n]${RESET}"
            read -r confirmation
            if [[ "$confirmation" == "y" ]];then
                sed -Ei '/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|[^|]+\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/!d' history.txt 
                echo -e "${GREEN}Successfully deleted.${RESET}"
            else 
                echo -e "${GREEN}Deletion aborted.${RESET}"
            fi
        elif [[ $DEL == "2" ]]; then
            read -p $'\e[1;94mEnter the Username: \e[0m' user
            echo -ne "${RED}Are you sure you want to perform the following operation? [y/n]${RESET}"
            read -r confirmation
            if [[ "$confirmation" == "y" ]];then
                sed -Ei "/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}\|${user}\|[0-9]+(\.[0-9]+)?\|[^|]+\|[0-9]+(\.[0-9]+)?s$/d" history.txt 
                echo -e "${GREEN}Successfully deleted.${RESET}"
            else 
                echo -e "${GREEN}Deletion aborted.${RESET}"
            fi  
        elif [[ $DEL == "3" ]]; then
            echo -e "${BLUE}You are requested to enter the Start timestamp(default: from first) and the End timestamp.${RESET}"
            echo -e $'\e[1;94m Enter the Start timestamp in format "DD/MM/YYYY, HH:MM:SS"(note theres a space after the comma)\e[0m'
            read -p $'\e[1;94m Start Timestamp: \e[0m' start_timestamp
            echo -e $'\e[1;94m Enter the End timestamp in format "DD/MM/YYYY, HH:MM:SS"(note theres a space after the comma)\e[0m'
            read -p $'\e[1;94m End Timestamp: \e[0m' end_timestamp
            start_timestamp=${start_timestamp:-"00/00/0000, 00:00:00"}
            regex='^[0-9]{2}/[0-9]{2}/[0-9]{4}, [0-9]{2}:[0-9]{2}:[0-9]{2}$'
            if [[ ! $start_timestamp =~ $regex ]]; then
                echo -e "${RED}Invalid Start timestamp format. Deletion aborted.${RESET}"
                continue
            fi
            ############# NOTE ##############
            # The awk script deletebytimestamp.awk is designed to keep entries which are outside the range of start and end timestamps. Hence, the condition in the script is designed to print entries which are greater than start timestamp and lesser than end timestamp. If the entry is greater than start timestamp but also greater than end timestamp, it is not printed, effectively deleting entries in the range of start and end timestamps.
            if [[ $end_timestamp =~ $regex ]]; then
                echo -ne "${RED}Are you sure you want to perform the following operation? [y/n]${RESET}"
                read -r confirmation
                if [[ "$confirmation" == "y" ]];then
                    awk -f administration/deletebytimestamp.awk -v start="$start_timestamp" -v end="$end_timestamp" history.txt > temp.txt && mv temp.txt history.txt
                    echo -e "${GREEN}Successfully deleted.${RESET}"
                else 
                    echo -e "${GREEN}Deletion aborted.${RESET}"
                fi
            else
                echo -e "${RED}Invalid End timestamp format. Deletion aborted.${RESET}"
                continue
            fi
        fi

        echo -e "${PURPLE}========================================${RESET}"
        echo -e "${WHITE}        DELETE MENU OPTIONS            ${RESET}"
        echo -e "${PURPLE}========================================${RESET}\n"

        echo -e "${YELLOW}  [1]${WHITE}  Remove invalid / malformed entries"
        echo -e "${YELLOW}  [2]${WHITE}  Remove entries by username"
        echo -e "${YELLOW}  [3]${WHITE}  Remove entries by Timestamp\n"

        echo -e "${PURPLE}----------------------------------------${RESET}"

        while true; do
            echo -e "${WHITE}Type 'exit' to exit the program at any point.${RESET}"
            echo -ne "${BLUE}Enter your choice [1-3]: ${RESET}"
            read -r DEL
            if [[ "$DEL" == "exit" ]];then
                exit 0
            elif [[ "$DEL" != 1 && "$DEL" != 2 && "$DEL" != 3 ]]; then
                echo -e "${RED}Invalid input. Choose 1, 2, or 3.${RESET}"
            else
                break
            fi
        done

    done

# Performing Logrotation
elif [[ $PROMPT == "4" ]]; then
    # Check if logrotate is installed on the administrator's system; if not, prompt installation.
    if ! command -v logrotate > /dev/null 2>&1; then
        echo -e "\e[1;91mlogrotate not installed in your linux system.Please install it.\e[0m\n"
        exit 1
    else
    # Store the absolute path of history.txt and archive directory
    LOG_PATH="${PWD}/history.txt" 
    ARCHIVE_DIR="${PWD}/archive"

    # Create an archive directory if it isn't already there
    mkdir -p ${ARCHIVE_DIR}

    # Add logrotation logic to the config file stored in administratration directory
    # Performs log rotation in case `history.txt` is over 10KB, compresses it to .gz file, 
    # Stores only the last 10 logs in history.txt
    # Stores upto 4 compressed files in archive directory
    cat > "administration/logrotate.conf" << EOF 
"${LOG_PATH}" {
    size 10k
    rotate 4
    compress
    missingok
    notifempty
    olddir ${ARCHIVE_DIR}
    prerotate
        tail -n 10 history.txt > history.keep
    endscript

    postrotate
        cat history.keep > history.txt
        rm history.keep
    endscript
}
EOF

    echo -e "\e[1;95mRotating logs...\e[0m\n"
    logrotate -f "administration/logrotate.conf" -s "administration/logrotate.state"
    fi
elif [[ $PROMPT == "5" ]]; then
    echo -e "\n${CYAN}----------------------------------------${RESET}"
    echo -e "${PURPLE} List of All Users ${RESET}"
    echo -e "${CYAN}----------------------------------------${RESET}\n"

    awk -F "|" '{print "\033[1;91m" sprintf("%-12s",$2) "\033[0m"}' history.txt | sort | uniq | less -R
fi