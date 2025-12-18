#!/bin/bash
cd /Users/fayaa/Desktop/App/MalariaForm/mobile-app

# Trigger iOS build for production
expect -c '
set timeout -1
spawn eas build --platform ios --profile production
expect {
    "iOS app only uses standard/exempt encryption?" { send "y\r"; exp_continue }
    "Generate a new Apple Distribution Certificate?" { send "y\r"; exp_continue }
    "Generate a new Apple Provisioning Profile?" { send "y\r"; exp_continue }
    "Log in to your Apple account" { send "\r"; exp_continue }
    "Apple ID:" { send "\r"; exp_continue }
    "Password:" { send "\r"; exp_continue }
    "Would you like to*" { send "y\r"; exp_continue }
    "Select an iOS distribution certificate to use for code signing:" { send "\r"; exp_continue }
    eof
}
'

