---
layout: post
title:  "Python and OSX Mavericks Readline Problems"
date:   2013-12-03 17:04:00
categories: programming reminder
---

This is just a quick reminder to myself, after updating to OSX Mavericks my Python 3.3 and 2.7 interpreters were failing after 2 line executions. This was fixed with these commands

    cd /Library/Frameworks/Python.framework/Versions/3.3/lib/python3.3/lib-dynload 
    sudo mv readline.so readline.so.disabled  
