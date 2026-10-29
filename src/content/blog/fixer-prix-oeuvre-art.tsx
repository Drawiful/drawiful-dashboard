import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Fixer le prix de ses œuvres est souvent l'étape la plus inconfortable pour un artiste. Trop bas, votre travail
        paraît amateur et vous ne couvrez pas votre temps. Trop haut, rien ne se vend. Et une fois un prix affiché, il est
        difficile de le baisser sans abîmer la confiance de ceux qui vous ont déjà acheté.
      </p>
      <p>
        Il n'existe pas de formule parfaite, mais trois méthodes simples permettent d'arriver à un prix défendable. Le
        mieux est de les croiser.
      </p>

      <KeyPoints>
        <ul>
          <li>Méthode 1 : le prix au point, à partir du format de la toile.</li>
          <li>Méthode 2 : le coût des matériaux plus votre temps de travail.</li>
          <li>Méthode 3 : la comparaison avec des artistes au parcours proche.</li>
          <li>Ensuite, une seule règle : un prix cohérent, identique partout, qui ne baisse jamais.</li>
        </ul>
      </KeyPoints>

      <h2>Méthode 1 : le prix au point</h2>
      <p>
        C'est une méthode traditionnelle en peinture, surtout en France. Chaque format de châssis standard correspond à
        un nombre de « points ». Le prix de base se calcule simplement :
      </p>
      <p>
        <strong>Prix = nombre de points du format × valeur de votre point</strong>
      </p>
      <p>Voici quelques formats courants de la série « Figure » (F), la plus utilisée :</p>
      <Table
        head={["Format", "Dimensions (cm)", "À 15 € le point", "À 20 € le point"]}
        rows={[
          ["4 F", "33 × 24", "60 €", "80 €"],
          ["6 F", "41 × 33", "90 €", "120 €"],
          ["10 F", "55 × 46", "150 €", "200 €"],
          ["15 F", "65 × 54", "225 €", "300 €"],
          ["20 F", "73 × 60", "300 €", "400 €"],
          ["25 F", "81 × 65", "375 €", "500 €"],
          ["40 F", "100 × 81", "600 €", "800 €"],
        ]}
        caption="Les séries Paysage (P) et Marine (M) ont les mêmes longueurs mais des largeurs plus étroites. Pour un format non standard, prenez le format le plus proche."
      />
      <p>
        <strong>Quelle valeur de point choisir ?</strong> On cite souvent, pour un artiste qui débute, une valeur de
        l'ordre de 15 à 20 € pour une acrylique sur toile et de 10 à 15 € pour un dessin sur papier, un peu plus pour
        l'huile. Ce n'est qu'un point de départ : la valeur de votre point augmente avec vos ventes, vos expositions et votre
        notoriété.
      </p>
      <p>
        <strong>Ses limites</strong> : la méthode ne tient compte ni du temps passé, ni de la complexité, ni de la
        technique. Un dessin très détaillé qui vous a pris quarante heures peut se retrouver moins cher qu'une grande toile
        réalisée en une après-midi. D'où l'intérêt de la croiser avec la méthode suivante.
      </p>

      <h2>Méthode 2 : les matériaux plus votre temps</h2>
      <p>
        Cette méthode répond à une question simple : combien devez-vous vendre pour ne pas travailler à perte ?
      </p>
      <p>
        <strong>Prix = coût des matériaux + (heures de travail × taux horaire)</strong>
      </p>
      <p>
        Exemple : un dessin au graphite sur un papier de qualité, avec 25 € de matériel (papier, crayons, fixatif) et
        15 heures de travail. Avec un taux horaire de 20 €, cela donne 25 + 15 × 20 = <strong>325 €</strong>.
      </p>
      <p>
        Pensez à inclure ce qu'on oublie souvent : l'encadrement si l'œuvre est vendue encadrée, les essais ratés, le
        temps de photographie et de mise en ligne. Gardez en revanche les frais d'expédition à part, ajoutés au moment de
        la vente.
      </p>
      <p>
        <strong>Ses limites</strong> : le marché ne paie pas le temps passé. Si votre calcul donne 2 000 € et que des
        artistes comparables vendent autour de 600 €, il faudra ajuster, ou travailler sur des formats et des techniques
        plus rapides en parallèle.
      </p>

      <h2>Méthode 3 : la comparaison avec des artistes proches</h2>
      <p>
        Cherchez une dizaine d'artistes dont le parcours ressemble au vôtre : même technique, formats similaires, nombre
        d'expositions et notoriété comparables. Puis regardez leurs prix.
      </p>
      <ul>
        <li>
          <strong>Intéressez-vous aux prix de vente réels</strong>, pas seulement aux prix affichés : une œuvre en ligne
          depuis trois ans n'est pas une preuve de prix.
        </li>
        <li>
          <strong>Comparez à format égal</strong> : rapportez les prix au format, ou utilisez la méthode du point pour
          comparer.
        </li>
        <li>
          <strong>Soyez honnête sur votre position</strong> : vous pouvez vous placer un peu au-dessus si votre travail est plus
          abouti, mais un artiste qui n'a jamais exposé se vend rarement au prix d'un artiste représenté par une galerie.
        </li>
      </ul>

      <h2>Un exemple complet</h2>
      <p>Une acrylique sur toile de 55 × 46 cm (format 10 F), réalisée en 12 heures avec 40 € de matériel :</p>
      <ul>
        <li>Au point, à 18 € : 10 × 18 = 180 €.</li>
        <li>Matériaux et temps, à 20 € de l'heure : 40 + 12 × 20 = 280 €.</li>
        <li>Les artistes comparables vendent ce format entre 250 et 350 €.</li>
      </ul>
      <p>
        Le point donne un minimum, le calcul horaire votre seuil de rentabilité, et la comparaison confirme que le marché
        accepte cette fourchette. Un prix de <strong>290 €</strong> est cohérent et défendable. Ensuite, appliquez la même
        logique à toute votre série, pour que vos prix restent lisibles d'une œuvre à l'autre.
      </p>

      <h2>Les règles qui comptent plus que la formule</h2>
      <ol>
        <li>
          <strong>Le même prix partout.</strong> En galerie, sur une plateforme ou sur votre propre site, une œuvre a un
          seul prix. Si une galerie prend 50 %, votre prix en direct n'est pas la moitié du prix en galerie : c'est le même,
          et la différence vous revient. Voir notre comparatif pour{" "}
          <Link href="/blog/vendre-oeuvres-en-ligne-sans-commission">vendre ses œuvres en ligne sans commission</Link>.
        </li>
        <li>
          <strong>Ne jamais baisser.</strong> Une baisse dévalorise les œuvres déjà achetées par vos collectionneurs. Si
          une œuvre ne se vend pas, proposez plutôt un format plus petit ou une série plus accessible.
        </li>
        <li>
          <strong>Augmenter progressivement.</strong> Quand vous vendez régulièrement, quand vos œuvres partent vite ou après
          une exposition marquante, augmentez vos prix par paliers modérés, par exemple de 10 à 20 %.
        </li>
        <li>
          <strong>Proposer plusieurs niveaux de prix.</strong> Des petits formats ou des dessins pour les premiers
          acheteurs, des grandes pièces pour les collectionneurs fidèles.
        </li>
        <li>
          <strong>Justifier la valeur.</strong> Un certificat d'authenticité, des dimensions précises et une belle
          présentation aident l'acheteur à accepter votre prix. Voir{" "}
          <Link href="/blog/certificat-authenticite-oeuvre-art">comment rédiger un certificat d'authenticité</Link>.
        </li>
      </ol>

      <DrawifulCta
        title="Exposez vos œuvres à taille réelle"
        text="Dans une galerie Drawiful visitable en 3D, chaque œuvre est accrochée à sa taille réelle : l'acheteur perçoit le format avant d'acheter. Et sans commission, le prix que vous fixez est le prix que vous touchez, moins les frais de paiement."
      />

      <Note>
        Les valeurs de point et les exemples sont des ordres de grandeur pour un artiste qui débute ou se développe, pas
        une cote officielle. Indiquez vos prix TVA comprise si vous y êtes assujetti.
      </Note>
    </>
  );
}
