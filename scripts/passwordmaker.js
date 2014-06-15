var passwdMaster, passwdUrl, passwdGenerated,
  passwdLength, protocolCB, domainCB, subdomainCB, pathCB, leetLevelLB,
  ifSaveMasterPassword, saveMasterBtn, hashAlgorithmLB, whereLeetLB, usernameTB, counter,
  passwordPrefix, passwordSuffix, charMinWarning,
  tipsWnd, userCharsetValue, ifHidePasswd, ifSavePreferences, preUrl;

var base93="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";\'<>?,./";
var base16="0123456789abcdef";

// List of top-level domains, parsed from domains.rdf from the PasswordMaker
// Firefox version.
var TOPLEVELDOMAINS = {
  "aland.fi":1, "wa.edu.au":1, "nsw.edu.au":1, "vic.edu.au":1, "csiro.au":1,
  "conf.au":1, "info.au":1, "oz.au":1, "telememo.au":1, "sa.edu.au":1,
  "nt.edu.au":1, "tas.edu.au":1, "act.edu.au":1, "wa.gov.au":1, "nsw.gov.au":1,
  "vic.gov.au":1, "qld.gov.au":1, "sa.gov.au":1, "tas.gov.au":1, "nt.gov.au":1,
  "act.gov.au":1, "archie.au":1, "edu.au":1, "gov.au":1, "id.au":1, "org.au":1,
  "asn.au":1, "net.au":1, "com.au":1, "qld.edu.au":1, "com.bb":1, "net.bb":1,
  "org.bb":1, "gov.bb":1, "agr.br":1, "am.br":1, "art.br":1, "edu.br":1,
  "com.br":1, "coop.br":1, "esp.br":1, "far.br":1, "fm.br":1, "g12.br":1,
  "gov.br":1, "imb.br":1, "ind.br":1, "inf.br":1, "mil.br":1, "net.br":1,
  "org.br":1, "psi.br":1, "rec.br":1, "srv.br":1, "tmp.br":1, "tur.br":1,
  "tv.br":1, "etc.br":1, "adm.br":1, "adv.br":1, "arq.br":1, "ato.br":1,
  "bio.br":1, "bmd.br":1, "cim.br":1, "cng.br":1, "cnt.br":1, "ecn.br":1,
  "eng.br":1, "eti.br":1, "fnd.br":1, "fot.br":1, "fst.br":1, "ggf.br":1,
  "jor.br":1, "lel.br":1, "mat.br":1, "med.br":1, "mus.br":1, "not.br":1,
  "ntr.br":1, "odo.br":1, "ppg.br":1, "pro.br":1, "psc.br":1, "qsl.br":1,
  "slg.br":1, "trd.br":1, "vet.br":1, "zlg.br":1, "nom.br":1, "ab.ca":1,
  "bc.ca":1, "mb.ca":1, "nb.ca":1, "nf.ca":1, "nl.ca":1, "ns.ca":1, "nt.ca":1,
  "nu.ca":1, "on.ca":1, "pe.ca":1, "qc.ca":1, "sk.ca":1, "yk.ca":1, "com.cd":1,
  "net.cd":1, "org.cd":1, "ac.cn":1, "com.cn":1, "edu.cn":1, "gov.cn":1,
  "net.cn":1, "org.cn":1, "ah.cn":1, "bj.cn":1, "cq.cn":1, "fj.cn":1,
  "gd.cn":1, "gs.cn":1, "gz.cn":1, "gx.cn":1, "ha.cn":1, "hb.cn":1, "he.cn":1,
  "hi.cn":1, "hl.cn":1, "hn.cn":1, "jl.cn":1, "js.cn":1, "jx.cn":1, "ln.cn":1,
  "nm.cn":1, "nx.cn":1, "qh.cn":1, "sc.cn":1, "sd.cn":1, "sh.cn":1, "sn.cn":1,
  "sx.cn":1, "tj.cn":1, "xj.cn":1, "xz.cn":1, "yn.cn":1, "zj.cn":1, "co.ck":1,
  "org.ck":1, "edu.ck":1, "gov.ck":1, "net.ck":1, "ac.cr":1, "co.cr":1,
  "ed.cr":1, "fi.cr":1, "go.cr":1, "or.cr":1, "sa.cr":1, "eu.int":1, "ac.in":1,
  "co.in":1, "edu.in":1, "firm.in":1, "gen.in":1, "gov.in":1, "ind.in":1,
  "mil.in":1, "net.in":1, "org.in":1, "res.in":1, "ac.id":1, "co.id":1,
  "or.id":1, "net.id":1, "web.id":1, "sch.id":1, "go.id":1, "mil.id":1,
  "war.net.id":1, "ac.nz":1, "co.nz":1, "cri.nz":1, "gen.nz":1, "geek.nz":1,
  "govt.nz":1, "iwi.nz":1, "maori.nz":1, "mil.nz":1, "net.nz":1, "org.nz":1,
  "school.nz":1, "aid.pl":1, "agro.pl":1, "atm.pl":1, "auto.pl":1, "biz.pl":1,
  "com.pl":1, "edu.pl":1, "gmina.pl":1, "gsm.pl":1, "info.pl":1, "mail.pl":1,
  "miasta.pl":1, "media.pl":1, "nil.pl":1, "net.pl":1, "nieruchomosci.pl":1,
  "nom.pl":1, "pc.pl":1, "powiat.pl":1, "priv.pl":1, "realestate.pl":1,
  "rel.pl":1, "sex.pl":1, "shop.pl":1, "sklep.pl":1, "sos.pl":1, "szkola.pl":1,
  "targi.pl":1, "tm.pl":1, "tourism.pl":1, "travel.pl":1, "turystyka.pl":1,
  "com.pt":1, "edu.pt":1, "gov.pt":1, "int.pt":1, "net.pt":1, "nome.pt":1,
  "org.pt":1, "publ.pt":1, "com.tw":1, "club.tw":1, "ebiz.tw":1, "game.tw":1,
  "gov.tw":1, "idv.tw":1, "net.tw":1, "org.tw":1, "av.tr":1, "bbs.tr":1,
  "bel.tr":1, "biz.tr":1, "com.tr":1, "dr.tr":1, "edu.tr":1, "gen.tr":1,
  "gov.tr":1, "info.tr":1, "k12.tr":1, "mil.tr":1, "name.tr":1, "net.tr":1,
  "org.tr":1, "pol.tr":1, "tel.tr":1, "web.tr":1, "ac.za":1, "city.za":1,
  "co.za":1, "edu.za":1, "gov.za":1, "law.za":1, "mil.za":1, "nom.za":1,
  "org.za":1, "school.za":1, "alt.za":1, "net.za":1, "ngo.za":1, "tm.za":1,
  "web.za":1, "bourse.za":1, "agric.za":1, "cybernet.za":1, "grondar.za":1,
  "iaccess.za":1, "inca.za":1, "nis.za":1, "olivetti.za":1, "pix.za":1,
  "db.za":1, "imt.za":1, "landesign.za":1, "co.kr":1, "pe.kr":1, "or.kr":1,
  "go.kr":1, "ac.kr":1, "mil.kr":1, "ne.kr":1, "chiyoda.tokyo.jp":1,
  "tcvb.or.jp":1, "ac.jp":1, "ad.jp":1, "co.jp":1, "ed.jp":1, "go.jp":1,
  "gr.jp":1, "lg.jp":1, "ne.jp":1, "or.jp":1, "com.mx":1, "net.mx":1,
  "org.mx":1, "edu.mx":1, "gob.mx":1, "ac.uk":1, "co.uk":1, "gov.uk":1,
  "ltd.uk":1, "me.uk":1, "mod.uk":1, "net.uk":1, "nic.uk":1, "nhs.uk":1,
  "org.uk":1, "plc.uk":1, "police.uk":1, "sch.uk":1, "ak.us":1, "al.us":1,
  "ar.us":1, "az.us":1, "ca.us":1, "co.us":1, "ct.us":1, "dc.us":1, "de.us":1,
  "dni.us":1, "fed.us":1, "fl.us":1, "ga.us":1, "hi.us":1, "ia.us":1,
  "id.us":1, "il.us":1, "in.us":1, "isa.us":1, "kids.us":1, "ks.us":1,
  "ky.us":1, "la.us":1, "ma.us":1, "md.us":1, "me.us":1, "mi.us":1, "mn.us":1,
  "mo.us":1, "ms.us":1, "mt.us":1, "nc.us":1, "nd.us":1, "ne.us":1, "nh.us":1,
  "nj.us":1, "nm.us":1, "nsn.us":1, "nv.us":1, "ny.us":1, "oh.us":1, "ok.us":1,
  "or.us":1, "pa.us":1, "ri.us":1, "sc.us":1, "sd.us":1, "tn.us":1, "tx.us":1,
  "ut.us":1, "vt.us":1, "va.us":1, "wa.us":1, "wi.us":1, "wv.us":1, "wy.us":1,
  "com.ua":1, "edu.ua":1, "gov.ua":1, "net.ua":1, "org.ua":1, "cherkassy.ua":1,
  "chernigov.ua":1, "chernovtsy.ua":1, "ck.ua":1, "cn.ua":1, "crimea.ua":1,
  "cv.ua":1, "dn.ua":1, "dnepropetrovsk.ua":1, "donetsk.ua":1, "dp.ua":1,
  "if.ua":1, "ivano-frankivsk.ua":1, "kh.ua":1, "kharkov.ua":1, "kherson.ua":1,
  "kiev.ua":1, "kirovograd.ua":1, "km.ua":1, "kr.ua":1, "ks.ua":1, "lg.ua":1,
  "lugansk.ua":1, "lutsk.ua":1, "lviv.ua":1, "mk.ua":1, "nikolaev.ua":1,
  "od.ua":1, "odessa.ua":1, "pl.ua":1, "poltava.ua":1, "rovno.ua":1, "rv.ua":1,
  "sebastopol.ua":1, "sumy.ua":1, "te.ua":1, "ternopil.ua":1, "vinnica.ua":1,
  "vn.ua":1, "zaporizhzhe.ua":1, "zp.ua":1, "uz.ua":1, "uzhgorod.ua":1,
  "zhitomir.ua":1, "zt.ua":1, "ac.il":1, "co.il":1, "org.il":1, "net.il":1,
  "k12.il":1, "gov.il":1, "muni.il":1, "idf.il":1, "co.im":1, "org.im":1, "com.sg":1
};


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

