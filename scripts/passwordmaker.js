var passwdMaster, passwdUrl, passwdGenerated,
  passwdLength, protocolCB, domainCB, subdomainCB, pathCB, leetLevelLB,
  ifSaveMasterPassword, saveMasterBtn, hashAlgorithmLB, whereLeetLB, usernameTB, counter,
  passwordPrefix, passwordSuffix, charMinWarning,
  tipsWnd, userCharsetValue, ifHidePasswd, ifSavePreferences, preUrl;

var base93="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";\'<>?,./";
var base16="0123456789abcdef";

function init() {
  if (typeof otherOnLoadHandler == "function")
    otherOnLoadHandler();
  passwdMaster = document.getElementById("passwdMaster");
  saveMasterBtn = document.getElementById("saveMasterBtn");
  passwdUrl = document.getElementById("passwdUrl");
  passwdGenerated = document.getElementById("passwdGenerated");
  passwdLength = document.getElementById("passwdLength");
  domainCB = document.getElementById("domainCB");
  protocolCB = document.getElementById("protocolCB");
  subdomainCB = document.getElementById("subdomainCB");
  pathCB = document.getElementById("pathCB");
  leetLevelLB = document.getElementById("leetLevelLB");
  hashAlgorithmLB = document.getElementById("hashAlgorithmLB");
  whereLeetLB = document.getElementById("whereLeetLB");
  usernameTB = document.getElementById("usernameTB");
  counter = document.getElementById("counter");
  passwordPrefix= document.getElementById("passwordPrefix");
  passwordSuffix = document.getElementById("passwordSuffix");
  charMinWarning = document.getElementById("charMinWarning");
  ifHidePasswd = document.getElementById("ifHidePasswd");
  ifSavePreferences = document.getElementById("ifSavePreferences");
  preUrl = document.getElementById("preURL");

  // load the default profile
  loadProfile();

  // load the global preferences (preferences not unique to any profile)
  loadGlobalPrefs();

  if (whereLeetLB.options.selectedIndex > -1) {
    // for IE at load time
  	onWhereLeetLBChanged();
    preGeneratePassword();
  }
  populateURL(); // in case passwdUrl.value is using document.location instead of cookie value, this calculates the correct URL
	passwdMaster.focus();
}

// Loads a certain profile.
function loadProfile() {
  var profileIndex = document.getElementById("profileLB").selectedIndex;
  var selectedProfile = document.getElementById("profileLB").options[profileIndex].text;

  var a = unescape(getCookie(escape(selectedProfile)));
  var settingsArray = a.split("|");
  
  preUrl.value = (settingsArray[0] == undefined || settingsArray[6] == undefined) ? "" : unescape(settingsArray[0]);
  passwdLength.value = (settingsArray[1] == undefined || settingsArray[1] == undefined) ? "8" : settingsArray[1];
  protocolCB.checked = (settingsArray[2] == undefined || settingsArray[2] == undefined) ? false : settingsArray[2] == "true";
  domainCB.checked = (settingsArray[3] == undefined || settingsArray[3] == undefined) ? true : settingsArray[3] == "true";
  subdomainCB.checked = (settingsArray[4] == undefined || settingsArray[4] == undefined) ? false : settingsArray[4] == "true";
  pathCB.checked = (settingsArray[5] == undefined || settingsArray[5] == undefined) ? false : settingsArray[5] == "true";
  passwdUrl.value = (settingsArray[6] == undefined || settingsArray[6] == undefined) ? "" : unescape(settingsArray[6]);
  leetLevelLB.value = (settingsArray[7] == undefined || settingsArray[7] == undefined) ? "0" : settingsArray[7];
  hashAlgorithmLB.value = (settingsArray[8] == undefined || settingsArray[8] == undefined) ? "md5" : settingsArray[8];  
  whereLeetLB.value = (settingsArray[9] == undefined || settingsArray[9] == undefined) ? "off" : settingsArray[9];
  usernameTB.value = (settingsArray[10] == undefined || settingsArray[10] == undefined) ? "" : unescape(settingsArray[10]);
  counter.value = (settingsArray[11] == undefined || settingsArray[11] == undefined) ? "" : unescape(settingsArray[11]);
  EditableSelect.setValue(document.getElementById("charset"), (settingsArray[12] == undefined || settingsArray[12] == undefined) ? base93 : unescape(settingsArray[12]));
  passwordPrefix.value = (settingsArray[13] == undefined || settingsArray[13] == undefined) ? "" : unescape(settingsArray[13]);
  passwordSuffix.value = (settingsArray[14] == undefined || settingsArray[14] == undefined) ? "" : unescape(settingsArray[14]);

  preGeneratePassword();
}

