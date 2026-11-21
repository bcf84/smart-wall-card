# Smart Wall Card

Ein komplettes Wanddisplay-Dashboard für Home Assistant in **einer** Karte:
links eine Menüleiste, oben ein großes Bild mit Begrüßung, darunter die jeweilige Seite.

Seiten: **Start** (Uhr, Termine, Hinweis-Blasen), **Licht**, **Steckdosen**, **Heizung/Klima**,
**Rollos & Fenster**, **Haushalt** (Geräte mit eigenen Popups), **Kalender**, **Musik/TV**,
**Sicherheit**, **Einkauf**, **Server**, **Einstellungen**, dazu **Post & Pakete** (DHL).

Alles ist optional: Was in der Konfiguration fehlt, wird einfach nicht angezeigt.

---

## 1. Installation

Voraussetzung: Home Assistant 2026.11 oder neuer (mit dem eingebauten Marketplace).
Bei älteren Versionen geht dasselbe über HACS.

1. **Einstellungen → Marketplace** öffnen.
2. Oben rechts **⋮ → Benutzerdefinierte Repositories**.
3. Repository `bcf84/smart-wall-card` eintragen, Typ **Dashboard**, hinzufügen.
4. „Smart Wall Card“ suchen und **Herunterladen**.
5. Browser einmal hart neu laden (**Strg + Umschalt + R**, am Mac **Cmd + Umschalt + R**).
   In der Companion-App: *Einstellungen → Companion App → Fehlerbehebung → Frontend-Cache zurücksetzen*.

Die Ressource (`/local/community/smart-wall-card/smart-wall-card.js`) trägt der Marketplace selbst ein.
Ein Neustart von Home Assistant ist **nicht** nötig.

## 2. Dashboard anlegen

1. **Einstellungen → Dashboards → Dashboard hinzufügen → Neues Dashboard von Grund auf**,
   Name z. B. „Smart Wall“.
2. Dashboard öffnen, **Stift (Bearbeiten) → ⋮ → Raw-Konfigurationseditor**.
3. Alles ersetzen durch:

```yaml
views:
  - title: Smart Wall
    path: home
    type: panel
    cards:
      - type: custom:smart-wall-card
        name: Max
        weather: weather.zuhause
```

4. Speichern. Das ist schon eine lauffähige Smart Wall mit Startseite und Wetter.
   Danach Schritt für Schritt weitere Bereiche ergänzen (siehe unten).

