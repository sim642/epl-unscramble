epl-unscramble
==============
**epl-unscramble** on Eesti Päevalehe (EPL) tasuliste artiklite dešifreerija. Selleks ei kasuta antud süsteem mitte midagi rohkemat kui infot ainult sellelt leheküljelt, millel paikeb artikli algus ja ülejäänud "udu". Lisaks kasutab süsteem vaid üht lihtsat eesti keele sõnade nimekirja ning kuna sellega töötlemine nõuab olulist ressurssi, siis tehakse põhiline dešifreerimine ära serveri poolel.

Story
-----
See lugu sai alguse kunagi ammu-ammu. Sattusin ühele EPL-e artiklile ja ei saanud seda tervikult lugeda, aga nägin pikka "udukogu" selle koha peal, kus tekst peaks olema. Kursorit sellest üle liigutades märkasin üht huvitavat asjaolu: esialgu oleksin arvanud, et tegemist on lihtsalt pildiga, kuid kursor näitas, et seal peaks nagu olema selekteeritav tekst. Proovin selekteerida, aga nagu midagi poleks muutunud. Aga oletasin, et selekteerisin mingi lõigu ja kopeerisin selle ning kleepisin mujale. Oh seda imet, ongi mingi tekst! Kasutasin brauseris olevat *Inspect element* funktsionaalsust, et vaadata, mis lehel toimub ning selgus, et seal oligi mingi tekst ning see "udu" oli vaid visuaalselt peale genereeritud. Aga kahjuks (või EPL-e õnneks) polnud see loetav eesti keel. Samas neid sõnu lugedes jäi mulje, et oleks nagu võimalik midagi välja lugeda. Sellest väikesest tähelepanekust ilmneski, et igas sõnas on tähed lihtsalt kuidagi ümber järjestatud.

Loomulikult oleks olnud äärmiselt tülikas üritada ise neist uuesti õigeid sõnu kokku panna, aga meil on ju arvutid. Seega ma kirjutasingi esialgu ühe väikse programmi, mis eesti keele sõnade nimekirjast (ei ole enam kindel, kust ma selle saanud olen) otsis sõnad, mis sisaldasid täpselt samu tähti ja leidis võimalikud originaalsõna kandidaadid. Neist valis välja kõige sagedamini esineva lootuses, sest tõenäosus, et just see on õige antud juhul, on suurim. Et seda protsessi praktilisemaks teha, kirjutasingi väikese veebiteenuse, millega selline töötlus oleks ühe kliki kaugusel.

Kuidas kasutada?
----------------
Igaühel on võimalus ise proovida ja veenduda, et epl-unscramble suht-koht toimib. Selleks piisab ainult ühe brauseri järjehoidja (*bookmark'i*) kasutamisest. 

### Sammude kaupa
1. Lohista järgnev link oma brauseri järjehoidjate ribale: 
[epl-unscramble](javascript:%28function%20%28%29%20{var%20s%20=%20document.createElement%28'script'%29;s.setAttribute%28'src',%20'http://epl-unscramble.herokuapp.com/browser.js'%29;document.body.appendChild%28s%29;}%28%29%29;).
2. Ava mõni EPL tasuline artikkel, mida sooviksid dešifreerida täismahus lugemiseks. Näiteks: [Obama visiit toob kaasa ajaloo kõige karmimad turvanõuded](http://epl.delfi.ee/news/eesti/obama-visiit-toob-kaasa-ajaloo-koige-karmimad-turvanouded.d?id=69551183).
3. Kliki just järjehoidjate ribale lisatud "epl-unscramble"-il ja mõne hetke möödudes ilmubki tavapärase "udu" asemele loetav tekst!

Ja täpselt nii lihtne see ongi, kusjuures kui see järjehoidja on juba olemas, siis pole vaja edaspidi muud teha, kui lihtsalt EPL-e artiklit lugedes sellel klikkida.

Kuidas see töötab?
------------------
epl-unscramble järjehoidjal klikkides toimuvad järgmised asjad:

1. Järjehoidjas olev Javascript kood käivitub ning laeb serverist alla pikema koodijupi ja käivitab selle.
2. Serverile saadetakse järgnev info:
  * Artikli alguses olev lühike loetav tekstijupp, milles leiduvat sõnavara kasutatakse lisaks serveris olevale sõnade nimistule
  * Artikli "udu" taga peituv šifreeritud tekst. Šifreeritus tähendab EPL-e jaoks igas sõnas eraldi tähtede suvalist ümberjärjestamist ja just see tähelepanek ongi epl-unscramble'i toimimise aluseks.
3. Server töötleb saadud šifreeritud teksti sõnakaupa:
  * Iga sõna jaoks otsitakse eesti keelsete sõnade nimekirjast kõik sellised sõnad, mis sisaldavad samu tähti, aga ükskõik millises järjekorras.
  * Kuna antud sõnade nimistu sisaldab ka iga sõna esinemissagedust, siis valitakse leitud võimalikest originaalse sõna ümberjärjestuste kandidaatidest välja lihtsalt kõike enam esinev, mis muidugi pole alati see õige, kuid kõige suurema tõenäosusega osutub siiski õigeks.
  * Pärast originaalsõna kindlakstegemist asendatakse see sõna algsesse teksti.
4. Kui kogu tekst on töödeldud, saadetakse dešifreeritud tekst tagasi brauserile, mis selle kuvab ning lehelt "udu" eemaldab.

