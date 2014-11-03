# [PROJECT NAME] [YEAR]

[SHORT DESCRIPTION]


---


## LINKS

* Code repository: [URL]
* Jira: [URL]
* Jenkins: [URL]
* Preview server: [URL]
* Design: [URL]
* IA: [URL]


---


## DEVELOPERS

* [NAME / SHORT NAME] [YEAR]


---


## DOCUMENTATION

### Setup / Usage

See ```docs/Setup_and_Usage.md```

### Coding Guidelines

See ```docs/Coding_Guidelines.md```


---


## REQUIREMENTS

### Browser support

#### Level 1

Gründliches Testing, hohe Priorität von Bugs, Vermeidung von Inkonsistenzen im Rendering (sofern dies ohne Nebenwirkungen für andere Browser gewährleistet werden kann).

Desktop:

* Internet Explorer: die zwei aktuellsten Version zum Zeitpunkt der Entwicklung (Stand 13. Oktober 2014: Version 10 und 11)
* Chrome: aktuellste Version zum Zeitpunkt der Entwicklung (Stand 13. Oktober 2014: Version 38)
* Firefox: aktuellste Version zum Zeitpunkt der Entwicklung (Stand 13. Oktober 2014: Version 32)
* Safari (Mac): aktuellste Version zum Zeitpunkt der Entwicklung (Stand 13. Oktober 2014: Version 7)

Mobile (mehrere Geräte pro OS):

* iOS (Smartphone und Tablet): aktuellste Version zum Zeitpunkt der Entwicklung, getestet wird Safari (Stand 13. Oktober 2014: Version 8)
* Android (Smartphone und Tablet): aktuellste Version zum Zeitpunkt der Entwicklung, getestet werden der «Stock-Browser» sowie Chrome (Stand 13. Oktober 2014: Version 4)

#### Level 2

Grundlegendes Testing, geringe Priorität von Bugs, welche die Grundfunktionalität der Seite nicht beeinflussen (beispielsweise Inkonsistenzen im Rendering).

Desktop:

* Internet Explorer: Version 9

Mobile (minimale Anzahl Geräte):

* iOS (Smartphone und Tablet): zweitneuste Version zum Zeitpunkt der Entwicklung, getestet wird Safari (Stand 13. Oktober 2014: Version 6)
* Android (Smartphone und Tablet): zweitneuste Version zum Zeitpunkt der Entwicklung, getestet werden der «Stock-Browser» sowie Chrome (Stand 13. Oktober 2014: Version 2)

#### Vorgehen

Beim Start der Entwicklung wird eine detaillierte Device-Liste mit spezifischen Versionen vorgeschlagen und abgenommen. Gibt es während des Projektverlaufs automatische Updates obiger Browser, muss diese Liste aktualisiert werden.

Die Priorisierung von Bugs wird gemeinsam vorgenommen. Konkret ist es nicht unbedingt sinnvoll, eine Menge Ressourcen für die Behebung eines Problems in einem spezifischen Stock-Browser auf Android aufzuwenden, da diese Zeit dafür eingesetzt werden könnte, die UX für sämtliche User zu verbessern.


### Accessibility

Es wird WCAG 2.0 Level AA angestrebt.
