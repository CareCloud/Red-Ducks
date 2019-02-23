var React = require("react");
var useReducer = React.useReducer;
var useMemo = React.useMemo;
var GlobalContext = React.createContext({});
module.exports.state = function() { return React.useContext(GlobalContext).state };
module.exports.dispatch = function() { return React.useContext(GlobalContext).dispatch };
module.exports.init = function(models) {
  var initialState = Object.keys(models).reduce(function(acc, item) {
    var result = Object.assign({}, acc);
    result[item] = models[item].initialState;
    return result;
  }, {});
  var rootReducer = function(currentState, actionDispatched) {
    var model = actionDispatched.type.split('/')[0];
    var action = actionDispatched.type.split('/')[1];
    var payload = actionDispatched.payload;
    var reducerResult = Object.assign({}, currentState);
    reducerResult[model] = models[model].reducers[action](currentState[model], payload);
    console.log('action ' + model + '/' + action + ' ' + new Date());
    console.log("%c prev state", "color: #959494; font-weight: bold", currentState);
    console.log("%c action", "color: #009FF2; font-weight: bold", {
      type: { model: model, action: action },
      payload: payload
    });
    console.log("%c next state", "color: #43A547; font-weight: bold", reducerResult);
    return reducerResult;
  };
  var rematchify = function(dispatch) {
    return Object.keys(models).reduce(function(acc, model) {
      acc[model] = Object.keys(models[model].reducers).reduce(function(acc, action) {
        var result = Object.assign({}, acc);
        result[action] = function(payload) {
          return dispatch({
            type: model + '/' + action ,
            payload: payload
          });
        };
        return result;
      }, {});
      return acc;
    }, dispatch);
  };
  return function(props) {
    var reducer = useReducer(rootReducer, initialState);
    var value = useMemo(function(){
      return { value: { state: reducer[0], dispatch: rematchify(reducer[1]) }}
    }, [reducer[0]]);
    return React.createElement(GlobalContext.Provider, value, props.children);
  };
}