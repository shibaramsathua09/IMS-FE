/*The app.component.ts file defines the root component of your Angular application. 
It’s the entry point of your UI — the first component that gets loaded and displayed when your app starts.*/
/*It’s the starting point of your app’s UI.
It usually contains the router outlet (<router-outlet>) where other components are loaded.
It can hold global layout elements like the header, footer, or sidebar.*/
/*This imports the component decorator from angular
A decorator is a special method that add meta data to a class.
*/
import { Component } from '@angular/core';


/*This imports RouterOutlet, which is a directive used to display routed components.
It acts like a placeholder in your HTML where Angular will inject the component based on the current route.
🧠 Why?
To enable routing — so when the user navigates to /login, /home, etc., the correct component appears inside this layout.*/
import { RouterOutlet } from '@angular/router';

/*This is the decorator that defines metadata for the component.
selector:'app-root'
*/
@Component({
  /* selector: 'app-root'
This defines the custom HTML tag for this component.
You’ll see <app-root></app-root> in index.html.
🧠 Why?
It tells Angular where to render this component in the DOM.*/
  selector: 'app-root',

  /* imports: [RouterOutlet]
This is part of Angular's standalone component setup.
It tells Angular that this component uses RouterOutlet inside its template.
🧠 Why?
To allow routing inside this component without needing a module.*/
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Insurance Management System';
}
/*🧩 What is a Decorator in Angular?
A decorator is a special function in TypeScript that adds metadata to a class, 
method, property, or parameter. In Angular, decorators tell Angular how to treat a class or element.
@component: marks a class as component
@injectable:marks a class as service that can be injectable
@NgModule: Defines an angular module 
@Directive make a class as directive



🧩 What is a Directive in Angular?
A directive is a class that adds behavior to elements in the DOM. It can change how elements look, behave, or interact.

✅ Types of Directives
Component – A directive with a template (like AppComponent)
Structural Directive – Changes the DOM structure (e.g., *ngIf, *ngFor)
Attribute Directive – Changes the appearance or behavior of an element (e.g., ngClass, ngStyle)
<div *ngIf="isLoggedIn">Welcome!</div>
*/
