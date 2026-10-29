import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Vous vendez une œuvre 1 000 €. Selon l'endroit où elle a été achetée, il peut vous rester 500 €… ou presque la
        totalité. Entre une galerie physique, une plateforme spécialisée, une marketplace généraliste et votre propre
        galerie en ligne, l'écart se compte en centaines d'euros par vente.
      </p>
      <p>
        Ce guide compare ce que vous gardez vraiment avec chaque solution, explique ce que la commission paie (car elle
        paie quelque chose), et détaille comment vendre en direct sans perdre en sérieux.
      </p>

      <KeyPoints>
        <ul>
          <li>Une galerie physique prend souvent autour de 50 % du prix de vente.</li>
          <li>Les plateformes d'art en ligne prélèvent en général entre 20 et 40 %.</li>
          <li>En vendant en direct, il ne reste que les frais de paiement : environ 1,5 % + 0,25 € par carte européenne avec Stripe.</li>
          <li>La meilleure stratégie combine souvent les deux : les plateformes pour vous faire connaître, votre galerie pour vendre à ceux qui vous suivent déjà.</li>
        </ul>
      </KeyPoints>

      <h2>Combien vous gardez sur une vente de 1 000 €</h2>
      <p>
        Voici un ordre de grandeur pour une œuvre originale vendue 1 000 €, hors frais d'expédition et hors impôts. Les
        taux viennent des conditions publiques constatées en 2025 et 2026.
      </p>

      <Table
        head={["Où vous vendez", "Ce qui est prélevé", "Ce qu'il vous reste"]}
        rows={[
          ["Galerie physique", "Environ 50 % (souvent négocié entre 40 et 60 %)", "≈ 500 €"],
          ["Saatchi Art", "Environ 40 % de commission", "≈ 600 €"],
          ["Artmajeur (offre gratuite)", "35 %, jusqu'à environ 20 % avec les abonnements payants", "≈ 650 à 800 €"],
          [
            "Etsy",
            "6,5 % de frais de transaction + 4 % + 0,30 € de frais de paiement + 0,18 € de mise en vente. Si la vente vient des publicités hors site d'Etsy : 15 % de plus (12 % au-delà de 10 000 $ de ventes par an), plafonnés à 100 $ par commande",
            "≈ 894 € (≈ 800 € si la vente vient des pubs hors site)",
          ],
          ["Votre propre galerie avec paiement Stripe", "1,5 % + 0,25 € pour une carte européenne standard", "≈ 985 € (moins l'abonnement de votre outil)"],
        ]}
        caption="Taux indicatifs : chaque plateforme fait évoluer ses conditions, vérifiez-les toujours avant de vous inscrire. Sur Etsy, les 6,5 % s'appliquent aussi aux frais de port payés par l'acheteur."
      />

      <p>
        Sur une seule vente, la différence entre une galerie classique et une vente en direct atteint donc près de
        500 €. Sur dix ventes par an, c'est le prix d'un très bon matériel, d'un salon ou de plusieurs mois de loyer
        d'atelier.
      </p>

      <h2>Ce que la commission paie vraiment</h2>
      <p>
        Il serait malhonnête de présenter la commission comme de l'argent perdu. Elle rémunère un service, et ce service
        a de la valeur selon votre situation :
      </p>
      <ul>
        <li>
          <strong>Une galerie physique</strong> vous apporte un lieu, des vernissages, un carnet de collectionneurs, un
          accompagnement et souvent une crédibilité auprès des institutions.
        </li>
        <li>
          <strong>Une plateforme en ligne</strong> vous apporte des visiteurs : des acheteurs qui ne vous connaissaient pas
          et qui découvrent votre travail en parcourant son catalogue.
        </li>
        <li>
          <strong>Une marketplace généraliste comme Etsy</strong> vous apporte un énorme trafic, mais noyé au milieu
          d'objets décoratifs, de reproductions et de créations de toutes sortes.
        </li>
      </ul>
      <p>
        La vraie question est donc : <strong>qui a trouvé l'acheteur ?</strong> Si la plateforme vous a amené un inconnu,
        sa commission est méritée. Si c'est un collectionneur qui vous suit sur Instagram depuis deux ans et que vous avez
        envoyé vers une plateforme pour encaisser, vous payez 20 à 50 % pour un simple terminal de paiement.
      </p>

      <h2>La stratégie qui fonctionne : deux canaux, deux rôles</h2>
      <p>
        Beaucoup d'artistes qui vivent de leur travail combinent les deux approches :
      </p>
      <ol>
        <li>
          <strong>Les plateformes et les galeries pour être découvert.</strong> Vous y présentez une sélection, vous
          acceptez la commission, et chaque vente vous fait connaître de nouveaux collectionneurs.
        </li>
        <li>
          <strong>Votre propre galerie pour tout le reste.</strong> Vos abonnés Instagram, votre newsletter, les visiteurs
          d'un salon, les clients qui reviennent : toutes ces personnes vous connaissent déjà. Envoyez-les vers votre galerie,
          où vous gardez l'intégralité de la vente.
        </li>
      </ol>
      <p>
        Une règle importante : <strong>gardez le même prix partout</strong>. Si une œuvre vaut 1 000 € en galerie, elle
        vaut 1 000 € sur votre site. Vendre moins cher en direct casse la confiance de vos galeristes et dévalorise votre
        travail. La différence, c'est vous qui la gardez, pas l'acheteur. On en parle en détail dans notre guide pour{" "}
        <Link href="/blog/fixer-prix-oeuvre-art">fixer le prix de ses œuvres</Link>.
      </p>

      <h2>Ce qu'il vous faut pour vendre en direct sans perdre en sérieux</h2>
      <p>
        Un collectionneur qui achète 1 000 € sur un site inconnu a besoin d'être rassuré. Les plateformes le font pour
        vous ; en direct, c'est à vous de réunir ces éléments :
      </p>
      <ul>
        <li>
          <strong>Une présentation professionnelle</strong> : de bonnes photos, les dimensions exactes, la technique, et
          idéalement une mise en situation pour juger de la taille réelle de l'œuvre.
        </li>
        <li>
          <strong>Un paiement sécurisé par carte</strong>, sans virement ni échange de messages pour conclure. Chaque
          étape en plus fait fuir une partie des acheteurs.
        </li>
        <li>
          <strong>Un certificat d'authenticité</strong> pour chaque œuvre. Il rassure l'acheteur et protège la valeur de
          revente. Voici <Link href="/blog/certificat-authenticite-oeuvre-art">ce qu'il doit contenir</Link>.
        </li>
        <li>
          <strong>Des informations légales claires</strong> : mentions légales, conditions de vente, politique de
          retour et d'expédition.
        </li>
        <li>
          <strong>Un emballage et une expédition soignés</strong>, avec assurance pour les œuvres de valeur.
        </li>
      </ul>
      <p>
        Pensez aussi à déclarer ces revenus selon votre statut (artiste-auteur, micro-entreprise…). Vendre en direct ne
        change rien à vos obligations, mais tout passe désormais par vous.
      </p>

      <h2>Faire venir les acheteurs vers votre galerie</h2>
      <p>
        Sans plateforme, personne ne tombera sur votre galerie par hasard au début. Les canaux qui fonctionnent le mieux
        pour un artiste indépendant :
      </p>
      <ul>
        <li>
          <strong>Le lien dans votre bio Instagram ou TikTok</strong>, et un rappel en légende quand vous publiez une œuvre
          disponible.
        </li>
        <li>
          <strong>Une newsletter</strong>, même modeste : prévenir 200 personnes intéressées avant une nouvelle série
          vaut mieux que 10 000 vues anonymes.
        </li>
        <li>
          <strong>Les salons, expositions et marchés d'art</strong>, avec un QR code à côté de chaque œuvre qui renvoie
          vers sa page : le visiteur qui hésite peut acheter plus tard.
        </li>
        <li>
          <strong>Vos anciens acheteurs</strong>, qui sont souvent vos meilleurs futurs clients. Gardez le contact.
        </li>
      </ul>

      <h2>En résumé</h2>
      <p>
        Vendre sans commission ne veut pas dire tourner le dos aux galeries et aux plateformes. Cela veut dire arrêter
        de payer 20 à 50 % sur les ventes que vous avez provoquées vous-même. Pour chaque collectionneur qui vous connaît
        déjà, une galerie à votre nom, un paiement simple et un certificat sérieux suffisent.
      </p>

      <DrawifulCta
        title="Votre galerie à votre nom, sans commission"
        text="Drawiful vous donne une galerie en ligne visitable en 3D, une boutique avec paiement par carte et un certificat d'authenticité numéroté pour chaque œuvre. Vous gardez 100 % de vos ventes : seuls les frais Stripe s'appliquent."
      />

      <Note>
        Sources : conditions publiques des plateformes et articles spécialisés consultés en octobre 2026 (Etsy, Artmajeur,
        Saatchi Art, tarifs Stripe France). Ces taux évoluent : vérifiez toujours les conditions en vigueur avant de
        choisir.
      </Note>
    </>
  );
}
