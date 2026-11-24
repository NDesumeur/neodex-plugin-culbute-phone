# Culbute

Un jeu d'adresse en pixel art : une bouteille d'eau saute de meuble en meuble, du salon à la cuisine, la chambre et le jardin, en faisant des tours sur elle-même. Elle doit toujours retomber debout.

*English version: [README.en.md](README.en.md)*


## Version téléphone

On joue d'un doigt : maintiens-le sur le jeu pour charger le saut, lâche pour lancer la bouteille, et en mode expert maintiens-le encore en l'air pour qu'elle tourne plus vite. NOUVELLE PARTIE, PAUSE et PLEIN ÉCRAN sont juste sous le jeu ; la partie se met en pause toute seule quand tu quittes l'appli (à l'arrivée si la bouteille est en l'air). Les boutons des objets passent à la ligne pour tenir sur le petit écran.

## Mode facile, objets et figures (nouveau en 1.2.0)

- **Mode facile** (réglé par défaut) : un seul geste. Tu maintiens pour viser, tu lâches pour sauter, et la rotation se règle toute seule pour retomber debout. Cinq essais, meubles plus proches, record à part. Le **mode expert** garde l'ancienne façon de jouer.
- **Quatre objets**, chacun avec sa physique : la bouteille, la canette (tourne vite, tient aussi à l'envers), le livre (lent, retombe sur une face ou l'autre) et le téléphone (rapide et exigeant). Ils se débloquent avec les culbutes (15, 40, 80).
- **Figures notées** : deux tours complets en l'air, c'est un DOUBLE (points ×2) ; trois, un TRIPLE (×3).
- **Pièce de départ** : une pièce atteinte une fois (cuisine, chambre, jardin) peut servir de départ.

## Commandes

- **Espace**, **↑** ou **clic** : maintiens pour charger le saut, lâche pour lancer la bouteille.
- **En l'air**, maintiens de nouveau : la bouteille tourne deux fois plus vite.
- **P** ou **Échap** : pause (pas en plein saut).
- **Manette** : A (ou B, RB, RT, croix haut) maintenu pour charger puis pour tourner, **Start** pour la pause.
- **PLEIN ÉCRAN** : le bouton sous le jeu.

## Comment ça marche

- Plus tu maintiens, plus le saut va **loin et haut**. La jauge à côté de la bouteille et des points blancs montrent tout le saut.
- Une **flèche** et un **fantôme** de la bouteille montrent où elle va retomber et dans quel sens, même en vol : **vert**, elle se posera debout ; **orange**, maintiens pour la faire tourner plus vite ; **rouge**, elle tombe à côté. Le dessus du meuble visé s'éclaire de la même couleur.
- En l'air, la bouteille tourne toute seule, lentement. **Maintenir** la fait tourner plus vite : à toi de doser pour qu'elle ait fait un tour (ou deux) en arrivant.
- Elle doit se poser **debout** sur le dessus d'un meuble, à 46° près. Presque droite (14° près), c'est **PARFAIT** : ralenti, éclair, étoiles, et les points comptent double. Le jeu ralentit aussi juste avant une bonne réception.
- Sauter **par-dessus** un meuble pour atteindre le suivant rapporte plus. Chaque culbute réussie d'affilée ajoute un bonus.
- Si elle retombe sur le meuble de départ, rien n'est perdu. Si elle se **renverse** ou tombe **par terre**, tu perds une des **trois bouteilles** et tu repars du même meuble. À la troisième, la partie est finie.
- Tous les 15 meubles, on passe une porte et on change de **pièce** : le **salon** (tables, tabourets, livres, commodes, caisses), la **cuisine** (plans de travail, frigo, chaises), la **chambre** (lit, armoire, chevet, coffre), puis le **jardin** (banc, tonneau, pots, souches, muret), et on recommence. Les meubles rapetissent et s'écartent à mesure qu'on avance. Un chiffre marque chaque dizaine.

## Statistiques

Le panneau Records garde ton **meilleur score**, le nombre de **parties**, de **culbutes** et de culbutes **parfaites**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Culbute → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
