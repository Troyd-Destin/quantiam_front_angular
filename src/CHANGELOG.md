## Known Issues

- Material Suppler dropdown, does not clear properly when declining to create a new tag

## [0.19.5] May 2019

### Timesheet

- Fixed stat holiday editing bug
- User selection dropdown now respects permissions.
- Built Projects, Holidays, RTO Allocation, Reports tabs
- User Summary Usage Report is now functional
- Fixed Display of Machines in the user list, navigating to machines and downloading timesheets

### Timesheet Statistics
- Added a Company view, which breaks down timesheet hours on a categorical basis
- Fancy pie chart
- Fancy monthly hours as a percent time chart. 

### Material 
- Adding a material now uses the new select-material component
- Removed property Catalog, this will be changed into a container property 

### Material Container
- Added a container expiry field
- New info blurb about where Safety Data Sheets (SDS) are stored on the Q drive

### RTO
- User selection dropdown now respects permissions

### RTO View
- Added timerequest table, can add or remvoe requests
- deleting a request now navigates back to the database and refreshes the RTO table

### SEM
- Data storage location now displayed
- Image data is now displayed

### Other
- fixed tab CSS to better handle overflows
- Ag grid updated to 20.1.0
- HandsOnTable added in for quick tabular display, stil can't figure out how to copy with headers. 
- Select MAterial component now works as intended
- Replaced select2 supplier dropdown, with ng select, to fix display bug
- Auth screen font resized

## [0.19.4] April 2019

### Users
- Can add permissions to individual users now

### Timesheet 
- Fixed navigation to remember what time sheet you were on when you click the timesheet
- Known issue: timesheet category does not highligh using dynamic router link
- Weekends now properly highlight regardless of timesheet state

### Materials Inventory
- Can now print off large labels with bar codes for scanning. 

### Misc
- eliminated caps lock bug when scanning materials


## [0.19.3] March 2019

### SEM
- Can now select run types
- Can now refresh the data table
- Fixes to keyboard commands and when using filters

### Misc
- User select box will now hard check for employee ID, typing 1 will now select Robert

## [0.19.2] February 2019

### TGA
- Peak tool now has "previous" and "next" buttons for navigating single runs easier
- Peak tool now clears selection properly
- Fixed a bug where the graphs would not delete when expected

### Users
- Can now create and delete RTO Allotments on the user view screen
- Added a group tab to the Managment box

### Timesheet
- Can now view timesheet data on a per user basis
- Machine Timesheets can now be viewed
- Hours, Overtime, RTO and Bank tables exist
- RTO Calendar rebuilt, has all previous functionality 

### Sidemenu
- Added Timesheet Category
- Sorted SGX towards the bottom
- Instruments now has a SEM category

### Materials

- Containers now require R&D L1 or Manufacturing Access to edit / create 
- The container screeen will now try to search online for a relevant MSDS
- You can now save SDS sheets in this application. 
- The material database now displays if a SDS is on file.
- All SDS sheets live in Q:\Administration - All Staff\SDS 

### SEM 
- SEM database now works with server side querying
- Various fitlers tested and working

### XRD
- Xrd database now works with server side querying

### Other

- Select2 boxes now have proper padding for placeholder text


## [19.1.0] January 2019

### Misc
-  Auth screen no longer locks you out when you fail your password.
-  Updated to Angular 7.2
-  Login button now visible

### Materials / Containers
   
- Materials screen now preserves itself when navigating around. 
- You can now delete containers, after deleting one you are redirected to the database and the table refreshed
- A drop down for searching maerial containers now exists

### TGA
- TGA Peak Tool for SGX analysis added   
- Peak Tool: Added a table to show selected runs, ability to export raw data
- Peak Tool: Added basic graph controls to multi graph mode



## [18.12.0] December 2018
### General
- When the application is "thinking", a loading bar will be displayed at the top of the screen. 
- The select scanner box is now hidden by default, but can be toggled with the target button by the user's name.
- Styling improvements for module navigation bars. 



## [18.11.0] November 2018
### Angular 
- Updated from Angular 7.0 to 7.1  

### General
- Implmented basic caching for named routes, this means that when users are navigating to and fro a table, the settings, filters and searches will be saved.  
   
### User
- RTO Allotment can now be viewed from the user screen  
- RTO Allotments can now be edited by those with sufficent permissions  


