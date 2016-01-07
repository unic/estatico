## Description

Example setup for media:imageversions gulp task

To have versions of an image created automatically, a config file "imageversions.js" is required in the same folder
as original image.

Config may look like this:

```
module.exports = {
	'george.jpg': [
		'100x50',
		{
			size: '100x50',
			focusPoint: '400,400'
		},
		{
			size: '600x300'
		},
		{
			size: '600x300',
			focusPoint: '0,400'
		},
		{
			width: 300
		},
		{
			height: 200
		},
		150
	]
};
```

Where 'george.jpg' is a filename of original image to generate crops from.

Each crop can be defined in one of the following formats:
- a size string, like '100x50'
```
'100x50'
```
- an object, containing size and optionally focusPoint properties (focus point has to be specified as coordinates on original, not resized image)
```
{
	size: '100x50',
	focusPoint: '400,400'
}
```
- an object, containing just width or just height property
```
{
	width: 300
}
or
{
	height: 200
}
```
- a number (which would be interpreted as a desired width)
```
150
```

Special thanks to [george2legs](https://www.instagram.com/george2legs/?hl=en) for a test image.