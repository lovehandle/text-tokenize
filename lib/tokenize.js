var _ = require('underscore')

// Include underscore string inflections lib

_.mixin( require('underscore.inflections') );

var STOP_WORDS = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'except', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'];

var BREAKS     = /[\s\/\-\xa0]/g;
var STOPS      = /,\s+/g;
var START_JUNK = /^[\s\;\:\,\.\!\?\(\)\"\'…“”‘’]+/;
var END_JUNK   = /[\s\;\:\,\.\!\?\(\)\"\'…“”‘’]+$/;
var EXCEPTS    = /(except.+)/g

// Text operations

function clean (text) {
  return text.replace(EXCEPTS, '');
}

function typecast (obj) {
  if ( _(obj).isObject() || _(obj).isArray() ) {
    return _(obj).map(typecast).join(' ');
  } else {
    return obj + ''; 
  }
}

// Text chunk operations

function normalize (chunk) {
  chunk = chunk || '';
  chunk = chunk.toLowerCase();
  chunk = chunk.replace('&nbsp;', ' ');
  chunk = chunk.replace('’', '\'');
  chunk = chunk.replace(START_JUNK, '');
  chunk = chunk.replace(END_JUNK, '');
  return chunk;
}

function validate (chunk) {
  return chunk !== '' && STOP_WORDS.indexOf(chunk) == -1;
}

function singularize (chunk) {
  return _.singularize(chunk);
}

function union () {
  var result = '';
  for (var i = 0; i < arguments.length; i++) {
    if (i > 0) result = result + ' ';
    result = result + arguments[i];
  }
  return result;
}


// Tokenize operation

function tokenize (text) {

  // Ensure that we're working with text

  text = typecast(text);

  // Remove except clauses

  text = clean(text);

  // Split text into chunks

  var chunks = text.split(BREAKS);

  // Begin tokenization

  var singles = [], pairs = [], triplets = [];

  for (i = 0; i < chunks.length; i++) {
    var j = i + 1, k = j + 1;

    var a = normalize(chunks[i]);

    if (validate(a)) {
      singles.push(a);
      singles.push(singularize(a))

      if (j < chunks.length) {
        var b = normalize(chunks[j]);
        if (validate(b)) {
          pairs.push(union(a,b))
          pairs.push(union(singularize(a),singularize(b)));

          if ( k < chunks.length) {
            var c = normalize(chunks[k]);
            if (validate(c)) {
              triplets.push(union(a,b,c))
              triplets.push(union(singularize(a),singularize(b), singularize(c)));
            }
          }
        }
        
      }

    }
  }

  return _.union(singles, pairs, triplets);
}

module.exports = tokenize;

