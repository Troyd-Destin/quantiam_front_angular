## [19.2.0] February 2019

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


