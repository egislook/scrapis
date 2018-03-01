function scrapis(schemas, jQ, root){
  jQ = jQ || $;
  var data = {};

  for(var key in schemas){
    data[key] = getValues(schemas[key], root)
  }

  return data;

  function getValues(schema, elem){
    schema = cloneSchema(schema);

    // if its structural object
    if(schema.constructor === Object && !schema.selector)
      return scrapis(schema, jQ, elem);
    // it can be object or array of schemas
    schema = schema.selector && schema || {
      selector:  typeof schema === 'string' && schema   || schema.shift(),
      functions: !schema.length && ['text']     || schema.filter(function(fn){ return typeof fn === 'string' }),
      children:  typeof schema !== 'string' && schema.find(function(fn){ return typeof fn === 'object' }),
    };

    // splits function values if they have arguments
    schema.functions = schema.functions.map(function(fn){ return fn.indexOf(':') && fn.split(':') }); //.map(v => v.split(','))
    // get selector or finds the element
    var nm = schema.selector;
    schema.selector = elem ? jQ(elem).find(schema.selector) : jQ(schema.selector);
    if(!schema.selector.length){
      console.warn('elem "' + nm + '" can not be found');
      return nm;
    }
    // gets the value using functions
    elem = schema.functions.length
      ? schema.functions.reduce(reducer, schema.selector)
      : schema.selector;
    // returns childless value
    if(!schema.children)
      return elem;
    // gets deeper children values
    return jQ.map
      ? jQ.map(elem, function(el){ return scrapis(schema.children, jQ, el) })
      : jQ(elem).map(function(i, el){ return scrapis(schema.children, jQ, el) }).get()
  }

  function reducer(val, fn){
    var fnName = fn[0];
    var fnArgs = fn[1];
    if(fnName === 'slice' && parseInt(fnArgs) > 0)
      return val[fnName](0, fnArgs);
    if(fnName === 'text' && typeof window === 'object')
      return val[0] && val[0].textContent;
    return val[fnName](fnArgs)
  }

  function cloneSchema(schema){
    if(typeof schema === 'string')
      schema = schema.split(',').map(function(v){ return v.trim() });
    if(schema instanceof Object)
      return JSON.parse(JSON.stringify(schema));
    if(schema instanceof Array)
      return schema.filter();
    return schema;
  }
}

if(typeof module === 'object')
  module.exports = scrapis;
