# RowanSample5

4 GemStone application users:
- Red
- Yellow
- Blue
- Dark

Red, Yellow, Blue share their symbol dictionaries with each other.
Each user has two classes `<color>Class1` and  `<color>Class2`.
Each user has class extension methods in each other's classes.
Each user has an extension method for a class (Object) in the Globals symbol dictionary
In each of the configurations below, the classes and methods should be the same.
The only difference is the number of symbol dictionaries and the package structure to support the symbol dictionary structure.

Dark does not have world-read permissions, so it's symbol dictionaries are private. 
Dark can see the classes and methds for Red, Yellow, Blue, but these users cannot see the classes and methods owned by Dark.

There are three administrative users:
- ApplicationCurator
- GlobalsCurator
- UserCurator

GlobalsCurator has permission to write to Globals, RowanKernel, RowanLoader, and RowanTools.

UserCurator has permission to write the 12 application symbol dictionaries for Red, Yellow, Blue, and Dark.

ApplicationCurator has the combined permissions of GlobalsCurator and UserCurator.

Combined, the GlobalsCurator and UserCurator can perform the same work as the ApplicationCurator.

### `_current` configuration/package structure

In this option, each user has 2 symbol dictionaries:
- <color>1
- <color>2

There are two packages per symbol dictionary `*-Core` and `*-Extensions`

There is a single package `*-GlobalExtensions` that contains the extension methods for Globals

### `_monolithic` configuration/package structure

In this option there is a single monolithic symbol dictionary where all code is stored.

There is a single package per user `*-Core` that includes the users' classes and extension methods.


