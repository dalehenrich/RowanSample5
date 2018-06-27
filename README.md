# RowanSample5

4 GemStone application users:
- Red
- Yellow
- Blue
- Dark

Each user has 3 symbol dictionaries:
- <color>1
- <color>2
- <color>3

Red, Yellow, Blue share their symbol dictionaries with each other.

Dark does not have world-read permissions, so it's symbol dictionaries are private. 
Dark has the symbol dictionaries for Red, Yellow, Blue in it's symbol list.

There are three administrative users:
- ApplicationCurator
- GlobalsCurator
- UserCurator

GlobalsCurator has permission to write to Globals, RowanKernel, RowanLoader, and RowanTools.

UserCurator has permission to write the 12 application symbol dictionaries for Red, Yellow, Blue, and Dark.

ApplicationCurator has the combined permissions of GlobalsCurator and UserCurator.

Combined, the GlobalsCurator and UserCurator can perform the same work as the ApplicationCurator.
