#!/bin/bash

#11  9   * * * bash runftp.sh start >>/root/ftp/`date +%Y%m`.log > 2>&1  
#11  19   * * * bash runftp.sh stop >>/root/ftp/`date +%Y%m`.log > 2>&1 

if [ $1 = "stop" ]
then
service vsftpd stop
exit 0
fi

ftpuser=ftpuser1  
ftpgroup=ftpgroup  

egrep "^$ftpgroup" /etc/group >& /dev/null  
if [ $? -ne 0 ] 
then
	groupadd ftpgroup   
fi

egrep "ftpuser1" /etc/passwd >& /dev/null  
if [ $? -eq 0 ]  
then  
	userdel "$ftpuser"
fi


if [ ! -d /ftpdir ]
then
	mkdir /ftpdir
fi

grep "nologin" /etc/shells >& /dev/null  
if [ $? -ne 0 ] 
then
	echo "/sbin/nologin" >> /etc/shells
fi

useradd -d /ftpdir/ftpuser1 -g ftpgroup -s /sbin/nologin  -m  ftpuser1 
#echo "ywd337472" |passwd ftpuser1 --stdin

/usr/bin/expect <<EOD
spawn passwd $ftpuser
expect "password:"
send "ywd337472\r"
expect "Retype new password:"
send "ywd337472\r"
expect eof
EOD

service vsftpd stop
service vsftpd start


