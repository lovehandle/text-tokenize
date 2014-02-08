text-tokenize
==========

A text tokenizer module for converting blocks of text into keywords

## Installation

```
npm install text-tokenize
```

## Usage

```
tokenize = require('text-tokenize');
str = 'Four score and seven years ago our fathers brought forth';
tokenize(str);
#=>[
  'four',
  'score',
  'seven',
  'years',
  'year',
  'ago',
  'fathers',
  'father',
  'brought',
  'forth',
  'four score',
  'seven years',
  'seven year',
  'years ago',
  'year ago',
  'fathers brought',
  'father brought',
  'brought forth',
  'seven years ago',
  'seven year ago',
  'fathers brought forth',
  'father brought forth'
]
```

## Contributing

  * Fork the project.
  * Make your feature addition or bug fix.
  * Add tests for it. This is important so I don't break it in a future version unintentionally.
  * Commit, do not mess with version (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
  * Send me a pull request. Bonus points for topic branches.