Für ein Wandtablet empfiehlt sich zusätzlich [kiosk-mode](https://github.com/NemesisRE/kiosk-mode),
damit Kopfzeile und Seitenleiste von Home Assistant verschwinden.

**Beispiele zum Kopieren:**
- [`examples/minimal.yaml`](examples/minimal.yaml) – Licht, Heizung, Rollos, Fenster, Einkauf
- [`examples/komplett.yaml`](examples/komplett.yaml) – fast alle Möglichkeiten

In den Beispielen sind alle Entitäten Platzhalter. Die eigenen Namen findest du unter
**Einstellungen → Geräte & Dienste → Entitäten** (Spalte „Entitäts-ID“).

---

## 3. Konfiguration

Die Karte hat keinen grafischen Editor, sie wird im YAML-Editor der Karte bzw. im
Raw-Konfigurationseditor eingerichtet. Einträge, die eine Liste von Entitäten erwarten,
nehmen entweder nur die ID (`light.flur`) oder ein Objekt mit Namen
(`{entity: light.flur, name: Flur}`).

### Allgemein

| Schlüssel | Bedeutung |
|---|---|
| `name` | Name in der Begrüßung („Guten Abend, Max“) |
| `weather` | Wetter-Entität für Startseite und Vorhersage |
| `calendars` | Liste von Kalendern für die Terminanzeige |
| `countdown_calendar` | Kalender für den Countdown-Kreis auf der Startseite (z. B. Müllabfuhr) |
| `todo` | Einkaufsliste (`todo.…`) |
| `start_page` | Seite beim Öffnen, z. B. `light` (Standard: Startseite) |
| `height` | Höhe der Karte, z. B. `100vh` (Standard: Bildschirmhöhe minus HA-Kopfzeile) |
| `ha_settings` | Knopf „Home Assistant“ unter „Einstellungen“ in der Menüleiste (nur für Admins). Standard: führt zu den HA-Einstellungen. Anderes Ziel: `ha_settings: /config/integrations`, ausblenden: `ha_settings: false` |

### Hintergrundbild

| Schlüssel | Bedeutung |
|---|---|
| `room_image` | Ein festes Bild, z. B. `/local/hintergrund.jpg` (Datei liegt in `/config/www/`) |
| `background_entity` | Optional: `input_select` zum Umschalten zwischen Bildern |
| `background_images` | Zuordnung Auswahl → Bild, z. B. `{Strand: /local/strand.jpg}` |

Am einfachsten: ein Bild nach `/config/www/` kopieren und `room_image` setzen.
Wählt der `input_select` die Option `Automatik`, sucht die Karte saisonale Bilder
(`/config/www/backgrounds/fruehling.avif`, `sommer`, `herbst`, `winter`, `ostern`, `halloween`, `weihnachten`).

### Licht und Steckdosen

```yaml
lights:
  - room: Wohnzimmer
    auto: input_boolean.lichtautomatik_wohnzimmer   # optional: Schalter „Automatik“
    entities:
      - entity: light.wohnzimmer      # Lichtgruppe → Regler „Alle“ dimmt nur Lampen, die an sind
        name: Alle
      - entity: light.wohnzimmer_decke
        name: Decke
    plugs:                            # erscheinen auf der Seite „Steckdosen“
      - entity: switch.fernseher
        name: TV
```

### Heizung und Klima

```yaml
climates:
  - entity: climate.wohnzimmer
    room: Wohnzimmer
    temperature: sensor.wohnzimmer_temperatur    # optional, sonst die des Thermostats
    humidity: sensor.wohnzimmer_luftfeuchtigkeit # optional
  - entity: climate.klimaanlage
    room: Wohnzimmer
    name: Klimaanlage
    hide_unavailable: true                       # ausblenden, wenn nicht erreichbar
airquality:                                      # optional, Luftreiniger/CO₂-Sensoren
  - name: Schlafzimmer
    icon: mdi:molecule-co2
    value: sensor.schlafzimmer_co2
    info:
      - {e: sensor.schlafzimmer_temperatur, l: Temperatur}
```

### Rollos und Fenster

```yaml
covers_all: cover.alle_rollos       # optional: Knopf „Alle“
covers:
  - room: Wohnzimmer
    entities:
      - {entity: cover.wohnzimmer_links, name: Links}
windows:
  - room: Wohnzimmer
    entities:
      - {entity: binary_sensor.wohnzimmer_fenster, name: Fenster}
```

### Haushalt (Geräte)

Jedes Gerät ist eine Kachel. Die wichtigsten Felder:

| Feld | Bedeutung |
|---|---|
| `name`, `icon` | Titel und Symbol (`mdi:…`) |
| `status` | Entität für die Statuszeile |
| `status_map` | Statuswerte übersetzen, z. B. `{idle: Bereit}` oder kurz `"an|aus"` |
| `value`, `value2` | große Zahl auf der Kachel |
| `power` | Ein/Aus-Schalter |
| `progress`, `remaining` | Fortschritt (%) und Restzeit |
| `program`, `programs`, `start`, `start_confirm` | Programmauswahl und Startknopf mit Rückfrage |
| `info` | Zusatzzeilen: `{e: entität, l: Beschriftung, map: …, warn: [zustände], warn_below: 15, warn_above: 90, u: Einheit}` |
| `actions` | Knöpfe: `{button: button.x, icon: play, label: Start}` oder `{service: vacuum.start, entity: vacuum.x, …}`, optional `confirm` |
| `popup` | großes Detail-Popup, `type`: `coffee`, `dishwasher`, `vacuum`, `airfryer`, `fridge` oder `stats` |
| `pop` | anderes Popup beim Tipp auf die Überschrift, z. B. `car0` für das erste Auto (siehe „Auto“) |
| `more` | Entität, deren Detailansicht ein Tipp auf die Überschrift öffnet (wenn es kein Popup gibt) |
| `batteries: 10` | Sonderkachel: listet alle Akkus unter 10 % |
| `battery_icon` | Akku als kleines Symbol in der Kopfzeile (wie Bluetooth), Prozent beim Darüberfahren; `battery_warn` (Standard 15) färbt es orange |

Die Popup-Typen sind auf bestimmte Integrationen zugeschnitten (Home Connect für Kaffeemaschine
und Geschirrspüler, Roborock für den Sauger). Wer andere Geräte hat, nimmt am besten
`type: stats` (Liste beliebiger Werte) oder lässt `popup` weg. Siehe `examples/komplett.yaml`.

### Musik und TV

```yaml
music:
  - name: Wohnzimmer
    entity: media_player.wohnzimmer
stations:                       # Radiosender (Music Assistant)
  - {name: Radio Beispiel, uri: library://radio/1, image: https://…/logo.png}
tv: [media_player.fernseher]
tv_extras: [light.tv_lightstrip]  # Licht, das neben dem TV angezeigt wird
```

### Sicherheit und Sonstiges

| Schlüssel | Bedeutung |
|---|---|
| `lock` | Türschloss |
| `door_opener`, `door_opener_name` | Skript für den Türöffner |
| `cameras` | `[{e: camera.flur, name: Flur}]` |
| `motion` | Bewegungsmelder `[{e: binary_sensor.flur_bewegung, name: Flur}]` |
| `modes` | Szenen-Knöpfe (Kommen/Gehen/Schlafen), siehe Beispiel |
| `tea` | `timer.…` – Tee-Timer erscheint als Blase auf der Startseite |
| `energy` | Solar/Netz/Hausverbrauch, siehe Beispiel |
| `pollen` | Pollenflug: `labels` und passende `sensors` |
| `traffic` | Verkehrsmeldungen: `lat`, `lon`, `radius` (km), `roads` (z. B. `[A9]`) |
| `servers` | Server-Kacheln wie Haushaltsgeräte (Status, Werte, Knöpfe) |

### Post und Pakete (DHL)

Funktioniert automatisch, wenn die Integration [ha-dhl-de](https://github.com/bcf84/ha-dhl-de)
installiert ist (Startseiten-Blase, Karte unter „Haushalt“, Briefbilder im Popup).
Ohne die Integration bleibt der Bereich unsichtbar. Abschalten mit `post: false`.

### Wetterwarnungen (DWD)

Mit der Integration *Deutscher Wetterdienst (DWD) Wetterwarnungen* erscheint bei einer Warnung
eine Blase in der Warnfarbe (gelb, orange, rot, violett) auf der Startseite. Ein Tipp öffnet alle
Warnungen mit Zeitraum, Beschreibung und Handlungsempfehlungen. Ohne Warnung bleibt alles unsichtbar.

Die Sensoren werden automatisch gefunden. Wer mehrere Regionen hat oder es abschalten will:

```yaml
weather_warnings:
  current: sensor.meine_region_aktuelle_warnstufe
  advance: sensor.meine_region_vorwarnstufe
  min_level: 1        # optional: Vorabinformationen (Stufe 0) ausblenden
# oder ganz aus:
# weather_warnings: false
```

### Homematic

Mit der Integration *Homematic(IP) Local* (OpenCCU/CCU3) zeigt die Karte Service- und
Alarmmeldungen als Blase auf der Startseite, mit Erklärung und Bestätigen-Knopf:

```yaml
homematic:
  service: sensor.ccu_servicemeldungen
  alarm: sensor.ccu_alarmmeldungen
  entry_id: 01ABC…   # Einstellungen → Geräte & Dienste → Homematic → ⋮ → Info (für „Bestätigen“)
```

### Auto

Für Autos mit Tür-, Fenster- und Schloss-Sensoren (z. B. *Audi connect*). Steht das Auto zu Hause
und ist etwas offen, erscheint auf der Startseite eine orange Blase. Ein Tipp öffnet ein Popup mit
dem Auto von oben: Offene Türen klappen auf, offene Fenster, Schiebedach, Kofferraum und Motorhaube
werden orange. Daneben stehen Liste, Tank und Reichweite, „Bestätigen“ blendet eine Meldung aus,
bis das Teil wieder zu ist (dafür je ein `input_boolean` und eine Automation, die ihn beim
Schließen ausschaltet). Dasselbe Popup öffnet sich auf der Haushalt-Seite mit `pop: car0`.

```yaml
car_alerts:
  - name: Auto
    tracker: device_tracker.auto_position      # Blase nur, wenn dieser Tracker „home“ ist
    last_update: sensor.auto_last_update
    lock: lock.auto_tuerschloss
    tank: sensor.auto_tankfuellstand
    range: sensor.auto_reichweite
    refresh: button.auto_daten_aktualisieren   # Knopf „Aktualisieren“ (mit Rückfrage)
    parts:                                      # für das Bild
      doors:   {lf: binary_sensor.auto_tuer_vl, rf: …, lr: …, rr: …}
      windows: {lf: binary_sensor.auto_fenster_vl, rf: …, lr: …, rr: …}
      sunroof: binary_sensor.auto_schiebedach
      trunk: binary_sensor.auto_kofferraum
      hood: binary_sensor.auto_motorhaube
    extra:                                      # nur anzeigen, ohne Startseiten-Meldung
      - {e: binary_sensor.auto_motorhaube, l: Motorhaube}
    items:                                      # melden und bestätigen
      - e: binary_sensor.auto_fenster
        l: Fenster
        ack: input_boolean.auto_quittiert_fenster
        detail: [{e: binary_sensor.auto_fenster_vl, l: vorne links}, …]
      - {e: binary_sensor.auto_schiebedach, l: Schiebedach, ack: input_boolean.auto_quittiert_schiebedach}
appliances:
  - {name: Auto, icon: mdi:car-side, status: lock.auto_tuerschloss, pop: car0, info: […]}
```

### Warnpunkte in der Menüleiste (`nav_alerts`)

Pro Seite eine Liste von Regeln. Trifft eine zu, bekommt der Menüpunkt einen Punkt
und die Seite oben einen Hinweis. Seiten: `light`, `plug`, `climate`, `cover`, `app`, `server`.

| Regel | Meldet |
|---|---|
| `unavailable: [ids]` | Entitäten, die nicht erreichbar sind |
| `dead: [ids]` | wie `unavailable`, meldet zusätzlich den Zustand „unbekannt“ (für Sensoren) |
| `on: [ids]` / `off: [ids]` | Entitäten, die an bzw. aus sind (optional `for_h: 168` = erst nach x Stunden) |
| `e` + `states` / `not_states` | eine Entität in (bzw. nicht in) bestimmten Zuständen |
| `e` + `below` / `above` | Zahlenwert unter/über einer Grenze |
| `battery: 10` | Akkus unter 10 % (`battery_only` / `battery_skip` filtern nach Art, z. B. `[heat]`) |
| `hm: [Gerätetypen]` | Homematic-Meldungen dieser Gerätetypen, `hm_rest: true` = alle übrigen |
| `label` | Beschriftung des Hinweises |

**Kurzschreibweisen**, damit nichts doppelt gepflegt werden muss:
`"@lights"`, `"@plugs"`, `"@covers"`, `"@windows"`, `"@climate_temps"` übernehmen
die Entitäten aus der übrigen Konfiguration:

```yaml
nav_alerts:
  light:   [{unavailable: ["@lights"]}]
  plug:    [{unavailable: ["@plugs"]}]
  cover:   [{unavailable: ["@covers"]}, {dead: ["@windows"]}]
  climate: [{dead: ["@climate_temps"]}, {battery: 10, battery_only: [heat]}]
  app:     [{battery: 10, battery_skip: [heat]}]
```

Außerdem überall: `map: "leer|OK"` ist die Kurzform von `map: {on: leer, off: OK}`
(gilt auch für `status_map`).

---

## 4. Updates

Neue Versionen erscheinen unter **Einstellungen → Updates** wie bei jeder anderen Karte.
Nach dem Update einmal hart neu laden (siehe Installation).

## 5. Wenn etwas nicht klappt

- **„Custom element doesn't exist: smart-wall-card“** → Browser-Cache leeren (Strg + Umschalt + R),
  prüfen, ob unter *Einstellungen → Dashboards → ⋮ → Ressourcen* der Eintrag
  `/local/community/smart-wall-card/smart-wall-card.js` existiert.
- **Ein Bereich bleibt leer** → Entitäts-ID prüfen (Tippfehler, Entität umbenannt).
- **Fehler in der Browser-Konsole** (F12) mit „smart-wall“ → als Issue in diesem Repository melden.

---

## Entwicklung

`src/` enthält die Quellen, `npm run build -- <version>` erzeugt `dist/smart-wall-card.js`
(eine minifizierte Datei, Schrift Open Sans lokal in `dist/`). `npm test` vergleicht alte und neue Ausgabe.
