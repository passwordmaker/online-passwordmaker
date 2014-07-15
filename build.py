""" Reads main.html and creates
"""
import os
import sys
import re

templates = ['offline', 'online']
def do_template(in_data, template, outfile):
	""" Process a template for the use of converting a bare-bones html version into the on-line and off-line editions
	
	id_date - dict {'script':string, 'body':string}
		A dictionary which has a key 'script' for what to enter in the script area, and a key 'body'
		for what to enter in the body area of the template.
	template - string
		The file that will act as a template for the output. This file must include the strings
		(exactly as in the quotes) "<pwm-body/>" and either "<pwm-iscript/>" for scripts that will
		be inlined into a single <script></script> or "<pwm-script/>" to copy the input as is.
	outfile - string
		The file that this function will write to.
	"""
	try:
		tf = open(template, 'r')
	except IOError:
		print 'Error opening "' + template + '" for reading'
		return
	try:
		of = open(outfile, 'w')
	except IOError:
		tf.close()
		print 'Error opening "' + outfile + '" for writing'
		return
	
	sTag = '<pwm-script/>'
	iTag = '<pwm-iscript/>'
	bTag = '<pwm-body/>'
	try:
		for line in tf:
			index = line.find(sTag)
			if index != -1:
				s = line[:index] + data['script'] + line[(len(sTag) + index):]
				line = s
				
			index = line.find(iTag)
			if index != -1:
				s = line[:index] + data['iscript'] + line[(len(iTag) + index):]
				line = s
				
			index = line.find(bTag)
			if index != -1:
				s = line[:index] + data['body'] + line[(len(bTag) + index):]
				line = s
			of.write(line)
	finally:
		tf.close()
		of.close()
	tf.close()
	of.close()

# Read the input file
in_script = in_body = False
sTag = '<pwm-script>'
seTag = '</pwm-script>'
bTag = '<pwm-body>'
beTag = '</pwm-body>'
data = {'script':'', 'iscript':'', 'body':''}
try:
	f = open('main.html', 'r')
except IOError:
	print "Can't file the input file."
	sys.exit(1)
try:
	for line in f:
		if in_script:
			# Search for </pwm-script>
			index = line.find(seTag)
			if index != -1:
				s = line[:index]
				data['script'] += s
				in_script = False
			else:
				data['script'] += line
		elif in_body:
			# Search for </pwm-body>
			index = line.find(beTag)
			if index != -1:
				s = line[:index]
				data['body'] += s
				in_body = False
			else:
				data['body'] += line
		else:
			# Search for <pwm-script> or <pwm-body> and start inserting the data into the right parts when found
			index = line.find(sTag)
			if index != -1:
				#Found the start of the script stuff
				s = line[(len(sTag) + index):]
				in_script = True
				data['script'] += s
			index = line.find(bTag)
			if index != -1:
				#Found the start of the script stuff
				s = line[(len(bTag) + index):]
				in_body = True
				data['body'] += s
finally:
	f.close()

# trim newlines
data['script'] = data['script'].strip()
data['body'] = data['body'].strip()

srcFind = re.compile('src=(?:"|\')(.+?)(?:"|\')', re.I)
# handle inline scripts
oscript = str(data['script']) # Ensures a copy
nscript = '' # inlined version of the script
while oscript.find('<script') > -1:
	src = oscript[:oscript.find('>')]
	oscript = oscript[oscript.find('>')+1:].strip()
	src = srcFind.search(src)
	nscript += '<script type="text/javascript">'
	if src:
		nscript += '<!-- // --><![CDATA[\n'
		file = src.group(1)
		try:
			f = open(file, 'r')
			nscript += '// ' + file + '\n\n'
			try:
				nscript += f.read() + '//]]></script>\n'
			finally:
				f.close()
		except IOError:
			print 'Error reading', file
	else:
		nscript += oscript[:oscript.find('</script>')+9]
		oscript = oscript[oscript.find('</script>')+9:].strip()
	if oscript.find('</script>') == 0:
		oscript = oscript[9:].strip()
nscript += oscript
data['iscript'] = re.compile(r'//[ \t]*]]>\s*</script>\s*<script type="text/javascript">\s*<!--[ \t]*//[ \t*]-->[ \t]*<!\[CDATA\[', re.I).sub('\n',  nscript)

# Loop through the list and call the function for each pair, checking that the output exists first
for output in templates:
	d = "build/" + output
	if (not os.path.exists(d)):
		os.makedirs(d)
	d = d + "/passwordmaker.html"
	do_template(data, output + ".html", d)

print 'Done.'