// Given a list of domain segments like [www,google,co,uk], return the
// subdomain and domain strings (ie, [www, google.co.uk]).
function splitSubdomain(segments) {
    for (var i = 0; i < segments.length; ++i) {
        var suffix = segments.slice(i).join('.');
        if (TOPLEVELDOMAINS[suffix]) {
            var pivot = Math.max(0, i - 1);
            return [segments.slice(0, pivot).join('.'), segments.slice(pivot).join('.')];
        }
    }
    // None of the segments are in our TLD list. Assume the last component is
    // the TLD, like ".com". The domain is therefore the last 2 components.
    return [segments.slice(0, -2).join('.'), segments.slice(-2).join('.')];
}


function populateURL() {
  //var temp = location.href.match("([^://]*://)([^/]*)(.*)");
  temp = preUrl.value.match("([^://]*://)?([^:/]*)([^#]*)");
  if (!temp) {
	temp = ['','','','']; // Helps prevent an undefine based error
  }
  var splitDots = temp[2].split(".");
  while (splitDots.length < 3) {
      splitDots.unshift(''); // Helps prevent the URL from displaying undefined in the URL to use box
  }
  
  var domainSegments = splitSubdomain(splitDots);
  var displayMe = '';
  var displayMeTemp= protocolCB.checked ? temp[1] : ''; // set the protocol or empty string

  if (subdomainCB.checked) {
	displayMe += domainSegments[0];
	if ( domainSegments[0].length > 0 ) {
		displayMe += ".";
	}
  }

  if (domainCB.checked) {
	displayMe += domainSegments[1];
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
