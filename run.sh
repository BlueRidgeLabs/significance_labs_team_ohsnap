#!/bin/bash
#Startup script for ohsnap

SC_DIR=/home/ec2-user/SC
LOG_DIR=/home/ec2-user/logs

nohup forever start -l $LOG_DIR/log.out -o $LOG_DIR/std_out.log -e $LOG_DIR/std_err.log --append $SC_DIR/server.js &

echo 'Initialization of easyfoodstamps complete'
