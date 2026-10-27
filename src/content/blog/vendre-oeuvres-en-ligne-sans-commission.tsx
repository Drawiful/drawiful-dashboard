import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Tu vends une œuvre 1 000 €. Selon l'endroit où elle a été achetée, il peut te rester 500 €… ou presque la
        totalité. Entre une galerie physique, une plateforme spécialisée, une marketplace généraliste et ta propre
        galerie en ligne, l'écart se compte en centaines d'euros par vente.
      </p>
      <p>
        Ce guide compare ce que tu gardes vraiment avec chaque solution, explique ce que la commission paie (car elle
        paie quelque chose), et détaille comment vendre en direct sans perdre en sérieux.
      </p>

      <KeyPoints>
        <ul>
          <li>Une galerie physique prend souvent autour de 50 % du prix de vente.</li>
          <li>Les plateformes d'art en ligne prélèvent en général entre 20 et 40 %.</li>
          <li>En vendant en direct, il ne reste que les frais de paiement : environ 1,5 % + 0,25 € par carte européenne avec Stripe.</li>
          <li>La meilleure stratégie combine souvent les deux : les plateformes pour te faire connaître, ta galerie pour vendre à ceux qui te suivent déjà.</li>
        </ul>
      </KeyPoints>

      <h2>Combien tu gardes sur une vente de 1 000 €</h2>
      <p>
        Voici un ordre de grandeur pour une œuvre originale vendue 1 000 €, hors frais d'expédition et hors impôts. Les
        taux viennent des conditions publiques constatées en 2025 et 2026.
      </p>

      <Table
        head={["Où tu vends", "Ce qui est prélevé", "Ce qu'il te reste"]}
        rows={[
          ["Galerie physique", "Environ 50 % (souvent négocié entre 40 et 60 %)", "≈ 500 €"],
          ["Saatchi Art", "Environ 40 % de commission", "≈ 600 €"],
          ["Artmajeur (offre gratuite)", "35 %, jusqu'à environ 20 % avec les abonnements payants", "≈ 650 à 800 €"],
          [
            "Etsy",
            "6,5 % de frais de transaction + 4 % + 0,30 € de frais de paiement + 0,18 € de mise en vente. Si la vente vient des publicités hors site d'Etsy : 15 % de plus (12 % au-delà de 10 000 $ de ventes par an), plafonnés à 100 $ par commande",
            "≈ 894 € (≈ 800 € si la vente vient des pubs hors site)",
          ],
          ["Ta propre galerie avec paiement Stripe", "1,5 % + 0,25 € pour une carte européenne standard", "≈ 985 € (moins l'abonnement de ton outil)"],
        ]}
        caption="Taux indicatifs : chaque plateforme fait évoluer ses conditions, vérifie-les toujours avant de t'inscrire. Sur Etsy, les 6,5 % s'appliquent aussi aux frais de port payés par l'acheteur."
      />

      <p>
        Sur une seule vente, la différence entre une galerie classique et une vente en direct atteint donc près de
        500 €. Sur dix ventes par an, c'est le prix d'un très bon matériel, d'un salon ou de plusieurs mois de loyer
        d'atelier.
      </p>

      <h2>Ce que la commission paie vraiment</h2>
      <p>
        Il serait malhonnête de présenter la commission comme de l'argent perdu. Elle rémunère un service, et ce service
        a de la valeur selon ta situation :
      </p>
      <ul>
        <li>
          <strong>Une galerie physique</strong> t'apporte un lieu, des vernissages, un carnet de collectionneurs, un
          accompagnement et souvent une crédibilité auprès des institutions.
        </li>
        <li>
          <strong>Une plateforme en ligne</strong> t'apporte des visiteurs : des acheteurs qui ne te connaissaient pas
          et qui découvrent ton travail en parcourant son catalogue.
        </li>
        <li>
          <strong>Une marketplace généraliste comme Etsy</strong> t'apporte un énorme trafic, mais noyé au milieu
          d'objets décoratifs, de reproductions et de créations de toutes sortes.
        </li>
      </ul>
      <p>
        La vraie question est donc : <strong>qui a trouvé l'acheteur ?</strong> Si la plateforme t'a amené un inconnu,
        sa commission est méritée. Si c'est un collectionneur qui te suit sur Instagram depuis deux ans et que tu as
        envoyé vers une plateforme pour encaisser, tu paies 20 à 50 % pour un simple terminal de paiement.
      </p>

      <h2>La stratégie qui fonctionne : deux canaux, deux rôles</h2>
      <p>
        Beaucoup d'artistes qui vivent de leur travail combinent les deux approches :
      </p>
      <ol>
        <li>
          <strong>Les plateformes et les galeries pour être découvert.</strong> Tu y présentes une sélection, tu
          acceptes la commission, et chaque vente te fait connaître de nouveaux collectionneurs.
        </li>
        <li>
          <strong>Ta propre galerie pour tout le reste.</strong> Tes abonnés Instagram, ta newsletter, les visiteurs
          d'un salon, les clients qui reviennent : toutes ces personnes te connaissent déjà. Envoie-les vers ta galerie,
          où tu gardes l'intégralité de la vente.
        </li>
      </ol>
      <p>
        Une règle importante : <strong>garde le même prix partout</strong>. Si une œuvre vaut 1 000 € en galerie, elle
        vaut 1 000 € sur ton site. Vendre moins cher en direct casse la confiance de tes galeristes et dévalorise ton
        travail. La différence, c'est toi qui la gardes, pas l'acheteur. On en parle en détail dans notre guide pour{" "}
        <Link href="/blog/fixer-prix-oeuvre-art">fixer le prix de ses œuvres</Link>.
      </p>

      <h2>Ce qu'il te faut pour vendre en direct sans perdre en sérieux</h2>
      <p>
        Un collectionneur qui achète 1 000 € sur un site inconnu a besoin d'être rassuré. Les plateformes le font pour
        toi ; en direct, c'est à toi de réunir ces éléments :
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
        Pense aussi à déclarer ces revenus selon ton statut (artiste-auteur, micro-entreprise…). Vendre en direct ne
        change rien à tes obligations, mais tout passe désormais par toi.
      </p>

      <h2>Faire venir les acheteurs vers ta galerie</h2>
      <p>
        Sans plateforme, personne ne tombera sur ta galerie par hasard au début. Les canaux qui fonctionnent le mieux
        pour un artiste indépendant :
      </p>
      <ul>
        <li>
          <strong>Le lien dans ta bio Instagram ou TikTok</strong>, et un rappel en légende quand tu publies une œuvre
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
          <strong>Tes anciens acheteurs</strong>, qui sont souvent tes meilleurs futurs clients. Garde le contact.
        </li>
      </ul>

      <h2>En résumé</h2>
      <p>
        Vendre sans commission ne veut pas dire tourner le dos aux galeries et aux plateformes. Cela veut dire arrêter
        de payer 20 à 50 % sur les ventes que tu as provoquées toi-même. Pour chaque collectionneur qui te connaît
        déjà, une galerie à ton nom, un paiement simple et un certificat sérieux suffisent.
      </p>

      <DrawifulCta
        title="Ta galerie à ton nom, sans commission"
        text="Drawiful te donne une galerie en ligne visitable en 3D, une boutique avec paiement par carte et un certificat d'authenticité numéroté pour chaque œuvre. Tu gardes 100 % de tes ventes : seuls les frais Stripe s'appliquent."
      />

      <Note>
        Sources : conditions publiques des plateformes et articles spécialisés consultés en octobre 2026 (Etsy, Artmajeur,
        Saatchi Art, tarifs Stripe France). Ces taux évoluent : vérifie toujours les conditions en vigueur avant de
        choisir.
      </Note>
    </>
  );
}
