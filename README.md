# castaway

The aim of this project is to provide a complete re-implemtation of the Johnny Castaway Screen Saver created by Dynamix using Javascript.

![alt text](castaway.png "Dynamix Johnny Castaway Screen Saver")

## Live Demo

[Check here the current development state](http://castaway.xesf.net/#entry=MJFISH.TTM)

## Purpose
- Re-implementation of the Johnny Castaway Screen Saver;

- Learn the Dynamix Game Development System (DGDS);

- Document the files format used;

- Build tools using NodeJS;

- Focus on taking advantage of the modern web development languages and frameworks like Javascript and React;

- Use as a sandbox to try new features of those frameworks during the process;

- Have fun implementing it!!

## Enhancements

List of new features to add to Johnny Castaway experience:
* Day/Night loop in 24h instead of 8h
* Day/Night based on user location sunrise and sunset
* Moving cloulds
* Add waves like the static screen
* Accelarate time
* Tides based on user locations with real time coutry low tide info
* Play Full Story Sequence
    * Choose single activities to play
* Number of full complete stories played worldwide
* Total hours worldwide played
* Statistics per Activity
    * Total Jogging
    * Fishing
    * etc.
* Extend festive days from the original - could be based on user location

## Documents

[Resource Index File Format](docs/resindex.md)

## Usage

This project uses node, yarn and lerna CLI to manage multiple applications and packages in a mono repository.

Install:
* nodejs: https://nodejs.org/en/
* yarn: https://yarnpkg.com/en/

Run this commands in the root folder:

> yarn global add lerna

> lerna bootstrap

### Dump Resources

This application allows you to extract the resources of Johnny Castaway. A data/dump folder will be created when application is executed.

> cd projects/dump

> yarn start

### Viewer

This application allows you to browse through the resources and play them.

> cd projects/viewer

> yarn start

### Mobile

A ReactNative experimental application to play Johnny Castaway. At the moment it only executes the viewer as a web view, but in future should play the whole story.

> cd projects/mobile

> yarn start
