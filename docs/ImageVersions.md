## Description

Example setup for media:imageversions gulp task

To have versions of an image created automatically, a config file "imageversions.js" is required in the same folder 
as original image.

Config may look like this:

```
module.exports = {
	'george.jpg' : [
		{
			size: '100x50',
			focusPoint: '750,750'
		},
		{
            size: '100x50'
        }
		{
			size: '800x400',
			focusPoint: '750,750'
		},
		'800x400'
	]
};
```

Where 'george.jpg' is a filename of original image to generate crops from.
Each crop can be a size string, like '100x50' or an object, containing size and optionally focusPoint configuration, 
like:

```
{
	size: '100x50',
	focusPoint: '750,750'
}
```

Focus point has to be specified as coordinates on original (not resized) image. 
