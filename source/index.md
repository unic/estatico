<style>
	.sg--home .sg__styleguide {
		display: flex;
		align-items: center;
	}

	blockquote{
		display:block;
		background: #fff;
		padding: 15px 20px 15px 55px;
		position: relative;

		/*Font*/
		font: italic 400 2.5em/1.2 "Publico Headline Web", Georgia, "Times New Roman", Times, serif;
		color: #000;

		/*Box Shadow - (Optional)*/
		-moz-box-shadow: 2px 2px 15px #ccc;
		-webkit-box-shadow: 2px 2px 15px #ccc;
		box-shadow: 2px 2px 15px #ccc;

		/*Borders - (Optional)*/
		border-left-style: solid;
		border-left-width: 15px;
		border-right-style: solid;
		border-right-width: 2px;

		border-left-color: rgba(164, 196, 0, 0.8);
		border-right-color: #a4c400;
	}
	
	blockquote:before{
		content: "\201C"; /*Unicode for Left Double Quote*/
	
		/*Font*/
		font-family: Georgia, serif;
		font-size: 60px;
		font-weight: bold;

		/*Positioning*/
		position: absolute;
		left: 10px;
		top:5px;
	}

	blockquote:after{
		/*Reset to make sure*/
		content: "";
	}

	blockquote a {
		border-bottom: 1px solid;
		text-decoration: none;
		cursor: pointer;
		padding: 0 3px;
		color: #a4c400;
		transition: color .3s
	}

	blockquote a:hover{
		color: #3a4ecc;
	}

	blockquote em {
		font-style: italic;
	}
</style>

> Estático is an open source static build system created with love at *[Unic AG](https://unic.com)* and crafted together with the community with the purpose of creating static and modular sites, systems, styleguides and/or design systems.
