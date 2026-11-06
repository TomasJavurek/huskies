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