// Load the list of profiles into the dropdown box.
function loadProfileList() {
}

function getIndexOfValue(lb, value) {
  // Find the index of the option to select
  for (var i=0; i<lb.options.length; i++) {
    if (lb[i].value == value)
      return i;
  }
  return 0; // can't find it!
}

function preGeneratePassword() {
  var charIndex = document.getElementById("charset").selectedIndex;
  if(document.getElementById("charset").options[charIndex].value == "")
    var selectedChar = document.getElementById("charset").options[charIndex].text;
  else
    var selectedChar = document.getElementById("charset").options[charIndex].value;

   // Never *ever, ever* allow the charset's length<2 else
   // the hash algorithms will run indefinitely
   if (selectedChar.length < 2) {
     passwdGenerated.value = "";
     charMinWarning.style.display = "block";
     return;
   }
   charMinWarning.style.display = "none";
   try {
     var hashAlgorithm = hashAlgorithmLB.options[hashAlgorithmLB.options.selectedIndex].value;

     var whereToUseL33t = whereLeetLB.options[whereLeetLB.options.selectedIndex].value;
     var l33tLevel = leetLevelLB.options[leetLevelLB.options.selectedIndex].value;
   }
   catch (e) {return;}

   if (!document.getElementById("charset").disabled)
      userCharsetValue = selectedChar; // Save the user's character set for when the hash algoritm does not specify one.

   if (hashAlgorithm == "md5_v6" || hashAlgorithm == "hmac-md5_v6") {
      EditableSelect.setValue(document.getElementById("charset"), base16);
      document.getElementById("charset").disabled = true;
   }
   else {
      EditableSelect.setValue(document.getElementById("charset"), userCharsetValue);
      document.getElementById("charset").disabled = false;
   }
   
   // Calls generatepassword() n times in order to support passwords
   // of arbitrary length regardless of character set length.
   var password = "";
   var count = 0;
   while (password.length < passwdLength.value) {
     // To maintain backwards compatibility with all previous versions of passwordmaker,
     // the first call to _generatepassword() must use the plain "key".
     // Subsequent calls add a number to the end of the key so each iteration
     // doesn't generate the same hash value.
     password += (count == 0) ?
       generatepassword(hashAlgorithm, passwdMaster.value,
         passwdUrl.value + usernameTB.value + counter.value, whereToUseL33t, l33tLevel,
         passwdLength.value, selectedChar, passwordPrefix.value, passwordSuffix.value) :
       generatepassword(hashAlgorithm, passwdMaster.value + '\n' + count, 
         passwdUrl.value + usernameTB.value + counter.value, whereToUseL33t, l33tLevel,
         passwdLength.value, selectedChar, passwordPrefix.value, passwordSuffix.value);
     count++;
   }
     
   if (passwordPrefix.value)
     password = passwordPrefix.value + password;
   if (passwordSuffix.value)
     password = password.substring(0, passwdLength.value-passwordSuffix.value.length) + passwordSuffix.value;
   passwdGenerated.value = password.substring(0, passwdLength.value);
}
  
