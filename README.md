# Red Ducks
### Ultra lightweight global state management for React 16.8+
---------

### Using Hooks and Context API, Red Ducks is able to provide global state management, with 0 dependecies in an ultralight weight package.
**DISCLAIMER:** React 16.8 is a **REQUIRED** peer depency

Get it from [npm](https://www.npmjs.com/package/red-ducks)
## Getting Started
---------
### Setting Up You Store

Red Ducks state is immutable and uses reducer functions to create the new state. These reducer functions, along with the initial state, is all done in your models. 

```js
export const snackBar = {
  initialState: {
    message: "",
    remove: false
  },
  reducers: {
    setMessage: (state,  payload) => ({
      ...state,
      message: payload.message
    }),
    setRemove: (state, payload) => ({
      ...state,
      remove: payload.remove
    })
  }
};
```
This is an example snackBar model. In this model, there is a value for `message` and a value for `remove`. 
#### Initial State
The initial value for these properties is set in the `initialState`. Here the initial state for `message` is `""` and the initial state for `remove` is `false`. These are the values set when the app first loads.
#### Reducers
In order to change state, `reducer` functions are defined. In this example, the first reducer function is `setMessage`. This function receives two arguments, `state` and the `payload`. The `payload` is an object with what ever data is needed to update state. `state` is the current state. These functions need to return the ENTIRE state for this model. So that means when updating `message`, you must also retain the value of `remove`. This is why the current state is spread (`...state`).
#### Creating the Store
Models should be scoped to a single context. That is why there will likely be several models in each app. We collect them all in a single store.

```js
import { snackBar } from "./SnackBar";
import { profile } from "./Profile";
import { route } from "./Route";

export default {
  snackBar,
  profile,
  route
};
```
---------
### Initialiazing GlobalStateProvider
The GlobalStateProvider component wraps your entire app so that it can provider the global state to any descendent component that needs it.

```js
import { init } from "red-ducks";
import store from "./store/";

const GlobalStateProvider = init(store);
const App = _ => {
  return (
    <GlobalStateProvider>
      <Content />
    </GlobalStateProvider>
  );
};

export default App;
```

Start by importing the `init` function from `red-reducks`. Send the `store` created above to the `init` function. This will return the `GlobalStateProvider` component.

---------
### Reading from State
**DISCLAIMER:** Reading from state **MUST** be done inside a component. Attempting to read from state in any non component function will result in a Hooks error.

```js
import { state } from "red-ducks";

export const SnackBar = _ => {
  const { snackBar: { remove, message } } = state();
```
Reading from state is very simple. Import the `state` function from `red-ducks`. Call the `state` function inside your component, and that will return the entire global state. You can destructure just the model and properties needed, and then can be used how ever you need. Since Red Ducks uses Context, your component will update if the global state updates. No need for `mapStateToProps` or any other HOC function.

---------
### Updating State (simplified style)
**DISCLAIMER:** Updating from state **MUST** be done inside a component. Attempting to update state in any non component function will result in a Hooks error.

```js
import { state, dispatch } from "red-ducks";

export const SnackBar = _ => {
  const { snackBar: { remove, message } } = state();
  const { snackBar: { setRemove, setMessage } } = dispatch();
  if (!remove) {
    setRemove({ remove: true});
  }
```
Import the `dispatch` function from `red-ducks`. Call the `dispatch` function inside your component, and that will return all the disptachers. You can destructure just the model and reducer functions needed. Then simply call the function with your desired payload. In this example, if `remove` is `false` then we will update it to `true` by calling
```js 
setRemove({ remove: true });
```
---------
### Updating State (classic style)
**DISCLAIMER:** Updating from state **MUST** be done inside a component. Attempting to update state in any non component function will result in a Hooks error.

```js
import { state, dispatch } from "red-ducks";

export const SnackBar = _ => {
  const { snackBar: { remove, message } } = state();
  if (!remove) {
    dispatch({ type: 'snackBar/setRemove', payload: { remove: true }});
  }
```
Import the `dispatch` function from `red-ducks`. When you need to update state, call `dispatch` with the `type` and `payload`. The `type` is the model name `/` reducer function name.

## Debugging
---------
On every state change, Red Ducks will console log the changes. You will see the value of the state before the update, the action that was dispatched, as well as the state after the update

```js
'action snackBar/setMessage Sat Feb 23 2019 13:29:49 GMT-0500 (Eastern Standard Time)'
prev state {snackBar: {…}, profile: {…}, route: {…}}
action {type: {…}, payload: {…}}
next state {snackBar: {…}, profile: {…}, route: {…}}
```