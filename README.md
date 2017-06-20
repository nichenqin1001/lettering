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

### autoStart

- type: `boolean`

- default: `true`

Will involk type() function, and start to render.

## API

You can control type behavior yourself via api

### typins()

```javascript
lettering.typing();
```

### backspace()

### updateContent(string)

## Custom Events

### addListener()

Two custom events provided:

```javascript
var lettering = new Lettering(element);

// will be invoked after typing the text
lettering.addListener('afterTyping', function(){
  console.log('done');
})

// will be invoked after delete the text
lettering.addListener('afterBackspace', function(){
  console.log('back');
})
```

### once()

The function you bind will involke only once.
