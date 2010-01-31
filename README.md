# Mikrob 0.1

## Polski

*Uwaga* - ten projekt jest natury bardzo eksperymentalnej. Interfejs użytkownika na pewno ulegnie zmianie.

Mikrob jest zbudowany w oparciu o [Titanium firmy Appcelerator](http://appcelerator.com) i jest Bogatą Aplikacją Internetową na Twoim Pulpicie.

{ech} Chodzi o to, że jest to zwykła aplikacja - dokładnie jak twoja przeglądarka czy klient IM, ale ja miałem o wiele więcej frajdy piszą ją bo użyłem tylko CSS3, HTML i Javascript. Nie ma ani jednej linii kodu napisanej w C/C++/Java

Fajnie.

Jeśli jesteś użytkownikiem Windowsa i chcesz mieć ładne powiadomienia na pulpicie - [Snarl](http://www.fullphat.net/) będzie twoim przyjacielem. Osobiście zalecam użycie [Growl for Windows](http://www.growlforwindows.com/) wraz z pluginem [Snarly](http://blog.growlforwindows.com/2009/05/growl-snarl-gnarly.html) - Snarl lubi kraść focus aktywnego okna, Growl jest bardziej przyjazny.

Jeśli używasz OSX potrzebujesz [Growl](http://growl.info) - ale z pewnością go już masz.

Użytkownicy Linuxa nie musza nic robić oprócz działającej instalacji libnotify.

Wszelkie informacje odnośnie oficjalnego wydania aplikacji oraz nowych funkcjach itd można znaleźć bezpośrednio [u mnie na blipie](http://plugawy.blip.pl). Warto także obserwować [mikrobowego bota na blipie](http://mikrob.blip.pl).

### Jak tego używać

By wysłać wiadomość po prostu pacnij Enter. Możesz też skracać linki by zaoszczędzić na znakach - serwis [rdir](http://rdir.pl) jest używany jako usługa do skracania.

Cytowane statusy możesz przejrzeć klikając na `[Blip]` (możesz je potem przejrzeć w przeglądarce albo samemu zacytować).

Paginacja działa mniej więcej tak jak na stronie www blipa (choć czasami może się spsuć).

### Oprócz blipa....

Mikrob wspiera także [Flaker.pl](http://flaker.pl) - obecnie pracuję nad 100% wsparciem dla tego serwisu (oraz oczywiście `blip.pl`).

### Credit, where credit's due

Ikony: [http://dryicons.com](http://dryicons.com)

Logo/ikona/maskotka/nowy interfejs: [^joszko](http://joszko.blip.pl)

### Progress
* Blip.pl 90% (brak subskrybowania oraz wysyłania plików graficznych)
* Flaker.pl 50% (brak subskrybcji, wysyłania oraz pobierania informacji nt. załączonych obrazków we flaknięciach)
* Twitter.com 10% - pobieranie subskrybcji oraz wysyłanie nowych tweetów

### TODO

* 100% wsparcie API Blip.pl (i kompatybilnych)
* 100% wsparcie API Flaker.pl
* 100% wsparcie API Twitter.com (i kompatybilnych)
* Implementacja nowego interface'u by [^joszko](http://joszko.blip.pl)
* Squash all bugz!


### Pobocznie

W trakcie tworzenia Mikroba stworzyłem 2 biblioteki, które mogą być użyteczne - `HttpConnector` oraz `DatabaseConnector`.


#### HttpConnector

Jest to wrapper dla klasy `Titanium.Network.httpClient`, który jest wygodniejszy w obsłudze niż standardowy `XMLHttpRequest`. Więcej informacji można znaleźć w samym kodzie klasy oraz dedkowanym jej testom jednostkowym

#### DatabaseConnector

Jest to wrapper dla klasy `Titanium.Databse`. `DatabaseConnector` jest luźno wzorowany na `ActiveRecord` i innych ORMach. Obecnie współpracuje tylko z bazą danych wspieraną przez Titanium, ale implementacja wsparcia dla HTML5/localStorage jest trywialna i spodziewana już niedługo ;-)

Więcej informacji można znaleźć w samym kodzie klasy oraz dedkowanym jej testom jednostkowym

## English

If you aren't a Polish speaking person - probably you won't find Mikrob useful, sorry.

Mikrob is built using [Appcelerator's Titanium](http://appcelerator.com) and as such represents the so called Rich Internet Applications on the Desktop.

{sigh} Basically it means that it works just like any other application you have now opened, but I had more fun writting it because I used CSS3, HTML and Javascript. No single line of C/C++/Java.

Sweet.

If you are a Windows user and want to get those neat-looking notifications on your desktop, get [Snarl](http://www.fullphat.net/index.php). Better yet - I suggest you get [Growl for Windows](http://www.growlforwindows.com/) along with [Snarly plugin](http://blog.growlforwindows.com/2009/05/growl-snarl-gnarly.html). Snarl likes to steal focus of your active window, and Growl is more friendly.

If you are on OSX [Growl](http://growl.info) is your best bet - but probably you have it already.