function generatepassword(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {

  // for non-hmac algorithms, the key is master pw and url concatenated
  var usingHMAC = hashAlgorithm.indexOf("hmac") > -1;
  if (!usingHMAC)
    key += data; 

  // apply l33t before the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "before-hashing") {
    key = PasswordMaker_l33t.convert(l33tLevel, key);
    if (usingHMAC) {
      data = PasswordMaker_l33t.convert(l33tLevel, data); // new for 0.3; 0.2 didn't apply l33t to _data_ for HMAC algorithms
    }
  }

  // apply the algorithm
  var password = "";
  switch(hashAlgorithm) {
    case "sha256":
      password = PasswordMaker_SHA256.any_sha256(key, charset);
      break;
    case "hmac-sha256":
      password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, true);
      break;
	case "hmac-sha256_fix":
	  password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, false);
	  break;
    case "sha1":
      password = PasswordMaker_SHA1.any_sha1(key, charset);
      break;
    case "hmac-sha1":
      password = PasswordMaker_SHA1.any_hmac_sha1(key, data, charset);
      break;
    case "md4":
      password = PasswordMaker_MD4.any_md4(key, charset);
      break;
    case "hmac-md4":
      password = PasswordMaker_MD4.any_hmac_md4(key, data, charset);
      break;
    case "md5":
      password = PasswordMaker_MD5.any_md5(key, charset);
      break;
    case "md5_v6":
      password = PasswordMaker_MD5_V6.hex_md5(key, charset);
      break;
    case "hmac-md5":
      password = PasswordMaker_MD5.any_hmac_md5(key, data, charset);
      break;
    case "hmac-md5_v6":
      password = PasswordMaker_MD5_V6.hex_hmac_md5(key, data, charset);
      break;
    case "rmd160":
      password = PasswordMaker_RIPEMD160.any_rmd160(key, charset);
      break;
    case "hmac-rmd160":
      password = PasswordMaker_RIPEMD160.any_hmac_rmd160(key, data, charset);
      break;
  }
  // apply l33t after the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "after-hashing")
    return PasswordMaker_l33t.convert(l33tLevel, password);
  return password;
}

function populateURL() {
  //var temp = location.href.match("([^://]*://)([^/]*)(.*)");
  temp = preUrl.value.match("([^://]*://)?([^:/]*)([^#]*)");
  if (!temp) {
	temp = ['','','','']; // Helps prevent an undefine based error
  }
  var domainSegments = temp[2].split(".");
  while (domainSegments.length < 3) {
	domainSegments.unshift(''); // Helps prevent the URL from displaying undefined in the URL to use box
  }
  var displayMe = '';
  var displayMeTemp= protocolCB.checked ? temp[1] : ''; // set the protocol or empty string

  if (subdomainCB.checked) {
	  // The subdomain is all domainSegments
	  // except the final two.
	  for (var i=0; i<domainSegments.length-2;i++) {
	    displayMe += domainSegments[i];
        // Add a dot if this isn't the final subdomain
	    if (i+1 < domainSegments.length-2)
		  displayMe += ".";
	  }			
  }

  if (domainCB.checked) {
	  if (displayMe != "" && displayMe[displayMe.length-1]  != ".")
	    displayMe += ".";
      displayMe += domainSegments[domainSegments.length-2] + "." + domainSegments[domainSegments.length-1];
  }
  displayMe = displayMeTemp + displayMe;

  if (pathCB.checked)
	  displayMe += temp[3];

  passwdUrl.value = displayMe;	  
  preGeneratePassword();
}

function onWhereLeetLBChanged() {
  leetLevelLB.disabled = whereLeetLB.options[whereLeetLB.options.selectedIndex].value == "off";
}

