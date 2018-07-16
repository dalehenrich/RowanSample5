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
- \<userId>1
- \<userId>2

There are two packages per symbol dictionary `*-Core` and `*-Extensions`

There is a single package `RowanSample5-GlobalsExtensions` that contains the extension methods for Globals.

Dark does not have world-read permissions, so it's symbol dictionaries are private. 
Dark can see the classes and methds for Red, Yellow, Blue, but these users cannot see the classes and methods owned by Dark.

### `_monolithic` configuration/package structure

In this option there is a single monolithic symbol dictionary where all code is stored.

There is a single package per user `*-Core` that includes the user's classes and extension methods.

There is a single package `RowanSample5-GlobalsExtensions` that contains the extension methods for Globals.

With a single Application symbol dictionary, Dark is just a normal user like Red, Yellow, or Blue.

### updating from `_current` to `_monolithic`
 
When updating from `_current` to `_monolithic` the `newBuild_SystemUser_sample_current_to_monolithic` script:
  1. `loads` the `_current` project into the stone.
  2. `disowns` the `_current` project
At this point the stone represents an existing application laid out in a set of symbol dictionaries and the following steps are used to install a *rowanized* version of the project, that includes changes to the symbol dictionary layout and package structure:
  3. `adopts` the `_current` project into a `_staging` project
  4. `loads` the `_monolithic` project into the stone
  5. `disowns` the `_staging` project
