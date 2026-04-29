BEGIN{
    FS="|"
    split(start,startdate,"/");
    split(startdate[3],starttime," ");
    split(starttime[1],startyr,",");
    startyear = startyr[1];
    startmonth = startdate[2];
    startday = startdate[1];
    split(starttime[2],starthms,":");
    starthour = starthms[1];
    startminute = starthms[2];
    startsecond = starthms[3];
    split(end,enddate,"/");
    split(enddate[3],endtime," ");
    split(endtime[1],endyr,",");
    endyear = endyr[1];
    endmonth = enddate[2];
    endday = enddate[1];
    split(endtime[2],endhms,":");
    endhour = endhms[1];
    endminute = endhms[2];
    endsecond = endhms[3];
}
{
    split($1,date,"/");
    split(date[3],time," ");
    split(time[1],yr,",");
    year = yr[1];
    month = date[2];
    day = date[1];
    split(time[2],hms,":");
    hour = hms[1];
    minute = hms[2];
    second = hms[3];
    if (year > startyear || (year == startyear && month > startmonth) || (year == startyear && month == startmonth && day > startday) || (year == startyear && month == startmonth && day == startday && hour > starthour) || (year == startyear && month == startmonth && day == startday && hour == starthour && minute > startminute) || (year == startyear && month == startmonth && day == startday && hour == starthour && minute == startminute && second > startsecond)) {
        if (year < endyear || (year == endyear && month < endmonth) || (year == endyear && month == endmonth && day < endday) || (year == endyear && month == endmonth && day == endday && hour < endhour) || (year == endyear && month == endmonth && day == endday && hour == endhour && minute < endminute) || (year == endyear && month == endmonth && day == endday && hour == endhour && minute == endminute && second < endsecond)) {
        }
        else {
            print $0;
        }
    }
    else {
        print $0;
    }
}