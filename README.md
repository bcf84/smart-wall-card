# Smart Wall Card

Wanddisplay-Dashboard für Home Assistant im Stil „Smart Wall“: Startseite mit Hinweis-Blasen,
Licht, Steckdosen, Heizung, Rollos, Haushalt (inkl. Geräte-Popups), Kalender, Media, Sicherheit,
Einkauf, Server, Einstellungen, Post & Pakete (DHL).

Installation über den Marketplace (Typ *Dashboard/Plugin*). Danach Karte `custom:smart-wall-card`.

## Konfigurations-Kurzschreibweisen
- `map` / `status_map`: `"leer|OK"` statt `{on: leer, off: OK}`
- in `nav_alerts`: `"@lights"`, `"@plugs"`, `"@covers"`, `"@windows"`, `"@climate_temps"`
  übernehmen die Entitäten aus der übrigen Konfiguration.

## Entwicklung
`src/` enthält die Quellen, `npm run build -- <version>` erzeugt `dist/smart-wall-card.js`
(eine minifizierte Datei, Schrift Open Sans lokal in `dist/`). `npm test` vergleicht alte und neue Ausgabe.
