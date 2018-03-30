#!/bin/bash

EXTIF="eth1" #eth0一般表示外网地址
INIF="eth0"              
INNET="192.168.100.0/24" 
export EXTIF INIF INNET

echo "1" > /proc/sys/net/ipv4/tcp_syncookies
echo "1" > /proc/sys/net/ipv4/icmp_echo_ignore_broadcasts
SERVERS="rp_filter log_martians" 
for i in $SERVERS ;do

echo "1" > "/proc/sys/net/ipv4/conf/all/"$i
done

SERVERS="accept_source_route,accept_redirects,send_redirects" 
for i in $SERVERS ;do        
echo "0" > $i
done

PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/sbin:/usr/local/bin; export PATH
iptables -F
iptables -X
iptables -Z
iptables -P INPUT   DROP
iptables -P OUTPUT  ACCEPT
iptables -P FORWARD ACCEPT
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

if [ -f `pwd`/iptables.deny ]; then
echo  `pwd`/iptables.deny
sh `pwd`/iptables.deny
fi
if [ -f `pwd`/iptables.allow ]; then
sh `pwd`/iptables.allow
fi

iptables -A INPUT -p TCP -i $EXTIF --dport  21 --sport 1024:65534 -j ACCEPT #FTP
iptables -A INPUT -p TCP -i $EXTIF --dport  22 --sport 1024:65534 -j ACCEPT #SSH
iptables -A INPUT -p TCP -i $EXTIF --dport  25 --sport 1024:65534 -j ACCEPT #SMTP
iptables -A INPUT -p UDP -i $EXTIF --dport  53 --sport 1024:65534 -j ACCEPT #DNS
iptables -A INPUT -p TCP -i $EXTIF --dport  53 --sport 1024:65534 -j ACCEPT #DNS
iptables -A INPUT -p TCP -i $EXTIF --dport  80 --sport 1024:65534 -j ACCEPT #WWW
iptables -A INPUT -p TCP -i $EXTIF --dport 110 --sport 1024:65534 -j ACCEPT #POP3
iptables -A INPUT -p TCP -i $EXTIF --dport 443 --sport 1024:65534 -j ACCEPT #HTTPS

modules="ip_tables iptable_nat ip_nat_ftp ip_nat_irc ip_conntrack 
ip_conntrack_ftp ip_conntrack_irc"
for mod in $modules
do
testmod=`lsmod | grep "^${mod} " | awk '{print $1}'`
if [ "$testmod" = "" ]; then
modprobe $mod
fi
done

iptables -F -t nat
iptables -X -t nat
iptables -Z -t nat
iptables -t nat -P PREROUTING  ACCEPT
iptables -t nat -P POSTROUTING ACCEPT
iptables -t nat -P OUTPUT      ACCEPT

if [ "$INIF" != "" ]; then
iptables -A INPUT -i $INIF -j ACCEPT
echo "1" > /proc/sys/net/ipv4/ip_forward
if [ "$INNET" != "" ]; then
for innet in $INNET
do
iptables -t nat -A POSTROUTING -s $innet -o $EXTIF -j MASQUERADE
done
fi

iptables -t nat -A PREROUTING -p tcp -s 1.2.3.4  --dport 6000  -j DNAT --to-destination 192.168.100.10
fi

#if  lsb_release -a | grep -i "centos" 
#then
#echo "centos"
#elif [ lsb_release -a | grep -i "ubuntu" ]
#then
#invoke-rc.d  iptables-persistent save
#fi

apt-get install iptables-persistent
invoke-rc.d  iptables-persistent save
/etc/init.d/iptables save
