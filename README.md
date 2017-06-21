# lettering

Type text in HTML document.

## Demo

## Installation

```bash
npm install --save lettering
```

or

```bash
yarn add lettering
```

## Usage

### Basic

```html
<body>
  <div class="text">first sentence</div>
</body>

<script src="path/to/lettering.min.js"></script>
<script>
  var lettering = new Lettering('.text');
</script>
```

Once you construct a new object, you get the control of text inside element.

The text in the element will start type automatically.

**Note:** Child Nodes inside the element will be ignored, only text typed.

### Also available for input placeholder

try this:

```html
<body>
  <input class="text" placeholder="placeholder" />
</body>

<script src="path/to/lettering.min.js"></script>
<script>
  var lettering = new Lettering('.text');
</script>
```

## Configration

```javascript
var lettering = new Lettering(elment, options)
```

### element

- type: `string` or `HTMLElement`

- required: `true`

- default: `undefined`

**Note:** Will throw a new Error if not provided.

### options

- type: `object`

- required: `false`

#### fps

- - type: `number`

- - default: `15`

Controls speed, means character per second, if set to 1, render one character every one second, set to 2, render two every second, and so on...

#### autoStart

- type: `boolean`

- default: `true`

Will involk type() function, and start to type.

#### caretShow

- type: `boolean`

- default: `true`

Control if blinking caret shows.

#### caretContent

- type: `string`

- default: `|`

The caret shows after the typing text.

#### caretClassName

- type: `string`

- default: `lettering-caret`

The css class of caret, you can set to your own class name to control it.

## API

You can control type behavior yourself via api

### typins()

```javascript
lettering.typing();
```

### backspace()

```javascript
lettering.backspace()
```

### updateContent(string)

The content will backspace and type again;

```javascript
var newString = 'new string'

lattering.updateContent(newString);
```

## Custom Events

Two custom events provided:

- afterTyping: after text typed.

- afterBackspace: after text deleted.

### addListener()

```javascript
var lettering = new Lettering(element);

// will be invoked after typing the text
lettering.addListener('afterTyping', function(){
  // every time text typed, log done
  console.log('done');
})

// will be invoked after delete the text
lettering.addListener('afterBackspace', function(){
  // every time text typed, log back
  console.log('back');
})
```

### once()

The function you bind will involke only once.

```javascript
var lettring = new Lettering(element);

lettering.once('afterTyping', function(){
  // will be logged only one time
  console.log('typed');
})
```

## test

test with mocha

```bash
git clone https://github.com/nichenqin1001/lettering.git
```

then open test/index.html file

## MIT LICENSE

MIT License

Copyright (c) 2017 倪晨钦

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