function saveProfile() {
  var profileIndex = document.getElementById("profileLB").selectedIndex;
  var selectedProfile = document.getElementById("profileLB").options[profileIndex].text;

  if(selectedProfile=="profileList" || selectedProfile=="globalPrefs")  //user can't name a profile profileList!!
  {
	  alert("Sorry, you cannot name your profile 'profileList'. Please pick another name.");
  } else
  {
  // Set cookie expiration date
  var expires = new Date();
  // Fix the bug in Navigator 2.0, Macintosh
  fixDate(expires);
  // Expire the cookie in 5 years
  expires.setTime(expires.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

  setCookie(escape(selectedProfile), exportPreferences(), expires);

  // Is this profile in the "profileList" cookie? If not, add it.
  if(!in_array(selectedProfile, profileListArray))
  {
    profileListArray.push(escape(selectedProfile));
    setCookie("profileList", escape(profileListArray.join('|')), expires);
  }
  }
}

function deleteProfile() {
  var profileIndex = document.getElementById("profileLB").selectedIndex;
  var selectedProfile = document.getElementById("profileLB").options[profileIndex].text;

  // Delte the cookie for the profile
  deleteCookie(escape(selectedProfile));

  // Remove it from profileListArray and write it to the profileList cookie
  index = in_array(escape(selectedProfile), profileListArray, true);
  profileListArray.splice(index, 1);

  var expires = new Date();
  fixDate(expires);
  expires.setTime(expires.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

  setCookie("profileList", escape(profileListArray.join('|')), expires);

  if(profileListArray.length==0)
    deleteCookie("profileList");

  document.location = document.location;
}

function exportPreferences() {
  var charIndex = document.getElementById("charset").selectedIndex;
  var selectedChar = document.getElementById("charset").options[charIndex].text;

  var prefs = preUrl.value + "|" +
  passwdLength.value + "|" +
  protocolCB.checked + "|" +
  domainCB.checked + "|" +
  subdomainCB.checked + "|" +
  pathCB.checked + "|" +
  escape(passwdUrl.value) + "|" +
  leetLevelLB.value + "|" + 
  hashAlgorithmLB.value + "|" +
  whereLeetLB.value + "|" +
  escape(usernameTB.value) + "|" +
  escape(counter.value) + "|" +
  escape(selectedChar) + "|" +
  escape(passwordPrefix.value) + "|" + 
  escape(passwordSuffix.value);

  // Double-escaping allows the pipe character to be part of the data itself
  return escape(prefs);
}

function saveGlobalPrefs() {
	var prefs = ifSaveMasterPassword + "|"
	+ ifHidePasswd.checked + "|";
	if (ifSaveMasterPassword) {
		var key = makeKey();
		// Encrypt the master pw for browsers like Firefox 1.0,which store
		// cookies in plain text.
		prefs += escape(key) + "|" +
		escape(byteArrayToHex(rijndaelEncrypt(passwdMaster.value, hexToByteArray(key), "CBC")));
	}

	// Set cookie expiration date
	var expires = new Date();
	// Fix the bug in Navigator 2.0, Macintosh
	fixDate(expires);
	// Expire the cookie in 5 years
	expires.setTime(expires.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

	setCookie("globalPrefs", escape(prefs), expires);
}

function loadGlobalPrefs() {
	var a = unescape(getCookie("globalPrefs"));
	var settingsArray = a.split("|");

	ifSaveMasterPassword = (settingsArray[0] == undefined) ? false : settingsArray[0] == "true";
	if(ifSaveMasterPassword)
		saveMasterBtn.value="Clear saved master password";

	ifHidePasswd.checked = (settingsArray[1] == undefined) ? false : settingsArray[1] == "true";
	if(ifHidePasswd.checked==true)
		passwdGenerated.style.color='#ffffff';
	else
		passwdGenerated.style.color='#0000ff';

	if (settingsArray[2] != undefined && settingsArray[3] != undefined) {
		// Decrypt the encrypted master pw
		passwdMaster.value = byteArrayToString(rijndaelDecrypt(hexToByteArray(unescape(settingsArray[3])), 
		hexToByteArray(unescape(settingsArray[2])), "CBC"));
	}
}

function saveMaster() {
	if(ifSaveMasterPassword)
	{
		// If we're currently saving the password, we want to clear it.
		//Hence, we want to give the user the option to save the password again.
		saveMasterBtn.value="Save master password";
		ifSaveMasterPassword = false;
		passwdMaster.value="";
	}
	else
	{
		saveMasterBtn.value="Clear saved master password";
		ifSaveMasterPassword = true;
	}

	saveGlobalPrefs();
}

// Make a pseudo-random encryption key... emphasis on *pseudo*
var hex = ['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f'];
var keySz = keySizeInBits/4; //keySizeInBits defined in aes.js
function makeKey() {
  var ret = "";
  while (ret.length < keySz) 
    ret += hex[Math.floor(Math.random()*15)];
  return ret;
}

function onClickTips() {
  if (tipsWnd != null && !tipsWnd.closed)
    tipsWnd.focus();
  else
	// Check for if we're running from passwordmaker.org (or the SourceForge address) and use the following line instead)
    //tipsWnd = window.open("tips.html", "tipsWnd", "width=600,length=50,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
    tipsWnd = window.open("", "tipsWnd", "width=500,length=100,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
    tipsWnd.document.write("<div class='title'>Tips</div><p>The characters field contains the list of characters used in generating this password.<br/><br/>Here are some tips to follow when selecting characters:<br/><br/><ul><li>If you require passwords compatible with PasswordMaker 0.6 and before, you must use<b>0123456789abcdef</b></li><br/><li>A minimum of two characters is required</li><br/><li>Characters can be repeated</li><br/><li>Using the same character more than once causes that character to appear more often in the generated password</li><br/><li>The more unique characters that are specified, the greater the variety of characters in the generated password</li><br/><li>The order of the characters affects what is generated! Using <b>0123456789abcdef</b> creates different passwords<br/>than using <b>abcdef0123456789</b></li><br/><li>You can specify non-English characters like those with <a href='http://en.wikipedia.org/wiki/Diacritic'>diacritical marks</a> (e.g., &#226;, &#229;, &#231;),<a href='http://en.wikipedia.org/wiki/Diaeresis'>diaeresis marks</a>,(e.g., &#252;, &#228;, &#235;),<br/><a href='http://en.wikipedia.org/wiki/Ligature_%28typography%29'>ligature marks</a>,(e.g., &#198;, &#0339;, &#223;),non-alphanumeric characters and symbols (e.g., &#169; &#0174; &#8471; !@#$%^&amp;*(){};), etc. If a<br/>character you desire does not appear on your keyboard,don't fret. Most every Western character can be created by<br/>typing ALT-, OPTION-, or CTRL-code key sequences. The key sequences vary by operating system. For example,<br/>typing ALT+0222 in Windows (numbers must be typed on the numeric keypad) yields the Icelandic upper-case Thorn<br/>character: <b>&#xfe;</b>.</li></ul></p></div></div></div></div></div></body></html>");
    tipsWnd.document.close();
}

function addEvent(obj, evType, fn){
	if (obj.addEventListener){
		obj.addEventListener(evType, fn, true);
		return true;
	} else if (obj.attachEvent){
		var r = obj.attachEvent("on"+evType, fn);
		return r;
	} else {
		return false;
	}
} 

// simple array search function.
// If returnIndex==true, returns the index of the found item or false if the item is not found
// else, returns true/false.
function in_array(needle, haystack, returnIndex) {
	var n = haystack.length;
	for (var i=0; i<n; i++) {
		if (haystack[i]==needle) {
			if(returnIndex==true)
				return i;
			else
				return true;
		}
	}
	return false;
}

if (window.addEventListener){
	window.addEventListener('load', init, false);
} else if (window.attachEvent){
	window.attachEvent('onload', init);
} else {
	var otherOnLoadHandler=window.onload;
	onload=init;
}
