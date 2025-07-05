import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// appConfig typically contains providers, routing, and other setup needed for bootstrapping the app. It's passed as the second argument to bootstrapApplication.
import { AppComponent } from './app/app.component';
//AppComponent is the main UI component that Angular renders when the app starts.

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
//bootstraping refers to the starting or initialising the application, it tells appliaction to which component to load first and what cofiguration to use.
/*This function is used to manually bootstrap an Angular application in standalone mode, without using NgModules.*/
/*Purpose: Bootstraps the Angular application using the root component and configuration.
What it does:
AppComponent is the entry point of the UI.
appConfig provides necessary setup like dependency injection and routing.
.catch(...) handles any errors that occur during the bootstrapping process and logs them to the console.*/
/*This is the main entry point for a standalone Angular application (introduced in Angular v14+), which simplifies app setup by removing the need for NgModule.*/
