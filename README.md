[![Stories in Ready](https://badge.waffle.io/tnocs/techradar.png?label=ready&title=Ready)](https://waffle.io/tnocs/techradar)
# TechRadar
A technology radar that uses a [Google Sheet](https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true) as input. [LIVE DEMO](http://tnocs.github.io/TechRadar/)

![Screenshot](http://i.imgur.com/qFzwPBC.png)

## Features

* Click on a technology (circle) to jump to a detailed description.
* Each technology can have multiple pages, consisting of markdown, images, or youtube videos.
* Each technology has a priority, which determines its color, and which you can use to filter (priority control top right).
* You can filter technologies using text (filter box top right).
* You can select a subset: click on a category (pie) title or time (ring) to only show these technologies.
* Navigation support using cursor keys (left-right moves between technologies, up-down switches between pages).

## How to use 

Fork the repo and change the spreadsheet URL in app.ts (or app.js if you don't use TypeScript).

## For developers
### How to use

Copy the techradar, slide and messagebus to your app.

### How it works

Build using Angularjs, there are two directives and one service:

* messagebus service: for communicating between directives.
* techradar directive: uses d3 to create the radar plot. On click, publishes a select message.
* infoslide directive: renders the technology.content as different pages, and subscribes to select message to switch technology.

