# My Pretentious Cup

You like coffee don't you? This project is designed to create a social media platform to show off your coffee obsessions.

## Getting Started

Currently this project is up and running!! Visit [My Pretentious Cup](http://mypretentiouscup.com/) to check out the page!
If you would like to fork this project or suggest changes.. Follow the steps below to pull down the project and get started.

### Prerequisites

What things you need to install the software and how to install them

[npm](https://www.npmjs.com/) - Node Package Manager

### Installing

A step by step series of examples that tell you have to get a development env running

First.. Fork and clone down the repo!! Once you have that settled.. Continue2

Install all dependencies

```
cd My-Pretentious-Cup/lib/
npm install
cd ../
```

From here, if you run a local server, you should be getting a couple errors regarding some missing files. Let's add those in.

```
cd app/
mkdir app/values && cd app/values
touch GoogleMapsConfig.js FBConfig.js
cd ../../
```

Great!! For this application, I am using Google Maps API for its geolocation, direction, and places library. These are pretty essential to the project!! If you are wanting to incorporate this service, you will definitely be needing this key!!
Below are a few steps to get you set up with one, then to set up the config file.

[googleapi](https://console.developers.google.com/apis) - Go ahead and create a new project for this application
Once you have that project, you will need to enable 3 apis. 
Go to the Library tab to the left of the screen and choose to enable Maps Directions API, Maps Javascript API, and their Places API (private API). 
Now that these are enabled, you need a key. Click the Credentials tab, then Create Credentials. All you need is the API Key.
There should be a modal that appears with your key!! Voila. Go ahead and copy this key, we will be adding it to our GoogleMapsConfig.js.
With your text editor of choice, go ahead and open up GoogleMapsConfig.js and copy in the following code, being sure to replace the placeholder with your new key.

```
"use strict";

app.constant("GoogleMapsConfig", {      
        googlePlacesAPIKey:     "YOUR_API_KEY_GOES_HERE"
});

```

Killer. One down, one more to go. 
In addition to Google Maps, this project also utilizes Firebase as it's database management system. 
Go to [firebase](https://firebase.google.com/) and set up a new account. Click on `GO TO CONSOLE` at the top of the screen to create your project account. Go ahead and import your existing google project that we just created from the maps API. This will take you to the overview page. 
Click the red button towards the middle right `</>` to add Firebase to the application. This will give you some specific values that we will be using to access our database. From this screen.. Go ahead and copy the below code into FBConfig.js using your personal values instead.


```
"use strict";

app.constant("FBCreds", {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL"    
});
```

Awesome! Just a couple more things and you will be all finished. To begin reading and writing to your database, you will also need to set up a few options in your Firebase config. Returning to your Firebase console, click the `Database` tab to the left, then choose the `RULES` tab at the top. Go ahead and copy and replace the current rules JSON with the following script!

```
{
  "rules": {
    ".read": "true",
    ".write": "true",
    "users": {
        ".indexOn": ["uid", "firstName", "lastName", "userName"]
      },
    "fieldJournal": {
        ".indexOn": ["uid"]
    }
  }
}
```

And lastly.. Choose the `Authentication` tab to the left of your firebase console. Select `SIGN-IN METHOD` towards the top of the screen.
You want to enable Email/Password provider, as well as Google. 

And there you have it!! Your app should now be up and running:)


## Built With

* [AngularJs](https://angularjs.org/) - The web framework used
* [npm](https://www.npmjs.com/) - Dependency Management
* [Grunt](https://gruntjs.com/) - Task Manager
* [Firebase](https://firebase.google.com/) - Database 

## Acknowledgments

* Inspiration - Coffee, always coffee.

