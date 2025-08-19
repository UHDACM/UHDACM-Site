# PersonTile
A component that packages a person's information in a reusable and convenient UI component.

This component has two parts:
- A clickable tile that displays a picture, some title, and subtitle
- An overlay that displays a picture, some title, some subtitle, a description, and a list of social buttons (LinkedIn, Instragram, etc.)

## dependencies
- lucide-react

## props
|prop|description|
|--|--|
|tileStyle|Used to override the existing style of the tile|
|PreviewTitleStyle|Used to override the existing style of the tile's title|
|PreviewSubTitleStyle|Used to override the existing style of the tile's subtitle|
|img|The img source of the tile.|
|previewTitle|The title on the tile|
|previewSubTitle|The subtitle on the tile|
|fullTitle|The title on the overlay|
|fullSubTitle|The subtitle on the overlay|
|fullDescription|The full description on the overlay|
|socials|A list of socials displayed on the overlay. An array of `PersonTileSocial`|

## Types
|type|description|
|--|--|
|PersonTileSocial|Specifies properties of a person-tile social icon. See `PersonTileSocial` in PersonTile. Supports icons of type `SocialSite`|
|SocialSite|See `SocialSite` in PersonTile. List of useable icons. (e.g.: linkedIn, facebook, etc...)|