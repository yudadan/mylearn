#!/bin/bash

m=("tmp" "new","cur")

for i in `ls /entmail20/d24/0/0/jiangyinhongmeng.sinanet.com/Wuhongqing/Maildir/* -d `
do
	ml=${i##/*/}
	s=0
	for n in ${m[*]}	
	do
		if [ "$n" = "$ml" ]
		then
			s=1
			break
		fi
	done
	createdir=/entmail20/d17/93/55/appdev.sinanet.com/weidong/Maildir/$ml
	echo $createdir 
	if [ $s -eq 0 ]  &&  [ ! -d $createdir ]
	then
		echo "create"
		mkdir $createdir 
	fi
done
