build.py is the script that creates the files needed for different editions that use javascript and
html (like the on-line edition). It has some quirks you must be aware of in order to use it
correctly:

The main file you edit is called main.html (lower case if you're on an os in which that matters,
basically, anything but Windows) and the following rules must be followed:
* You have a script area surrounded by <pwm-script></pwm-script> and a body area surrounded by
<pwm-body></pwm-body>
	* Yes, you treat them like tags, and must type exactly as shown
	* Don't have the tags share a line, the script may skip one.
* In the script area, you use lower case for the script tags (<script></script> not
<SCRIPT></SCRIPT>)
	* You only use the attributes type and src, and type should only be "text/javascript". When a
	template is creating a file with the scripts in-lined, it will only use the type attribute in
	the output, so all other attributes will be lost!
	* When writing in-line scripts (bad habit BTW), the part inside the script tags should be
	enclosed with '<!-- // --><![CDATA[' and '//]]>' so that an inline output will not break.
	* Scripts in the body area will never be in-lined. That's a really bad habit to include scripts
	in that area anyway.

The template files just need a <pwm-body/> and either a <pwm-iscript/> for all
<script src="..."></script> tags to be in-lined, or a <pwm-script/> for a direct copy of the script
area.

When ran, the build script will look for different files to use as a template for output files. Near
the top of the file is a line like 'templates = []'. Just edit the list if you are adding a new
output (as well as adding the file to SVN). The way this script uses this varible is that it adds
'.html' for each item, read the file and write to build/<name>/passwordmaker.html
