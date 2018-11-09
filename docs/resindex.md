# Resource Index File Format

Resource Map is a file containing index information about resources.

It allow us to identify which resource files need to be imported and the details of each entry of that resource file.

# Engine
Dynamix Game Development System (DGDS) - an engine originally created by Dynamix based on Sierra pre-existing engine.

## Games
- Johny Castaway Screen Saver
- Quarky & Quaysoo's Turbo Science, 
- Heart of China, 
- The Adventures of Willy Beamish, 
- Rise of the Dragon

# Format

It is composed by:
- Header
- Resource List
    - Resource Entries

## Header

The header is static with length of 6 bytes

- u8 unknow0
- u8 unknow1
- u8 unknow2 
- u8 unknow3 
- u8 numResources
    - number of resources files available in this index
- u8 unknow5


## Resource List

For each numResources entries from Header section do the following:

- *u8: name
    - List of characters containing name of the resource file
    - Static size of 13 characters
    - Last byte is always zero to allow string termination
    - This will allow to parse and decompress all the resource files used

- u16: numEntries
    - Number of entries the resource file has to be imported


## Resource Entry Header

For each numEntries from Resource List do the following:

- u32: length
    - Decompressed entry size
    - This will help understanding which entries need to be decompressed. More details on the Resource file format documentation

- u32: offest
    - Offset of the entry inside the Resource file

Note, to get the size of each of the compressed entries, you just need to calculate the different between the offsets.
 - current_offset_size = next_offset - current_offset


At the end of this implementation, you should be ready to parse the Resource files, which will be describe in a separate document file.

# Author
Alexandre Fontoura aka xesf
- xesfnet@gmail.com
- https://github.com/xesf

## References
- Hans Milling aka nivs1978 (github)
    - https://github.com/nivs1978/Johnny-Castaway-Open-Source/blob/master/JCOS/Map.cs
    
- Vasco Costa aka vcosta (github)
    - https://github.com/vcosta/scummvm/wiki