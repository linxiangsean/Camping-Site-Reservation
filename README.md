# Camping-Site-Reservation
A web CRUD application using MEAN Stack - AngularJS, Express.js, Node.js, MongoDB 


### Project Description

This project was aimed to be functioned as an online camp reservation. Users may sign up,
log in, check campsites availability and make reservations. Administrators shared same
features as users, and he/she may add and edit campsites.

### Languages/frameworks used for implementation

MEAN stack such as MongoDB, ExpressJS, AngularJS, and NodeJS were used in this project.
Bootstrap templates were also used for interface design. JavaScript and HTML were the main
languages used in this project.

### Database Design

Here is some information about the data model in MongoDB.

Fig 1 showed details about each campsite such as name, address, price and associated
pictures.

```
Fig 1: campsites detail in Jason file
```
### Main Functionalities

Registration for this website has two parts. As an administrator, you will have “admin” as the
registered user name. Password validation will be checked as it should contain at least 8
digits include at least 1 letter and 1 number. Email will also be check as it follows the regular
email address. As a regular user, the registration will be the same as an admin but cannot
choose admin as its user name. An example of registration interface showed in figure 2.


```
Fig 2 : registration interface
```
After users or admin successfully registered, they may log in. An example of login interface
showed in figure 3

```
Fig 3 : login interface
```
After users logged in, they can check details for each campsite such as name, address and
price. A simple pagination was added as a feature in the back-end. Results will be in different
page when they were searched and filtered. An example of home page showed in figure 4.
Users can also check availabilities for each campsite and search their interested campsites
based on region filter(Dallas and Denton) and key word. Campsites then may add to user’s
shopping cart after user checked availability as it showed in figure 5. In the shopping cart,
details of each added campsite such as name, price, check in and check out will appear. Users
may back to homepage and continue adding favorite campsites or delete current choices.
Reservation will be made once users click reserve all in the shopping cart.


Fig 4 : home interface

```
Fig 5 : Shopping cart
```

An example of reservation page showed in figure 6. Details for each reserved campsite
include name, price, check in and check out dates.

```
Fig 6 : reservation page
```
As an admin, he/she can also add, edit, or delete campsites. Adding and editing have the same
interface. As for deleting, soft-delete was applied in this project. Figure 7 showed as an
example of editing page. Admin can upload picture for campsite, change name, address and
price for individual campsite.

```
Fig 7 : campsites editing page
```

### Team Members and work division

Dehu Kong dxk170005: main framework, shopping cart, reservation

Xiang Lin xxl180009: user interface, add/edit/delete, pagination

Dishi Zheng dxz170002: database populating, pagination attempt, report
