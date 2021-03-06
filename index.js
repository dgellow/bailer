/*global module*/

module.exports.validate = function validate(obj, rules) {
  // If there is no rules passed in parameters, do nothing.
  if (!rules || Object.keys(rules).length === 0) {
    return null;
  }

  var errors = [].reduce.call(Object.keys(rules), function(accErrors, attribute) {
    var attrRules = rules[attribute],
        lastRule = attrRules[attrRules.length - 1],
        customMessage = typeof lastRule === "string" ? lastRule: null;

    // If there is no rules for the current attribute, do nothing.
    if (!attrRules || attrRules.length === 0)  {
      return accErrors;
    }

    // If there is a custom message, remove it from the array of
    // rules as it is not a function
    if (customMessage) {
      attrRules.pop();
    }

    var validations = [].reduce.call(attrRules, function(accValidations, rule) {
      var validation = rule(obj, attribute);
      if (validation) {
        accValidations.push(validation);
      }
      return accValidations;
    }, []);

    if (validations.length > 0) {
      accErrors[attribute] = customMessage ? [customMessage] : validations;
    }

    return accErrors;
  }, {});

  // If `errors` is an empty object, return null instead.
  return Object.keys(errors).length > 0 ? errors: null;
};

module.exports.validations = {};

module.exports.validations.required = function required(obj, attributeName) {
  var attr = obj[attributeName];
  return (attr !== undefined && attr !== null) ? null :
    "".concat(attributeName, " must be present");
};

module.exports.validations.email = function email(obj, attributeName) {
  var emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(obj[attributeName]) ? null:
    "".concat(attributeName, " is not a valid email address");
};

var type = module.exports.validations.type = function type(t, obj, attributeName) {
  return typeof obj[attributeName] === t ? null :
    "".concat(attributeName,  " must be a ", t);
};

module.exports.validations.number = type.bind(null, "number");
module.exports.validations.string = type.bind(null, "string");
module.exports.validations.object = type.bind(null, "object");
