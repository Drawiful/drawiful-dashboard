import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Avoir son propre site, c'est passer du statut d'artiste « présent sur Instagram » à celui d'artiste qui vend.
        C'est l'adresse que tu donnes à un collectionneur, que tu imprimes sur tes cartes, que tu affiches à côté de tes
        œuvres en exposition. Et c'est le seul endroit où personne ne prend de commission sur tes ventes.
      </p>
      <p>
        Bonne nouvelle : il n'est plus nécessaire de savoir coder. Voici les quatre options possibles, ce que chacune
        implique vraiment, et ce qu'un site d'artiste doit contenir pour donner envie d'acheter.
      </p>

      <KeyPoints>
        <ul>
          <li>Quatre options : une boutique sur une plateforme, un créateur de site généraliste, WordPress, ou une solution conçue pour les artistes.</li>
          <li>La majorité de tes visiteurs arrivera depuis un téléphone : ton site doit d'abord être parfait sur mobile.</li>
          <li>Chaque œuvre doit avoir sa propre page, avec photo, dimensions, technique, prix et bouton d'achat.</li>
          <li>Le plus important n'est pas l'outil, c'est de mettre en ligne vite et de partager l'adresse partout.</li>
        </ul>
      </KeyPoints>

      <h2>Les quatre options pour vendre ses tableaux en ligne</h2>
      <Table
        head={["Option", "Points forts", "Limites"]}
        rows={[
          [
            "Boutique sur une plateforme (Etsy, Artmajeur…)",
            "En ligne en une heure, visiteurs déjà présents sur la plateforme",
            "Commission sur chaque vente, tu n'es pas chez toi, tes œuvres côtoient celles des concurrents",
          ],
          [
            "Créateur de site généraliste (Wix, Squarespace, Shopify…)",
            "Très flexible, nombreux modèles, ton propre nom de domaine",
            "Abonnement mensuel, plusieurs jours de mise en page, rien n'est pensé pour les œuvres (certificat, taille réelle)",
          ],
          [
            "WordPress avec une extension boutique",
            "Contrôle total, hébergement peu coûteux",
            "Technique : réglages, mises à jour, sécurité et paiement à gérer toi-même",
          ],
          [
            "Solution dédiée aux artistes",
            "Prête à l'emploi, pensée pour présenter et vendre des œuvres originales",
            "Moins de liberté pour créer des pages qui n'ont rien à voir avec tes œuvres",
          ],
        ]}
        caption="Les tarifs et les frais par vente varient selon les formules de chaque outil : compare-les au moment de choisir."
      />
      <p>
        Les plateformes restent utiles pour te faire découvrir par de nouveaux acheteurs. Mais pour les collectionneurs
        qui te connaissent déjà, ton propre site te permet de garder l'intégralité de la vente. On compare les
        commissions en détail dans notre guide pour{" "}
        <Link href="/blog/vendre-oeuvres-en-ligne-sans-commission">vendre ses œuvres en ligne sans commission</Link>.
      </p>

      <h2>Comment choisir</h2>
      <ul>
        <li>
          <strong>Tu veux être en ligne ce week-end et tu n'aimes pas la technique</strong> : une solution dédiée aux
          artistes, ou un créateur de site avec un modèle « portfolio » si tu es prêt à y passer quelques soirées.
        </li>
        <li>
          <strong>Tu vends aussi des produits dérivés</strong> (tirages, cartes, textiles) : un créateur de site orienté
          boutique peut être plus adapté, quitte à le compléter.
        </li>
        <li>
          <strong>Tu aimes bricoler et tu as du temps</strong> : WordPress te donnera une liberté totale, à condition
          d'accepter la maintenance.
        </li>
      </ul>
      <p>
        Quel que soit l'outil, pose-toi trois questions avant de payer : le site est-il beau sur un téléphone ? Peut-on
        acheter une œuvre par carte en quelques clics ? Et combien me reste-t-il réellement sur une vente de 1 000 € ?
      </p>

      <h2>Ce que ton site doit contenir</h2>
      <h3>Les pages indispensables</h3>
      <ul>
        <li>
          <strong>La galerie</strong> : tes œuvres disponibles, avec une photo nette et le prix visible. Un prix caché («
          prix sur demande ») fait fuir la plupart des acheteurs en ligne.
        </li>
        <li>
          <strong>Une page par œuvre</strong> : c'est elle que tu partageras et que Google pourra afficher.
        </li>
        <li>
          <strong>À propos</strong> : ton parcours, ta démarche, une photo de toi à l'atelier. Les collectionneurs
          achètent aussi un artiste.
        </li>
        <li>
          <strong>Contact</strong>, pour les questions et les commandes.
        </li>
        <li>
          <strong>Mentions légales, conditions de vente et politique de retour</strong>, obligatoires dès que tu vends.
        </li>
      </ul>

      <h3>La fiche de chaque œuvre</h3>
      <ul>
        <li>Plusieurs photos : vue de face, détail de la matière, et si possible une mise en situation pour juger de la taille.</li>
        <li>Le titre, l'année, la technique et le support.</li>
        <li>Les dimensions exactes en centimètres, en précisant si l'œuvre est encadrée.</li>
        <li>Le prix, les frais et délais de livraison.</li>
        <li>
          La mention d'un certificat d'authenticité, qui rassure énormément à distance. Voici{" "}
          <Link href="/blog/certificat-authenticite-oeuvre-art">ce qu'il doit contenir</Link>.
        </li>
        <li>Un bouton d'achat clair, avec un paiement par carte sécurisé.</li>
      </ul>

      <h3>Les détails qui font vendre</h3>
      <ul>
        <li>
          <strong>Un nom de domaine à ton nom</strong> : une adresse courte et facile à dicter inspire confiance.
        </li>
        <li>
          <strong>Un site rapide</strong> : compresse tes images, un visiteur sur téléphone n'attend pas.
        </li>
        <li>
          <strong>Des titres de page descriptifs</strong> pour Google : « Coucher de soleil sur la Loire, acrylique
          sur toile, 81 × 65 cm » plutôt que « IMG_2045 ».
        </li>
        <li>
          <strong>La cohérence des prix</strong> : le même prix sur ton site, sur les plateformes et en galerie. Voir
          notre méthode pour <Link href="/blog/fixer-prix-oeuvre-art">fixer le prix de ses œuvres</Link>.
        </li>
      </ul>

      <h2>Mettre ton site en ligne en 7 étapes</h2>
      <ol>
        <li>Choisis ton nom : ton nom d'artiste, court et facile à écrire.</li>
        <li>Sélectionne 10 à 20 œuvres disponibles et cohérentes entre elles, plutôt que tout ton travail.</li>
        <li>Photographie-les à la lumière du jour, bien droites, sans reflet, avec des couleurs fidèles.</li>
        <li>Écris pour chaque œuvre quelques lignes sur son histoire ou sa technique.</li>
        <li>Fixe tes prix et tes frais d'expédition.</li>
        <li>Active le paiement par carte et rédige tes conditions de vente.</li>
        <li>Publie, puis annonce-le : bio Instagram, signature d'e-mail, cartes de visite, QR code en exposition.</li>
      </ol>
      <p>
        Le piège le plus fréquent est de repousser le lancement pour peaufiner. Un site simple mis en ligne cette semaine
        te rapportera plus qu'un site parfait dans six mois. Tu l'amélioreras ensuite, au fil des retours.
      </p>

      <DrawifulCta
        title="Ton site d'artiste, prêt en 10 minutes"
        text="Drawiful crée ta galerie à ton nom (tonnom.drawiful.art, ou ton propre nom de domaine), avec boutique, paiement par carte, certificats d'authenticité et visite en 3D. Aucune ligne de code, et aucune commission sur tes ventes."
      />

      <Note>
        Les fonctionnalités et les tarifs des outils cités évoluent régulièrement : vérifie toujours les conditions
        actuelles avant de t'engager.
      </Note>
    </>
  );
}
