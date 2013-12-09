---
layout: post
title:  "Must Read: Decoupling Groupon"
date:   2013-12-09 14:13:42
categories: programming must-read
---

You should read [I-Tier: Dismantling the Monoliths on Groupon Blog](https://engineering.groupon.com/2013/misc/i-tier-dismantling-the-monoliths/)

TL;DR version:
--------------
It talks about the process of converting a massive ruby on rails application to multiple node.js backends with a singular web frontend which can connect to a European or US API and a public-facing API for mobile applications. With multiple backends (one for each feature), teams are able to work/deploy independently from each other. Due to these changes Groupon has seen 50% speed increase on loads, partly due to a thinner rewrite of the pages, and equal serving of traffic with less hardware.

This kind of distributed system is being implemented in some of my own work currently to better prepare for scaling.