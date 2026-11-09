# huSKIes

Statická stránka klubu. Otvorte `index.html` v prehliadači; stránka nevyžaduje zostavenie ani server.

## GitHub Pages a doména

1. Nahrajte súbory do vetvy `main` repozitára `TomasJavurek/huskies`.
2. V repozitári otvorte **Settings → Pages**, zvoľte **Deploy from a branch**, vetvu `main` a priečinok `/ (root)` a uložte.
3. V **Settings → Pages → Custom domain** nastavte `www.huskies.sk` a uložte. Súbor `CNAME` toto nastavenie zachováva pri publikovaní z vetvy.
4. V správe DNS domény nastavte záznam CNAME pre `www` na `tomasjavurek.github.io` (bez názvu repozitára). Pred zmenou skontrolujte existujúce záznamy; ponechajte e-mailové MX záznamy. Po rozšírení DNS zapnite v GitHub Pages **Enforce HTTPS**.
5. Ak má fungovať aj `huskies.sk` bez `www`, nastavte aj koreňové DNS záznamy podľa aktuálneho návodu GitHub Pages. Samotné presmerovanie v registrátorovi je alternatíva, nie náhrada za DNS CNAME pre vlastnú doménu.

Dokumentácia: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Pred publikovaním klub preverí texty, aktuálne podmienky a súhlas s použitím fotografií. Presný rozvrh a členský poplatok stránka odkazuje na kontakt, kým nebudú potvrdené.

## Administrácia (príprava)

Editor používa Decap CMS a hostované prihlasovanie Decap Turbo. Turbo Site ID je nastavené v `admin/config.yml`. V Turbo musí byť pripojený GitHub repozitár a povolená admin URL `https://www.huskies.sk/admin/`. Súbory treba nahrať do GitHubu a potom overiť prihlásenie a vytvorenie návrhu. Nastavený `editorial_workflow` vytvára návrhy na kontrolu; vlastníci repozitára musia nastaviť pravidlá vetvy `main`, ak chcú vynútiť kontrolu pred zlúčením. Skontrolujte aj oprávnenia Decap aplikácie a roly editorov.

Obsah je v `content/site.json`; stránka si ho načítava cez JavaScript. Pri lokálnej skúške spustite napríklad `python3 -m http.server` a otvorte `http://localhost:8000/`. Ak sa obsah nedá načítať, stránka zobrazí text pôvodného HTML. Editor je na `/admin/`, ale jeho prihlásenie a publikovanie sa dajú overiť až po nastavení Turbo a nasadení.

## Návrhy e-mailom

Stránka `/navrh/` umožňuje upraviť texty a obrázky bez prihlásenia. Tlačidlo stiahne HTML návrh vrátane fotografií; používateľ potom otvorí e-mail a súbor ručne priloží k správe pre `tomas.javurek@kinit.sk`. Návrh sa sám neodošle ani nezverejní a nenahrádza zdrojové súbory — zmeny treba skontrolovať a ručne preniesť do obsahu stránky. Pri viacerých alebo veľkých fotografiách môže príloha prekročiť limit e-mailovej služby.

Decap Turbo zostáva pripravený na dokončenie: Site ID je doplnené; treba nahrať zmeny, nastaviť oprávnenia a ochranu vetvy a vyskúšať prihlásenie aj vytvorenie návrhu na kontrolu.
