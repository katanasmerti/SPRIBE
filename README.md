## Starting the App

Run `npm i` to install dependencies first, and then run `ng s` to start the app.

In my opinion it is better to avoid using ControlValueAccessor here, because it is important to monitor and manage the state of all FormGroups at once, which is much better handled by a typed FormArray control.
